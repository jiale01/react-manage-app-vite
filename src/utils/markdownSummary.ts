import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';

const DEFAULT_SUMMARY = '暂无摘要，点击查看详情...';

const stripHtml = (content: string) => content.replace(/<[^>]*>/g, ' ');

const normalizeText = (content: string) => content.replace(/\s+/g, ' ').trim();

const truncateAtReadableBoundary = (content: string, maxLength: number) => {
  if (content.length <= maxLength) return content;

  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const lastPunctuation = Math.max(
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('！'),
    truncated.lastIndexOf('？'),
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?'),
  );
  const cutIndex = lastPunctuation > 0 ? lastPunctuation + 1 : (lastSpace > 0 ? lastSpace : maxLength);

  return `${truncated.substring(0, cutIndex)}...`;
};

export const markdownToPlainText = (content?: string) => {
  if (!content) return '';

  const markdown = stripHtml(content);
  const tree = fromMarkdown(markdown);
  const text = tree.children.map((child) => toString(child)).join(' ');

  return normalizeText(text);
};

export const createMarkdownSummary = (content?: string, maxLength = 150) => {
  const plainText = markdownToPlainText(content);

  if (!plainText) return DEFAULT_SUMMARY;

  return truncateAtReadableBoundary(plainText, maxLength);
};
