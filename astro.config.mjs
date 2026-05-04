import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://abhiram-kissflow.github.io',
  base: '/rapp-documentation/',
  integrations: [
    starlight({
      title: 'Kissflow RAPP',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/OrangeScape/rapp-design' },
      ],
      sidebar: [
        {
          label: 'Evaluate',
          items: [
            { label: 'Overview', slug: 'evaluate/overview' },
            { label: 'Capabilities', slug: 'evaluate/capabilities' },
            { label: 'Architecture', slug: 'evaluate/architecture' },
            { label: 'Security & Compliance', slug: 'evaluate/security' },
            { label: 'How It Compares', slug: 'evaluate/comparison' },
            { label: 'Get a Demo', slug: 'evaluate/demo' },
          ],
        },
        {
          label: 'User Guide',
          items: [
            { label: 'Getting Started', slug: 'guide/getting-started' },
            { label: 'Designing Your App', slug: 'guide/designing-your-app' },
            { label: 'Understanding Blueprints', slug: 'guide/understanding-blueprints' },
            { label: 'Using the Builder', slug: 'guide/using-the-builder' },
            { label: 'Managing Your App', slug: 'guide/managing-your-app' },
            { label: 'Voice Features', slug: 'guide/voice-features' },
            { label: 'FAQ', slug: 'guide/faq' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Tech Stack', slug: 'reference/tech-stack' },
            { label: 'Design System', slug: 'reference/design-system' },
            { label: 'Glossary', slug: 'reference/glossary' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@200..800&display=swap',
          },
        },
      ],
    }),
  ],
});
