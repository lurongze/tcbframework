import markdownIt from 'markdown-it';
import Prism from 'prismjs';
import tcbEnv from '@/utils/tcbConfig';

export function markdownFunc(mdData) {
  const md = new markdownIt({
    html: false,
    debug: true,
    highlight: function(str, lang) {
      if (lang) {
        try {
          return Prism.highlight(str, Prism.languages.javascript, lang);
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

  const { fence, code_block: codeBlock } = md.renderer.rules;

  const wrap = wrapped => (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];
    const rawCode = wrapped(...args);
    console.log('rawCode', rawCode);
    return (
      `<!--beforebegin--><div class="language-${token.info.trim()} extra-class">` +
      `<!--afterbegin-->${rawCode}<!--beforeend--></div><!--afterend-->`
    );
  };

  md.renderer.rules.fence = wrap(fence);
  md.renderer.rules.code_block = wrap(codeBlock);

  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);
    const code = rawCode.slice(
      rawCode.indexOf('<code'),
      rawCode.indexOf('</code>'),
    );

    const lines = code.split('\n');
    const lineNumbersCode = [...Array(lines.length - 1)]
      .map((line, index) => `<span class="line-number">${index + 1}</span>`)
      .join('');
    console.log('code', rawCode);
    const lineNumbersWrapperCode = `<div class="line-numbers-wrapper">${lineNumbersCode}</div>`;
    const finalCode = `<div style='position:relative;'>${lineNumbersWrapperCode}${rawCode}</div>`;

    return finalCode;
  };

  const html = md.render(mdData);
  return { html, dirList };
}
