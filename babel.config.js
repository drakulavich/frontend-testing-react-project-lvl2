module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/env', {
      targets: {
        node: 'current',
      },
    }],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
  ],
};
