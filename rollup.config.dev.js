import typescript from '@rollup/plugin-typescript';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import dev from 'rollup-plugin-dev';
import livereload from 'rollup-plugin-livereload';
// import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import svgo from 'rollup-plugin-svgo';

export default {
  input: ['test/manual/index.ts'],
  output: {
    dir: 'build-dev',
    format: 'umd',
    sourcemap: true,
    name: 'markerjs2',
  },
  plugins: [
    //del({ targets: 'build-dev/*' }),
    typescript(),
    svgo(),
    htmlTemplate({
      template: 'test/manual/template.html',
      target: 'index.html',
    }),
    copy({
      targets: [
        {
          src: 'test/manual/images/**/*',
          dest: 'build-dev/images',
        },
      ],
    }),
    dev('build-dev'),
    livereload('build-dev'),
  ],
};
