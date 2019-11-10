import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.ts',
  output: [
    {
      file: './lib/index.js',
      format: 'cjs',
    },
    {
      file: './es/index.js',
      format: 'esm',
    },
  ],
  external: id =>
    id.startsWith('@babel/runtime/') || id === 'react' || id === 'react-dom',
  plugins: [
    resolve({
      extensions: ['.ts'],
    }),
    babel({
      runtimeHelpers: true,
      include: ['src/**/*.*'],
      plugins: ['@babel/plugin-transform-runtime'],
      extensions: ['.ts'],
    }),
  ],
};
