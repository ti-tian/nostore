module.exports = api => {
  let plugins = [
    ['@babel/proposal-class-properties', { loose: true }],
    ['@babel/proposal-object-rest-spread', { loose: true }],
    '@babel/plugin-transform-runtime',
    // for IE 11 support
    '@babel/plugin-transform-object-assign',
  ];
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
