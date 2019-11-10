module.exports = api => {
  api.cache.forever();
  let plugins = ['@babel/plugin-transform-runtime'];
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: false,
        },
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
    plugins,
  };
};
