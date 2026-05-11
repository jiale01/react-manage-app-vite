import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

/**
 * 代码高亮工具
 * 用于处理富文本中的代码块
 */

/**
 * 对 HTML 内容中的代码块进行语法高亮处理
 * @param html - 原始 HTML 字符串
 * @returns 处理后的 HTML 字符串
 */
export const highlightCodeBlocks = (html: string): string => {
  if (!html) return html;

  // 创建临时 DOM 元素来处理 HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 查找所有 pre > code 元素
  const codeBlocks = tempDiv.querySelectorAll('pre code');

  codeBlocks.forEach((block) => {
    const codeElement = block as HTMLElement;

    // 获取代码文本
    const code = codeElement.textContent || '';

    // 尝试检测语言并高亮
    try {
      // 检查是否有指定的语言类
      const languageClass = Array.from(codeElement.classList).find(cls =>
        cls.startsWith('language-') || cls.startsWith('lang-')
      );

      let highlighted: string;

      if (languageClass) {
        // 提取语言名称
        const language = languageClass.replace(/^(language-|lang-)/, '');
        // 使用指定语言高亮
        if (hljs.getLanguage(language)) {
          highlighted = hljs.highlight(code, { language }).value;
        } else {
          // 如果语言不支持，自动检测
          highlighted = hljs.highlightAuto(code).value;
        }
      } else {
        // 自动检测语言
        highlighted = hljs.highlightAuto(code).value;
      }

      // 替换代码内容
      codeElement.innerHTML = highlighted;

      // 添加语言标签（如果有检测到）
      const result = hljs.highlightAuto(code);
      if (result.language) {
        codeElement.setAttribute('data-language', result.language.toUpperCase());
      }
    } catch (error) {
      console.warn('代码高亮失败:', error);
      // 失败时保持原样
    }
  });

  return tempDiv.innerHTML;
};

/**
 * 复制代码到剪贴板
 * @param code - 要复制的代码文本
 * @returns Promise<boolean> - 是否复制成功
 */
export const copyToClipboard = async (code: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    // 降级方案：使用传统的 execCommand 方法
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
