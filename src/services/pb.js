import PocketBase from 'pocketbase';

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://pb.maik-bartels.com';
const pb = new PocketBase(POCKETBASE_URL);

export async function getArticles(options = {}) {
  return await pb.collection('article').getFullList({
    sort: '-date',
    ...options,
  });
}

export async function getArticleBlocks(articleId) {
  return await pb.collection('article_blocks').getFullList({
    filter: `article = "${articleId}"`,
    sort: 'sort_order',
    expand: 'article'
  });
}

export function getFileUrl(record, filename, queryParams = {}) {
  if (!record || !filename) return '';
  return pb.files.getURL(record, filename, queryParams);
}
