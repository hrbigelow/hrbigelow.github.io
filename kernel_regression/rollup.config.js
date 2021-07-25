import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import glslify from 'rollup-plugin-glslify';
import css from 'rollup-plugin-css-only';
import marked from 'marked';

import { macro_convert, parse_colab_math, convert_dmath_brackets, orig_parse_dmath } from './src/rollup_preprocess.js';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const defaultPlugins = [
  svelte({
    /*
    preprocess: {
      markup: ({ content }) => {
        let rx = /(?<=\<d-math(| block)>)[\s\S]*?(?=<\/d-math>)/mg;
        let code = content.replace(rx,
          (inner) => inner.replace(/{/g, '&#123;')
          .replace(/}/g, '&#125;'));
        // console.log('replaced code');
        // console.log(code);
        return { code };
      }
    },
    */
    extensions: ['.svelte', '.md'],
    preprocess: [
      { 
        markup: ({ content, filename }) => {
          if (filename.slice(-2) == 'md') {
            content = macro_convert(content);
            console.log('After macro_convert');
            console.log(content);

            content = parse_colab_math(content);
            console.log('After parse_colab');
            console.log(content);

            content = marked.parse(content);
            console.log('After marked.parse');
            console.log(content);
          }
          content = convert_dmath_brackets(content);
          
          if (filename.slice(-2) == 'md') {
            console.log('After Convert dmath brackets');
            console.log(content);
          }

          return { code: content };
        }
      }
    ],
    compilerOptions: {
      // enable run-time checks when not in production
      dev: !production
    }
  }),
  // we'll extract any component CSS out into
  // a separate file - better for performance
  css({ output: 'bundle.css' }),

  // If you have external dependencies installed from
  // npm, you'll most likely need these plugins. In
  // some cases you'll need additional configuration -
  // consult the documentation for details:
  // https://github.com/rollup/plugins/tree/master/packages/commonjs
  resolve({
    browser: true,
    dedupe: ['svelte']
  }),
  commonjs(),
  glslify(),

  // In dev mode, call `npm run start` once
  // the bundle has been generated
  !production && serve(),

  // Watch the `public` directory and refresh the
  // browser on changes when not in production
  !production && livereload('public'),

  // If we're building for production (npm run build
  // instead of npm run dev), minify
  production && terser()
];

export default [
  {
    input: 'src/main.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/bundle.js'
    },
    plugins: defaultPlugins,
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/full.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'full',
      file: 'public/build/full_plot_bundle.js'
    },
    plugins: defaultPlugins,
    watch: {
      clearScreen: false
    }
  }
];

