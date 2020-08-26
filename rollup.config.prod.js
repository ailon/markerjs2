import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const outputDir = './dist/';

const banner = `/* **********************************
marker.js 2 version ${pkg.version}
https://markerjs.com

copyright Alan Mendelevich
see README.md and LICENSE for details
********************************** */`;

export default [{
  input: ['src/index.ts'],
  output: [
    {
      file: outputDir + pkg.module,
      format: 'es',
      sourcemap: true,
      banner: banner
    },
    {
      file: outputDir + pkg.main,
      name: 'markerjs2',
      format: 'umd',
      sourcemap: true,
      banner: banner
    }
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    generatePackageJson({  
      baseContents: {
        scripts: {},
        dependencies: {},
        devDependencies: {}
      }
    }),
    typescript(),
    terser(),
    copy({
      targets: [{
        src: 'README.md', dest: 'dist'
      }]
    })
  ]
}, {
  input: ['src/index.ts'],
  output: {
    dir: './dts/'
  },
  plugins: [
    typescript({ 
      declaration: true, 
      outDir: './dts/', 
      rootDir: './src/', 
      exclude: ['./test/**/*'] 
    })
  ]
}, {
  input: "./dts/index.d.ts",
  output: [{ file: "./dist/markerjs2.d.ts", format: "es" }],
  plugins: [dts()],
}];
