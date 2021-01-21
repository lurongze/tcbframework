import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import Prism from 'prismjs';
import tcbEnv from '@/utils/tcbConfig';

export function markdownFunc(mdData) {
  const md = new markdownIt({
    html: false,
    debug: true,
    highlight: function(str, lang) {
      if (lang) {
        try {
          let resHtml = Prism.highlight(str, Prism.languages.javascript, lang);
          // console.log('resHtml', resHtml.split('\n'));
          resHtml = resHtml
            .split('\n')
            .map((s, i) => {
              return `<span style='color:#333;margin-right:5px;display:inline-block;min-width:15px;'>${i}</span>${s}`;
            })
            .join('\n');
          return resHtml;
        } catch (__) {
          return '';
        }
      }

      return ''; // 使用额外的默认转义
    },
  });

  let dirList = [];

  md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
    // console.log('tokens', tokens);
    const token = tokens[idx];
    const title = tokens[idx + 1];
    dirList.push(`${token.markup}${title.content}`);
    return `<${token.tag} id='${title.content}'>`;
  };
  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const hrefToken = tokens[idx + 1];
    return `<${token.tag} href='${hrefToken.content}' target='_blank'>`;
  };

  md.renderer.rules.image = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    let src = '';
    let attrs = token?.attrs || [];
    if (attrs.length) {
      const findSrcItem = attrs.find(s => s[0] === 'src');
      if (findSrcItem && findSrcItem.length === 2) {
        const findSrc = findSrcItem[1] || '';
        if (findSrc) {
          src = findSrc.startsWith('http')
            ? findSrc
            : `${tcbEnv.TCB_DOMAIN}/images/${findSrc}`;
        }
      }
    }
    return `<${token.tag} src='${src}'`;
  };

  const html = md.render(mdData);
  return { html, dirList };
}
