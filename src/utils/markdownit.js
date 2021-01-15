import markdownIt from 'markdown-it';
import hljs from 'highlight.js';

export function mdToHtml(mdData) {
  const md = new markdownIt({
    html: false,
    debug: true,
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {
          return '';
        }
      }

      return ''; // 使用额外的默认转义
    },
  });

  let dirList = [];

  md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const title = tokens[idx + 1];
    dirList.push(`${token.markup}${title.content}`);
    return `<${token.tag} id='${title.content}'>`;
  };
  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    return `<${token.tag} target='_blank'>`;
  };

  const html = md.render(mdData);
  return { html, dirList };
}
