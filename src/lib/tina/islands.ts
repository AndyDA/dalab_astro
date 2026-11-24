import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { BlogPostQuery, PageQuery, PortfolioItemQuery } from '../../../tina/__generated__/types';
import BlogPostEditable from '../../components/tina/BlogPostEditable.astro';
import PortfolioEditable from '../../components/tina/PortfolioEditable.astro';
import PageRenderer from '../../components/tina/PageRenderer.astro';
import { getBlogPost, getPage, getPortfolioItem } from './data';

export const islands: IslandRegistry = {
  blogPost: {
    fetch: (_request, params) => getBlogPost(params.get('relativePath') ?? ''),
    component: BlogPostEditable,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      data: (data as QueryResult<BlogPostQuery>).data?.blogPost,
    }),
  },
  portfolioItem: {
    fetch: (_request, params) => getPortfolioItem(params.get('relativePath') ?? ''),
    component: PortfolioEditable,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      data: (data as QueryResult<PortfolioItemQuery>).data?.portfolioItem,
    }),
  },
  page: {
    fetch: (_request, params) => getPage(params.get('relativePath') ?? ''),
    component: PageRenderer,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      widgets: (data as QueryResult<PageQuery>).data?.page?.widgets ?? null,
    }),
  },
};
