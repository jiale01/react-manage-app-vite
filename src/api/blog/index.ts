import { request } from '../request';

export interface BlogData {
  title: string;
  category: string;
  content: string;
}

export interface BlogItem {
  id: number;
  title: string;
  category: string;
  summary?: string;
  content?: string;
  cover?: string;
  author?: string;
  readTime?: number;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  data: BlogItem[];
  total: number;
}

/**
 * 获取博客列表
 */
export const getBlogList = (params?: any) => {
  return request({
    url: '/api_v1/blog/list',
    method: 'get',
    params,
  });
};

/**
 * 获取博客详情
 */
export const getBlogDetail = (id: number) => {
  return request({
    url: `/api_v1/blog/detail/${id}`,
    method: 'get',
  });
};

/**
 * 点赞博客
 */
export const likeBlog = (id: number) => {
  return request({
    url: `/api_v1/blog/like/${id}`,
    method: 'post',
  });
};
