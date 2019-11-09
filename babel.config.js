module.exports = api => {
  let plugins = ['@babel/plugin-transform-runtime'];
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: api.env('es') ? false : 'cjs',
          useBuiltIns: false,
        },
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
    plugins,
  };
};
