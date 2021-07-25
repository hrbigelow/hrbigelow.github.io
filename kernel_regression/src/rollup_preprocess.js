
function make_latex_macro_convert(macros) {
  var rx = '';
  var mx = /\\newcommand(?<cmd>\\.+?)(\[(?<num_pars>.+?)\])*{(?<replace>.+)}/;
  var argpat = '{(.+?)}';
  var qrpats = [];
  var qpat, rpat, g;
  for (let m of macros) {
    var g = m.match(mx).groups;
    qpat = g.cmd + argpat.repeat(g.num_pars || 0);
    rpat = g.replace.replace('#','$');
    qrpats.push({ qpat: new RegExp(qpat, 'g'), rpat: rpat });
  }
  function macro_convert(code) {
    for (let qr of qrpats) {
      // console.log(qr);
      // console.log(qr.qpat.source);
      code = code.replace(qr.qpat, qr.rpat);
    }
    return code;
  }
  return macro_convert;
}
    

const macros = [
/\newcommand\\B[1]{\bold{#1}}/.source,
/\newcommand\len[1]{\|#1\|}/.source,
/\newcommand\ang[1]{\theta_{#1}}/.source,
/\newcommand\dist{\mathrm{dist}}/.source,
/\newcommand\proj{\mathrm{proj}}/.source
];


var macro_convert = make_latex_macro_convert(macros);

/*
token    stack_top    output       action
$        not DMATH    <d-math>     push DMATH
$        DMATH        </d-math>    pop
\mbox{   not MBOX     \text{       push MBOX
}        MBOX         }            pop
\n[\n+]  not P        \n<p>        push P
\n[\n+]  P            </p>\n       pop
**       not B        <b>          push B
**       B            </b>         pop
{        DMATH        &#123;       none
}        DMATH        &#125;       none
other    any          same         none
*/

const rx = '^('
  + /(?<dollar_block>\$\n\\begin{aligned})/.source
  + /|(?<dollar>\$)/.source
  + /|(?<mbox>\\mbox{)/.source
  + /|(?<lbracket>{)/.source
  + /|(?<rbracket>})/.source
  + ')';
;

const DMATH = 1;
const DMATH_BLOCK = 2;
const MBOX = 3;
const LBRACKET = 4;
const RBRACKEt = 5;


/*  Changes:
 *  $ ... $  => <d-math> ... </d-math>
 *  $\n\begin{ ... \end{aligned}\n$ =>  <d-math block>\n\begin{ ... </d-math>
 *  \mbox{ ... }  => \text{ ... }
 */
function parse_colab_math(code) {
  var st = [];
  var result = '';
  var pos = 0;

  while (pos != code.length) {
    var m = code.slice(pos).match(rx);
    // console.log(result);
    if (m == null) {
      pos++;
      result += code[pos-1];
      continue;
    }

    var g = m.groups;
    var stack_top = st[st.length-1];
    pos += m[0].length;
    // console.log(g);
    // console.log(stack_top);

    if (g.dollar) {
      if (stack_top == DMATH || stack_top == DMATH_BLOCK) {
        st.pop();
        result += '</d-math>';
      }
      else if (stack_top == MBOX) {
        result += g.dollar;
      }
      else {
        st.push(DMATH);
        result += '<d-math>';
      }
    }
    else if (g.dollar_block) {
      st.push(DMATH_BLOCK);
      result += '<d-math block>\n\\begin{aligned}';
    }
    else if (g.mbox) {
      if (stack_top != MBOX) {
        st.push(MBOX);
        // console.log('captured: ', g.mbox);
        // console.log('before: ', result);
        result += '\\text{';
        // console.log('after: ', result);
      }
      else {
        throw 'MBOX Parse Error around ' + code.slice(pos, pos + 20);
      }
    }
    else if (g.lbracket) {
      st.push(LBRACKET);
      result += g.lbracket;
    }
    else if (g.rbracket) {
      st.pop();
      result += g.rbracket;
    }
    else {
      throw 'unknown Parse Error around ' + code.slice(pos, pos + 20);
    }
  }
    
  // console.log(result);
  return result;

}

const DOPEN = 1;


function convert_dmath_brackets(content) {
  let rxs = '^('
  + '(?<dopen>\<d-math(| block)>)'
  + '|(?<dclose>\</d-math>)'
  + '|(?<lbracket>\{)'
  + '|(?<rbracket>\})'
  + ')';

  let rx = new RegExp(rxs);
  var pos = 0;
  var st = [];
  var result = '';

  while (pos != content.length) {
    var m = content.slice(pos).match(rx);
    if (m == null) {
      pos++;
      result += content[pos - 1];
      continue;
    }

    var g = m.groups;
    var stack_top = st[st.length-1];
    var pre = pos == 0 ? '' : content[pos-1];
    pos += m[0].length;

    if (g.dopen) {
      st.push(DOPEN);
      result += g.dopen;
    }
    else if (g.dclose) {
      if (stack_top != DOPEN) {
        throw 'DCLOSE parse error';
      }
      else {
        st.pop();
        result += g.dclose;
      }
    }
    else if (g.lbracket) {
      if (stack_top == DOPEN && pre != '\\') {
        result += '&#123;';
      }
      else {
        result += g.lbracket;
      }
    }
    else if (g.rbracket) {
      if (stack_top == DOPEN && pre != '\\') {
        result += '&#125;';
      }
      else {
        result += g.rbracket;
      }
    }
  }
  return result;
}

function orig_parse_dmath(content) {
  let rx = /(?<=\<d-math(| block)>)[\s\S]*?(?=<\/d-math>)/mg;
  let code = content.replace(rx,
    (inner) => inner.replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;'));
  return code;
}


export { macro_convert, parse_colab_math, convert_dmath_brackets, orig_parse_dmath };

