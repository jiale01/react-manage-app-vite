import { useEffect } from 'react';

/**
 * 设置页面标题的自定义 Hook
 * @param title - 页面标题（会自动添加前缀）
 */
const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default useTitle;
