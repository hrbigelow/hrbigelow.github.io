import marked from 'marked';

const dmath_block = {
  name: 'dmath_block',
  level: 'block',
  start(src) { return src.match(/\$/)?.index; },
  // start(src) { return 100 },
  tokenizer(src, tokens) {
    const rule = /^\$(\n\\begin{aligned}\n.+?\\end{aligned}\n)\$\n/s;
    const match = rule.exec(src);
    if (match) {
      // console.log(match);
      return {
        type: 'dmath_block',
        raw: match[0],
        text: match[1]
      };
    }
  },
  renderer(token) {
    var tok = token.text.replace(/\\mbox/g, '\\text');
    tok = tok.replace(/\\/g, '\\\\');
    return `<d-math block>\n{@html \`${tok}\`}\n</d-math>\n`;
  }
};

const dmath = {
  name: 'dmath',
  level: 'inline',
  start(src) { return src.match(/\$/)?.index; },
  tokenizer(src, tokens) {
    const rule = /^\$(?!.+?\\begin)([^\$]+)\$/s;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'dmath',
        raw: match[0],
        text: match[1]
      };
    }
  },
  renderer(token) {
    var tok = token.text.replace(/\\mbox/g, '\\text');
    tok = tok.replace(/\\/g, '\\\\');
    var out = `<d-math>{@html \`${tok}\`}</d-math>`;
    return out;
  }
};

marked.use({ extensions: [dmath, dmath_block] });

// converts <d-math> ... </d-math> to
// <d-math>{@html `...`}</d-math>
// and likewise for <d-math block>
function quote_dmath_html(content) {
  let rx = /(\<d-math\>|\<d-math block\>)(.+?)\<\/d-math\>/sg;
  let code = content.replace(rx, (match, p1, p2) => 
    {
      // console.log('in quote_dmath: ', match, p1, p2, p3);
      var esc = p2.replace(/\\/g, '\\\\');
      var out = `${p1}{@html \`${esc}\`}</d-math>`;
      // console.log('in quote_dmath: ', out);
      return out;
    }
  );
  return code;
}


function macro_convert(code) {
  // first pass: collect the macros
  var qpat, rpat, g;
  var qrpats = [];
  var argpat = '{(.+?)}';
  const mx = /\\newcommand(?<cmd>\\.+?)(\[(?<num_pars>.+?)\])*{(?<replace>.+)}/;
  const mxg = RegExp(mx, 'g'); 
  const macros = code.matchAll(mxg);
  console.log('got macros: ', macros);
  for (const match of macros) {
    const macro = match[0].replace(/\\/g, '\\\\');
    var g = macro.match(mx).groups;
    qpat = g.cmd + argpat.repeat(g.num_pars || 0);
    rpat = g.replace.replace('#','$');
    qrpats.push({ qpat: new RegExp(qpat, 'g'), rpat: rpat });
  }

  console.log(qrpats[0]);

  const mxs = /\$\n*(\\newcommand\\.+\n)*\n*\$/;
  code = code.replace(mxs, '');

  for (let qr of qrpats) {
    console.log(qr.qpat.source);
    code = code.replace(qr.qpat, qr.rpat);
  }
  return code;
}

  


function preprocess_md(content) {
  content = macro_convert(content);
  content = marked(content);
  return content;
}


export { macro_convert, quote_dmath_html, preprocess_md };

