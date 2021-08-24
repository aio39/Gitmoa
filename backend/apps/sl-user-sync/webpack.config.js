module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];
  console.log(process.env.NODE_ENV);
  console.dir(options, { depth: null });
  // return {
  //   ...options,
  //   // devtool: 'eval-cheap-module-source-map',
  //   externals: [...options.externals, /aws-sdk/],

  //   output: {
  //     ...options.output,
  //     library: {
  //       type: 'commonjs2',
  //     },
  //   },
  // };
  return {
    ...options,
    output: {
      ...options.output,
      library: {
        type: 'commonjs2',
      },
    },
    // optimization: {
    //   usedExports: true,
    //   sideEffects: true,
    // },
    externals: ['class-transformer/storage', 'apollo-server-fastify'],
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
