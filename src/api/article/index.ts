import { request } from '../request';

export interface ArticleData {
  title: string;
  category: string;
  content: string;
}

export interface ArticleItem {
  id: number;
  title: string;
  category: string;
  summary?: string;
  content?: string;
  cover?: string;
  author?: string;
  readTime?: number;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListResponse {
  data: ArticleItem[];
  total: number;
}

/**
 * 创建文章
 */
export const createArticle = (data: ArticleData) => {
  return request({
    url: '/api_v1/article/create',
    method: 'post',
    data,
  });
};

/**
 * 获取文章列表
 */
export const getArticleList = (params?: any) => {
  return request({
    url: '/api_v1/article/list',
    method: 'get',
    params,
  });
};

/**
 * 获取文章详情
 */
export const getArticleDetail = (id: number) => {
  return request({
    url: `/api_v1/article/detail/${id}`,
    method: 'get',
  });
};

/**
 * 更新文章
 */
export const updateArticle = (id: number, data: ArticleData) => {
  return request({
    url: `/api_v1/article/update/${id}`,
    method: 'put',
    data,
  });
};

/**
 * 删除文章
 */
export const deleteArticle = (id: number) => {
  return request({
    url: `/api_v1/article/delete/${id}`,
    method: 'delete',
  });
};
