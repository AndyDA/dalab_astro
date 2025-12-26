# Project Overview: DALAB Agency Website

This project is the foundational codebase for the **DALAB Agency** website (dalab.top). It is built using the [AstroWind](https://github.com/onwidget/astrowind) template, which leverages **Astro 5.0**, **Tailwind CSS**, and **TypeScript**.

The website serves as a portfolio and service showcase for the agency, featuring sections for services (Drupal development, UI/UX, etc.), solutions (logistics, charity, etc.), AI automations, and a blog.

## Core Technologies

- **Astro 5.0**: The web framework for content-driven websites.
- **Tailwind CSS**: For utility-first styling.
- **TypeScript**: For type-safe development.
- **MDX/Markdown**: For content management (blog posts and portfolio items).
- **Astro Icon**: For icon management (Tabler Icons and Flat Color Icons).
- **Zod**: For content schema validation.

## Project Structure

- `src/pages/`: Contains the application routes.
    - `index.astro`: Homepage.
    - `[...blog]/`: Dynamic routes for the blog.
    - `[...port]/`: Dynamic routes for the portfolio.
    - Other directories (`services/`, `solutions/`, `insights/`, `ai-automations/`) match the site navigation.
- `src/components/`: Modular Astro components.
    - `widgets/`: High-level sections (Hero, Features, Content, etc.) used to build pages.
    - `ui/`: Reusable UI elements (Button, Form, ItemGrid).
    - `common/`: Global components (Metadata, Analytics, Scripts).
- `src/data/`: Markdown (`.md`) and MDX (`.mdx`) files for content.
    - `post/`: Blog posts.
    - `port/`: Portfolio projects.
- `src/content/config.ts`: Defines data collections and schemas for blog and portfolio.
- `src/config.yaml`: Global configuration for SEO, site name, and app features (blog, analytics).
- `src/navigation.ts`: Defines the header and footer navigation structure.
- `astro.config.ts`: Main Astro configuration including integrations and Vite aliases.

## Building and Running

Ensure you have Node.js installed (version matches `^18.17.1 || ^20.3.0 || >= 21.0.0`).

### Development
```bash
npm install
npm run dev
npm run dev -- --host
```
Starts the development server at `http://localhost:4321`.

### Production Build
```bash
npm run build
```
Generates a static site in the `dist/` directory.

### Preview Build
```bash
npm run preview
```
Previews the production build locally.

### Quality Checks
```bash
npm run check  # Runs astro check, eslint, and prettier
npm run fix    # Automatically fixes eslint and prettier issues
```

## Development Conventions

- **Component-Driven:** Build pages by composing "widgets" found in `src/components/widgets`.
- **Content First:** Add new blog posts or portfolio items in `src/data/post` or `src/data/port`.
- **Type Safety:** Use TypeScript for all scripts and Astro components. Define schemas in `src/content/config.ts` for any new content collections.
- **Styling:** Use Tailwind CSS utility classes. Custom styles should be added sparingly in `src/assets/styles/tailwind.css` or within `<style>` tags in Astro components if scoped.
- **Aliases:** Use the `~` alias to refer to the `src` directory (e.g., `import ItemGrid from '~/components/ui/ItemGrid.astro'`).
- **Icons:** Use the `Icon` component from `astro-icon/components`. Available sets include `tabler` and `flat-color-icons` as configured in `astro.config.ts`.
