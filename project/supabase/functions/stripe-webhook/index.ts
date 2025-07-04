import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'stripe';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

// --- Environment Variable Checks ---
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing one or more required environment variables for Stripe/Supabase webhook.');
}

// Config
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  appInfo: { name: 'ResuNaut', version: '1.0.0' }
});
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Types
type SpaceEvent = 'launch' | 'orbit' | 'abort';
type PaymentType = 'subscription' | 'one-time';

Deno.serve(async (req) => {
  try {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('🚀 Method not allowed', { status: 405 });
    }

    // Verify Webhook
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('⚠️ No signature found', { status: 400 });
    }

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    // Process Event
    await handleStripeEvent(event);
    return Response.json({ status: 'mission-accomplished' });

  } catch (error) {
    console.error('🌌 Webhook Error:', error);
    return Response.json(
      { error: 'payload-failed', message: error.message },
      { status: 500 }
    );
  }
});

// --- Core Functions ---
async function handleStripeEvent(event: Stripe.Event) {
  const eventType = event.type as SpaceEvent;
  const stripeData = event.data?.object as Stripe.Checkout.Session | Stripe.Subscription | Stripe.PaymentIntent;

  console.log(`🛰️ Processing ${eventType} event`);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSession(stripeData as Stripe.Checkout.Session);
      break;

    case 'customer.subscription.updated':
      await syncCustomerSubscription((stripeData as Stripe.Subscription).customer as string);
      break;

    case 'payment_intent.succeeded':
      if (!(stripeData as Stripe.PaymentIntent).invoice) {
        await handleOneTimePayment(stripeData as Stripe.PaymentIntent);
      }
      break;

    default:
      // Unhandled event type
      break;
  }
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const paymentType: PaymentType = session.mode === 'subscription' ? 'subscription' : 'one-time';

  console.log(`📡 Detected ${paymentType} payment for astronaut ${customerId}`);

  if (paymentType === 'subscription') {
    await syncCustomerSubscription(customerId);
  } else if (session.payment_status === 'paid') {
    await supabase.from('stripe_orders').insert({
      checkout_session_id: session.id,
      payment_intent_id: session.payment_intent,
      customer_id: customerId,
      amount_total: session.amount_total,
      currency: session.currency,
      status: 'completed' // <-- FIXED: use a valid status
    });
  }
}

async function syncCustomerSubscription(customerId: string) {
  try {
    const [subscription] = (await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method']
    })).data;

    if (!subscription) {
      console.log('🛑 No active subscription - entering standby mode');
      return await supabase.from('stripe_subscriptions')
        .upsert({ customer_id: customerId, status: 'standby' });
    }

    const payload = {
      customer_id: customerId,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0].price.id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      status: subscription.status,
      ...(subscription.default_payment_method && {
        payment_method_brand: (subscription.default_payment_method as Stripe.PaymentMethod).card?.brand,
        payment_method_last4: (subscription.default_payment_method as Stripe.PaymentMethod).card?.last4
      })
    };

    await supabase.from('stripe_subscriptions')
      .upsert(payload, { onConflict: 'customer_id' });

    console.log(`✅ Successfully synced ${subscription.status} subscription`);

  } catch (error) {
    console.error('💥 Subscription sync failed:', error);
    throw error;
  }
}

async function handleOneTimePayment(payment: Stripe.PaymentIntent) {
  await supabase.from('stripe_orders').insert({
    payment_intent_id: payment.id,
    customer_id: payment.customer as string,
    amount_total: payment.amount,
    currency: payment.currency,
    status: 'completed'
  });
  console.log('💰 One-time payment processed');
}