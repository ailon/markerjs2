import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import svgo from 'rollup-plugin-svgo';

const outputDir = './dist/';

const banner = `/* **********************************
marker.js 2 version ${pkg.version}
https://markerjs.com

copyright Alan Mendelevich
see README.md and LICENSE for details
********************************** */`;

export default [
  {
    input: ['./src/index.ts'],
    output: {
      dir: './dts/',
    },
    plugins: [
      del({ targets: ['dts/*', 'dist/*'] }),
      typescript({
        declaration: true,
        outDir: './dts/',
        rootDir: './src/',
        exclude: ['./test/**/*', './dts/**/*', './dist/**/*'],
      }),
      svgo(),
    ],
  },
  {
    input: './dts/index.d.ts',
    output: [{ file: './dist/markerjs2.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: ['src/index.ts'],
    output: [
      {
        file: outputDir + pkg.module,
        format: 'es',
        sourcemap: true,
        banner: banner,
      },
      {
        file: outputDir + pkg.main,
        name: 'markerjs2',
        format: 'umd',
        sourcemap: true,
        banner: banner,
      },
    ],
    plugins: [
      generatePackageJson({
        baseContents: (pkg) => {
          pkg.scripts = {};
          pkg.dependencies = {};
          pkg.devDependencies = {};
          return pkg;
        },
      }),
      typescript(),
      svgo(),
      terser(),
      copy({
        targets: [
          {
            src: 'README.md',
            dest: 'dist',
          },
          {
            src: 'LICENSE',
            dest: 'dist',
          },
        ],
      }),
      del({ targets: ['dts/*'] }),
    ],
  },
];
