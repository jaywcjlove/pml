import webpack from 'webpack';
import { LoaderConfOptions, WebpackConfiguration, MockerAPIOptions } from 'kkt';
import pkg from './package.json';

export default (conf: WebpackConfiguration, env: 'development' | 'production', options: LoaderConfOptions) => {
  // Get the project version.
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
      DEBUG: JSON.stringify(env),
    }),
  );
  if (env === 'production') {
    conf.output = { ...conf.output, publicPath: './' };
  } else {
    conf.proxySetup = (app): MockerAPIOptions => {
      return {
        path: {
          _proxy: {
            changeHost: true,
            proxy: {
              '/api/(.*)': 'http://localhost:3002/',
            },
          },
        },
      };
    };
  }
  return conf;
};
