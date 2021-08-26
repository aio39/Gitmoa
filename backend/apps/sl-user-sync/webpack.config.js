var nodeExternals = require('webpack-node-externals');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];
  console.log(process.env.NODE_ENV);
  console.dir(options, { depth: null });
  return {
    ...options,
    output: {
      ...options.output,
      library: {
        type: 'commonjs2',
      },
    },
    // sls offline 모드에서는 빌드와 맵핑 속도를 높이기 위해 모듈을 번들링 하지 않기
    externals:
      process.env.NODE_ENV === 'prod'
        ? ['class-transformer/storage', 'apollo-server-fastify']
        : [nodeExternals()],
    devtool: process.env.NODE_ENV === 'prod' ? false : 'source-map',
    mode: process.env.NODE_ENV === 'prod' ? 'production' : 'development',
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
