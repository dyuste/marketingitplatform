require("babel-register");
import EntryPointGenerator from './client/EntryPointGenerator';
import RenderOnServerStyles from './webpack_plugins/RenderOnServerStyles';
import webpack from 'webpack';

let entryPointsPromise = EntryPointGenerator();
let configPromise = new Promise(function(resolve, reject) {
  entryPointsPromise.then(entryPoints => {
    resolve({
      entry: entryPoints,
      output: {
        path: __dirname,
        filename: 'static/bundle/[name].js'
      },
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["ignore-loader"]
          },
          {
            loader: 'babel-loader',
            query: {
              presets: ['react', 'es2015', 'stage-3'] 
            },
            test: /\.js$/,
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        modules: [
          '.',
          'node_modules'
        ]
      },
      devtool: "source-map",
      plugins: [
        new RenderOnServerStyles({options: {output: './static/bundle/'}}),
        /*new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,   // enable source maps to map errors (stack traces) to modules
          output: {
            comments: false, // remove all comments
          },
        }),*/
      ]/*,
      watch: false,
      watchOptions: {
      	aggregateTimeout: 300,
      	ignored: ["static/*", "node_modules"],

      }*/
    });
  });
})

module.exports = configPromise;
