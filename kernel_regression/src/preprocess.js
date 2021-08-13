import marked from 'marked';
import { parse as html_parse } from 'node-html-parser';

/*
 * Anything enclosed in $$ .. $$
 * It can contain instances of \\mbox{ ... }, which can
 * contain strings of $ ... $.  But, these strings are not
 * touched by the
 */
const math_block = {
  name: 'math_block',
  level: 'block',
  // returns position of next match, or undefined if no match
  start(src) { return src.match(/\$\$/)?.index; },
  tokenizer(src, tokens) {
    // rule matches at beginning of string.  this must mean
    // that the tokenizer is called with different slices of the source
    const rule = /^\$\$(.+?)\$\$/s;
    const match = rule.exec(src); // returns a weird array/object hybrid thing 

    if (match) {
      var token = {
        type: 'math_block',
        raw: match[0],
        text: match[0]
      };
      return token;
    }
  },
  renderer(token) {
    // console.log(`in math_block renderer with ${token}`);
    // console.log(token);
    var tok = token.text.replace(/\\mbox/g, '\\text');
    tok = tok.replace(/\\/g, '\\\\');
    return `{@html \`${tok}\`}`;
  }
};


const math_inline = {
  name: 'math_inline',
  level: 'inline',
  start(src) { return src.match(/\$/)?.index; },
  tokenizer(src, tokens) {
    const rule = /^\$([^\$]+?)\$/s;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'math_inline',
        raw: match[0],
        text: match[0]
      };
    }
  },
  renderer(token) {
    var tok = token.text.replace(/\\/g, '\\\\');
    // console.log(`math_inline': rendering ${tok}`);
    return `{@html \`${tok}\`}`;
  }
};


marked.use({ extensions: [math_inline, math_block] });


function get_toks(content) {
  return marked.lexer(content);
}

function parse(toks) {
  return marked.parser(toks);
}

function pre_md(content) {
  content = marked(content);
  return content;
}

// transform $$ ... $$ to {@html `$$ ... $$`}, also
// changing '\\mbox' to '\\text'
// transform $ ... $ to {@html `$ ... $`}
// but skip over any $ ... $ inside of the $$ ... $$
function pre_sv(content) {
  function quote_math(s) {
    if (s === undefined) return s;
    const rx = /(\$\$.+?\$\$|\$.+?\$)/sg;
    s = s.replaceAll(rx, (el) => { return `{@html \`${el}\`}`; });
    s = s.replace(/\\/g, '\\\\');
    return s;
  }

  var node = html_parse(content);
  for (var n of node.childNodes) {
    if (n.tagName != 'SCRIPT' && n.tagName != 'STYLE') {
      n.innerHTML = quote_math(n.innerHTML);
    }
  }
  content = node.toString();
  return content;
}


export { get_toks, parse, pre_md, pre_sv };

