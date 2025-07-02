export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SblCe6pwlAdRMG',
    priceId: 'price_1RgXgHG3K0hLTrPjJ9eH2e9A',
    name: 'ResuNaut Explorer',
    description: 'Launch your job search with a basic resume scan! 🪐 Free forever, but limited to 3 optimizations/month.',
    mode: 'payment',
    price: 0,
    currency: 'cad'
  },
  {
    id: 'prod_SblHcRjbQ4KEpc',
    priceId: 'price_1RgXkdG3K0hLTrPjhh1UjYkc',
    name: 'ResuNaut Boost Pack',
    description: 'Fuel up for a single job application! ⛽ One AI-powered resume + cover letter.',
    mode: 'payment',
    price: 5.00,
    currency: 'cad'
  },
  {
    id: 'prod_SblFfuEnauALsI',
    priceId: 'price_1RgXieG3K0hLTrPjszp2OXuJ',
    name: 'ResuNaut Pilot',
    description: 'Take control of your career trajectory! 🚀 Unlimited resume boosts + ATS compatibility checks.',
    mode: 'subscription',
    price: 10.00,
    currency: 'cad',
    interval: 'month'
  },
  {
    id: 'prod_SblGtQdFqAuqRH',
    priceId: 'price_1RgXjyG3K0hLTrPjPv7AiOaj',
    name: 'ResuNaut Commander',
    description: 'Full mission control for your job search! ✨ Save 20% with annual billing',
    mode: 'subscription',
    price: 96.00,
    currency: 'cad',
    interval: 'year'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};