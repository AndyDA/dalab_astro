import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'H.',
      href: getPermalink('/'),
      // links: [
      //   {
      //     text: 'SaaS',
      //     href: getPermalink('/homes/saas'),
      //   },
      //   {
      //     text: 'Startup',
      //     href: getPermalink('/homes/startup'),
      //   },
      //   {
      //     text: 'Mobile App',
      //     href: getPermalink('/homes/mobile-app'),
      //   },
      //   {
      //     text: 'Personal',
      //     href: getPermalink('/homes/personal'),
      //   },
      // ],
    },
    {
      text: 'Services',
      links: [
        {
          text: 'Drupal Development',
          href: getPermalink('/services/drupal-development'),
        },
        {
          text: 'E-commerce',
          href: getPermalink('/services/e-commerce'),
        },
        {
          text: 'UI/UX Design',
          href: getPermalink('/services/ui-ux-design'),
        },
        // {
        //   text: 'Branding',
        //   href: getPermalink('/services/branding'),
        // },
      ],
    },
    {
      text: 'Solutions',
      links: [
        {
          text: 'Restaurant & Food Delivery',
          href: getPermalink('/solutions/restaurant-food-delivery'),
        },
        {
          text: 'Resort & Hotel Booking',
          href: getPermalink('/solutions/resort-hotel-booking'),
        },
        {
          text: 'Logistics, Cargo & Transportation',
          href: getPermalink('/solutions/logistics-cargo-transportation'),
        },
        {
          text: 'Nonprofit & Charity',
          href: getPermalink('/solutions/nonprofit-charity'),
        },
        // {
        //   text: 'Coming Soon or Pre-Launch',
        //   href: getPermalink('/landing/pre-launch'),
        // },
        // {
        //   text: 'Subscription',
        //   href: getPermalink('/landing/subscription'),
        // },
      ],
    },
    {
      text: 'AI automations',
      links: [
        {
          text: 'Operations',
          href: getPermalink('/ai-automations/operations'),
        },
        {
          text: 'Marketing',
          href: getPermalink('/ai-automations/marketing'),
        },
        {
          text: 'Sales',
          href: getPermalink('/ai-automations/sales'),
        },
        // {
        //   text: 'Marketing Automation',
        //   href: getPermalink('#'),
        // },
        // {
        //   text: 'Customer Support Ticketing',
        //   href: getPermalink('#'),
        // },
        // {
        //   text: 'HR and Recruitment Automation',
        //   href: getPermalink('#'),
        // },
        // {
        //   text: 'Invoice and Billing Processing Estate',
        //   href: getPermalink('#'),
        // },
        // {
        //   text: 'E-commerce & Inventory Management',
        //   href: getPermalink('#'),
        // },
        // {
        //   text: 'Compliance and Audit Trail Automation',
        //   href: getPermalink('#'),
        // },
      ],
    },
    {
      text: 'Blog',
      href: getBlogPermalink('/blog'),
      // links: [
      //   {
      //     text: 'Blog List',
      //     href: getBlogPermalink(),
      //   },
      //   {
      //     text: 'Article',
      //     href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
      //   },
      //   {
      //     text: 'Article (with MDX)',
      //     href: getPermalink('markdown-elements-demo-post', 'post'),
      //   },
      //   {
      //     text: 'Category Page',
      //     href: getPermalink('tutorials', 'category'),
      //   },
      //   {
      //     text: 'Tag Page',
      //     href: getPermalink('astro', 'tag'),
      //   },
      // ],
    },
    {
      text: 'Insights',
      links: [
        {
          text: 'About Us',
          href: getPermalink('/insights/about'),
        },
        {
          text: 'Our Team',
          href: getPermalink('/insights/team'),
        },
        {
          text: 'Our Work',
          href: getPermalink('/portfolio'),
        },
        {
          text: 'Careers',
          href: getPermalink('/insights/careers'),
        },
        {
          text: 'Pricing',
          href: getPermalink('/insights/pricing'),
        },
      ],
    },
  ],
  actions: [{ text: 'Contact', href: '/contact', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Security', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Enterprise', href: '#' },
        { text: 'Customer stories', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Developer API', href: '#' },
        { text: 'Partners', href: '#' },
        { text: 'Atom', href: '#' },
        { text: 'Electron', href: '#' },
        { text: 'AstroWind Desktop', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'Press', href: '#' },
        { text: 'Inclusion', href: '#' },
        { text: 'Social Impact', href: '#' },
        { text: 'Shop', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    // { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    // { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  footNote: `
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://dalab.top/"> DALAB Agency</a> · All rights reserved.
  `,
};
