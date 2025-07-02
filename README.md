# ResuNaut 🚀

Navigate your career journey with AI-powered resume optimization.

## 🌟 Features

- **AI-Powered Analysis**: Advanced resume optimization using artificial intelligence
- **ATS Compatibility**: Ensure your resume passes through Applicant Tracking Systems
- **Real-time Feedback**: Get instant suggestions for improvement
- **Accessibility First**: WCAG 2.1 Level AA compliant interface
- **Responsive Design**: Works seamlessly on all devices

## 🚀 Live Demo

Visit the live application: [https://yourusername.github.io/resunaut/](https://yourusername.github.io/resunaut/)

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **File Processing**: PDF.js, Mammoth.js
- **Backend**: Supabase (for authentication and data)
- **Deployment**: GitHub Pages

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resunaut.git
   cd resunaut
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Deployment to GitHub Pages

### Automatic Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Fork or clone this repository**

2. **Update the base path in `vite.config.ts`**
   ```typescript
   export default defineConfig({
     base: '/your-repository-name/', // Replace with your repo name
     // ... other config
   });
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

4. **Push to main branch**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

5. **Access your deployed site**
   Your site will be available at: `https://yourusername.github.io/your-repository-name/`

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (requires gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

## 🎨 Customization

### Updating the Base Path

Before deploying, make sure to update the `base` path in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-actual-repository-name/',
  // ... rest of config
});
```

### Environment Variables

For production deployment, you can set environment variables in GitHub repository secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## ♿ Accessibility

ResuNaut is built with accessibility as a core principle:

- **WCAG 2.1 Level AA** compliant
- **Keyboard navigation** support
- **Screen reader** compatible
- **High contrast** mode support
- **Focus management** for modals and interactive elements

See our [Accessibility Guide](docs/ACCESSIBILITY_GUIDE.md) for detailed information.

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run accessibility tests
npm run test:a11y

# Run Lighthouse audit
npm run audit
```

## 📁 Project Structure

```
resunaut/
├── public/
│   ├── _redirects          # Netlify redirects (for SPA routing)
│   └── ...
├── src/
│   ├── components/
│   │   ├── accessibility/  # Accessibility components
│   │   ├── auth/          # Authentication components
│   │   ├── ui/            # Reusable UI components
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Third-party integrations
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── ...
├── docs/                  # Documentation
├── .github/
│   └── workflows/         # GitHub Actions workflows
└── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- **Issues**: [GitHub Issues](https://github.com/yourusername/resunaut/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/resunaut/discussions)
- **Email**: support@resunaut.com

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Accessibility testing with [axe-core](https://github.com/dequelabs/axe-core)

---

**Made with ❤️ for job seekers everywhere**