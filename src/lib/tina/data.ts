import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';

// Blog and portfolio documents live in Astro content collections but are edited
// visually through Tina. These mirror `getBlogPost` for the real content. The
// `relativePath` is the file name inside the collection folder (e.g.
// `build-websites-with-ai.mdx`); see `resolveRelativePath` in ./paths.
//
// All blog posts are `.mdx` (MDX covers plain Markdown too), so a single
// `blogPost` collection/query serves every post.
export const getBlogPost = (relativePath: string) =>
  requestWithMetadata(client.queries.blogPost({ relativePath }), {
    priority: 'primary',
  });

export const getPortfolioItem = (relativePath: string) =>
  requestWithMetadata(client.queries.portfolioItem({ relativePath }), {
    priority: 'primary',
  });

// Static (JSON) pages under src/data/pages/. `relativePath` is the file name
// including extension, e.g. `index.json` or `solutions/restaurant-food-delivery.json`.
export const getPage = (relativePath: string) =>
  requestWithMetadata(client.queries.page({ relativePath }), {
    priority: 'primary',
  });
