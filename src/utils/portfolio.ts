import type { PaginateFunction } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Portfolio } from '~/types';
import { cleanSlug, trimSlash, getPermalink } from './permalinks';

const PORTFOLIO_BASE = 'portfolio';
const PORT_CATEGORY_BASE = 'portfolio/category';
const PORT_TAG_BASE = 'portfolio/tag';
const PORTFOLIO_PERMALINK_PATTERN = `${PORTFOLIO_BASE}/%slug%`;

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = PORTFOLIO_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedPortfolio = async (item: CollectionEntry<'port'>): Promise<Portfolio> => {
  const { id, data } = item;
  const { Content, remarkPluginFrontmatter } = await render(item);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    client,
    projectUrl,
    technologies = [],
    featured = false,
    draft = false,
    metadata = {},
  } = data;

  const slug = cleanSlug(id);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate, category: rawCategory }),

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,

    category: rawCategory,
    tags: rawTags,
    client: client,
    projectUrl: projectUrl,
    technologies: technologies,
    featured: featured,

    draft: draft,

    metadata,

    Content: Content,
  };
};

const load = async function (): Promise<Array<Portfolio>> {
  const items = await getCollection('port');
  const normalizedItems = items.map(async (item) => await getNormalizedPortfolio(item));

  const results = (await Promise.all(normalizedItems))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((item) => !item.draft);

  return results;
};

let _portfolioItems: Array<Portfolio>;

/** */
export const isPortfolioEnabled = true;
export const isRelatedPortfolioEnabled = true;
export const isPortfolioListRouteEnabled = true;
export const isPortfolioItemRouteEnabled = true;
export const isPortfolioCategoryRouteEnabled = true;
export const isPortfolioTagRouteEnabled = true;

export const portfolioListRobots = { index: true, follow: true };
export const portfolioItemRobots = { index: true, follow: true };
export const portfolioCategoryRobots = { index: true, follow: true };
export const portfolioTagRobots = { index: true, follow: true };

export const portfolioItemsPerPage = 12;

/** */
export const fetchPortfolioItems = async (): Promise<Array<Portfolio>> => {
  if (!_portfolioItems) {
    _portfolioItems = await load();
  }

  return _portfolioItems;
};

/** */
export const findPortfolioItemsBySlugs = async (slugs: Array<string>): Promise<Array<Portfolio>> => {
  if (!Array.isArray(slugs)) return [];

  const items = await fetchPortfolioItems();

  return slugs.reduce(function (r: Array<Portfolio>, slug: string) {
    items.some(function (item: Portfolio) {
      return slug === item.slug && r.push(item);
    });
    return r;
  }, []);
};

/** */
export const findPortfolioItemsByIds = async (ids: Array<string>): Promise<Array<Portfolio>> => {
  if (!Array.isArray(ids)) return [];

  const items = await fetchPortfolioItems();

  return ids.reduce(function (r: Array<Portfolio>, id: string) {
    items.some(function (item: Portfolio) {
      return id === item.id && r.push(item);
    });
    return r;
  }, []);
};

/** */
export const findLatestPortfolioItems = async ({ count }: { count?: number }): Promise<Array<Portfolio>> => {
  const _count = count || 4;
  const items = await fetchPortfolioItems();

  return items ? items.slice(0, _count) : [];
};

/** */
export const findFeaturedPortfolioItems = async ({ count }: { count?: number }): Promise<Array<Portfolio>> => {
  const _count = count || 4;
  const items = await fetchPortfolioItems();
  const featured = items.filter((item) => item.featured);

  return featured ? featured.slice(0, _count) : [];
};

/** */
export const getStaticPathsPortfolioList = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isPortfolioEnabled || !isPortfolioListRouteEnabled) return [];
  return paginate(await fetchPortfolioItems(), {
    params: { port: PORTFOLIO_BASE || undefined },
    pageSize: portfolioItemsPerPage,
  });
};

/** */
export const getStaticPathsPortfolioItem = async () => {
  if (!isPortfolioEnabled || !isPortfolioItemRouteEnabled) return [];
  return (await fetchPortfolioItems()).flatMap((item) => ({
    params: {
      port: item.permalink,
    },
    props: { post: item },
  }));
};

/** */
export const getStaticPathsPortfolioCategory = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isPortfolioEnabled || !isPortfolioCategoryRouteEnabled) return [];

  const items = await fetchPortfolioItems();
  const categories = {};
  items.map((item) => {
    if (item.category) {
      categories[item.category] = item.category;
    }
  });

  return Array.from(Object.keys(categories)).flatMap((categorySlug) =>
    paginate(
      items.filter((item) => item.category && categorySlug === item.category),
      {
        params: { category: categorySlug, port: PORT_CATEGORY_BASE || undefined },
        pageSize: portfolioItemsPerPage,
        props: { category: categories[categorySlug] },
      }
    )
  );
};

/** */
export const getStaticPathsPortfolioTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isPortfolioEnabled || !isPortfolioTagRouteEnabled) return [];

  const items = await fetchPortfolioItems();
  const tags = {};
  items.map((item) => {
    if (Array.isArray(item.tags)) {
      item.tags.map((tag) => {
        tags[tag] = tag;
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug) =>
    paginate(
      items.filter((item) => Array.isArray(item.tags) && item.tags.includes(tagSlug)),
      {
        params: { tag: tagSlug, port: 'portfolio/tag' },
        pageSize: portfolioItemsPerPage,
        props: { tag: tags[tagSlug] },
      }
    )
  );
};

/** */
export async function getRelatedPortfolioItems(originalItem: Portfolio, maxResults: number = 4): Promise<Portfolio[]> {
  const allItems = await fetchPortfolioItems();
  const originalTagsSet = new Set(originalItem.tags || []);

  const itemsWithScores = allItems.reduce((acc: { item: Portfolio; score: number }[], iteratedItem: Portfolio) => {
    if (iteratedItem.slug === originalItem.slug) return acc;

    let score = 0;
    if (iteratedItem.category && originalItem.category && iteratedItem.category === originalItem.category) {
      score += 5;
    }

    if (iteratedItem.tags) {
      iteratedItem.tags.forEach((tag) => {
        if (originalTagsSet.has(tag)) {
          score += 1;
        }
      });
    }

    acc.push({ item: iteratedItem, score });
    return acc;
  }, []);

  itemsWithScores.sort((a, b) => b.score - a.score);

  const selectedItems: Portfolio[] = [];
  let i = 0;
  while (selectedItems.length < maxResults && i < itemsWithScores.length) {
    selectedItems.push(itemsWithScores[i].item);
    i++;
  }

  return selectedItems;
}
