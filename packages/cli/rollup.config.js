import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json'

const entries = [
  'src/index.ts'
]

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
]

export default ({ watch }) => [
  {
      input: entries,
      output: {
        dir: 'dist',
        format: 'esm',
        sourcemap: 'inline',
      },
      external,
      plugins: [
        resolve({
          preferBuiltins: true,
        }),
        json(),
        commonjs(),
        esbuild({
          target: 'node14',
        })
      ],
      onwarn(message) {
        if (/Circular dependencies/.test(message))
          return
        console.error(message)
      },
    },
  ]