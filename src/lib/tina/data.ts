import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';
import type { PageQuery } from '../../../tina/__generated__/types';

// `requestWithMetadata` widens `data` to `{}` on failure, which makes
// `result.data.page` a type error in every page. Narrow the return type to the
// generated `PageQuery` shape so callers can read `data.page` safely; at
// runtime the `?? null` fallback still handles the empty-object failure case.
type PageQueryResult = {
  data?: {
    page?: PageQuery['page'] | null;
  } | null;
};

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
export const getPage = (relativePath: string): Promise<PageQueryResult> =>
  requestWithMetadata(client.queries.page({ relativePath }), {
    priority: 'primary',
  }) as unknown as Promise<PageQueryResult>;
