const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const resolve = require("resolve");

// eslint-disable-next-line import/order
const paths = require("./paths");

const { ensureSlash, readClientConfig } = require(paths.utils);
const packageData = require(paths.packageJson);

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const ManifestPlugin = require("webpack-manifest-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin-alt");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.tsConfig);

// style files regexes
const jsRegex = /\.(js|mjs|jsx|ts|tsx)$/;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const lastArg = process.argv[process.argv.length - 1];
const skipLinter = lastArg.includes("nolint");

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (client, webpackEnv, dotenvData) {
  const env = dotenvData.raw;
  const isEnvDevelopment = webpackEnv === "local";
  const isEnvProduction = webpackEnv !== "local";

  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  // In development, we always serve from the root. This makes config easier.
  const publicPath = isEnvProduction
    ? ensureSlash("/", true)
    : isEnvDevelopment && "/";
  // Some apps do not use client-side routing with pushState.
  // For these, "homepage" can be set to "." to enable relative asset paths.
  const shouldUseRelativeAssetPaths = publicPath === "./";

  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  const publicUrl = isEnvProduction
    ? publicPath.slice(0, -1)
    : isEnvDevelopment && "";

  // common function to get style loaders
  const getStyleLoaders = (
    cssOptions,
    preProcessor,
    preProcessorOptions = {},
  ) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: {
          ...(shouldUseRelativeAssetPaths
            ? { publicPath: "../../" }
            : undefined),
        },
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve("postcss-loader"),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009",
              },
              stage: 3,
            }),
          ],
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          ...preProcessorOptions,
        },
      });
    }
    return loaders;
  };

  const hasFileAtPath = (path) => {
    return fs.existsSync(path);
  };

  const PackageData = paths.packageJson;
  const ThemeData = paths.clientThemeJson(client);
  const CommonConfig = paths.clientConfigJson(client, "common");
  const EnvironmentConfig = paths.clientConfigJson(client, webpackEnv);
  const ClientConfig = readClientConfig(client, webpackEnv);
  const ImagesConfig = paths.clientImageJson(client);
  const LanguageData = paths.clientLangJson(client);
  const GeoConfig = hasFileAtPath(paths.clientConfigJson(client, "geo"))
    ? paths.clientConfigJson(client, "geo")
    : paths.clientDefaults(`config/geo.json`);

  /**
   * @todo Add social meta data...
   */
  const webpackHtmlMetaData = {
    // List of almost all possible meta tags: https://github.com/joshbuchea/HEAD#meta
    charset: "utf-8",
    viewport: "width=device-width, initial-scale=1",
  };

  // TODO: Needs further setup
  const webpackHtmlTemplateParameters = {
    APPS: {
      GOOGLE_ANALYTICS: ClientConfig?.apps?.google_analytics,
      GOOGLE_TAG_MANAGER: ClientConfig?.apps?.google_tag_manager,
      GOOGLE_OPTIMIZE: ClientConfig?.apps?.google_optimize,
      FACEBOOK_PIXEL: ClientConfig?.apps?.facebook_pixel,
      SEGMENT: ClientConfig?.apps?.segment,
      APPSFLYER: ClientConfig?.apps?.appsflyer,
      FULLSTORY: ClientConfig?.apps?.fullstory,
      MAVRCK: ClientConfig?.apps?.mavrck,
    },
    API_URL: env?.LBX_PATRON_URL,
    API_VERSION: env?.LBX_PATRON_VERSION,
    BUILD_ENV: webpackEnv,
    CLIENT: ClientConfig?.id,
    DEBUG_TOOLS: env?.DEBUG_TOOLS || false,
    FAVICONS: ClientConfig?.website?.favicons || [],
    FONTS: ClientConfig?.theme?.fonts?.href,
    GIT_BRANCH: env?.GIT_BRANCH,
    GIT_VERSION: packageData.version,
    PUBLIC_URL: publicPath,
  };

  const webpackHtmlMinificationConfig = isEnvProduction
    ? {
        // From Plugin Documentation
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        // From CRA
        removeEmptyAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    : false;

  return {
    mode: isEnvProduction ? "production" : "development",
    // Stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "eval-source-map",
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: [
      // Include an alternative client for WebpackDevServer. A client's job is to
      // connect to WebpackDevServer by a socket and get notified about changes.
      // When you save a file, the client will either apply hot updates (in case
      // of CSS changes), or refresh the page (in case of JS changes). When you
      // make a syntax error, this client will display a syntax error overlay.
      // Note: instead of the default WebpackDevServer client, we use a custom one
      // to bring better experience for Create React App users. You can replace
      // the line below with these two lines if you prefer the stock client:
      // require.resolve('webpack-dev-server/client') + '?/',
      // require.resolve('webpack/hot/dev-server'),
      isEnvDevelopment &&
        require.resolve("react-dev-utils/webpackHotDevClient"),
      // Finally, this is your app's code:
      paths.appIndexJs,
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
    ].filter(Boolean),
    output: {
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: `static/js/${
        isEnvProduction ? "[name].[contenthash].js" : "bundle.js"
      }`,
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: `static/js/${
        isEnvProduction ? "[name].[contenthash].chunk.js" : "[name].chunk.js"
      }`,
      // We inferred the "public path" (such as / or /my-project) from homepage.
      // We use "/" in development.
      publicPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, "/")
        : isEnvDevelopment &&
          ((info) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending futher investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: shouldUseSourceMap,
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true,
                }
              : false,
          },
        }),
      ],

      // Our vendor hash should stay consistent between builds.
      // https://webpack.js.org/guides/caching/
      moduleIds: "hashed",

      // Split runtime code into a separate chunk
      // Create a single runtime bundle for all chunks
      // https://webpack.js.org/guides/caching/
      runtimeChunk: "single",

      // SplitChunksPlugin
      // https://webpack.js.org/plugins/split-chunks-plugin/
      splitChunks: {
        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        chunks: "all",
        // Extract third-party libraries to a separate vendor chunk
        // as they are less likely to change than our local source code.
        // Clients will request less from the server to stay up to date.
        // https://webpack.js.org/guides/caching/
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
      // webpack does extra algorithmic work to optimize the output for size and load performance.
      // These optimizations are performant for smaller codebases, but can be costly in larger ones.
      // https://webpack.js.org/guides/build-performance/
      removeAvailableModules: false,
      removeEmptyChunks: false,
    },
    resolve: {
      // Whether to resolve symlinks to their symlinked location.
      // Disabled to increase resolving speed.
      // https://webpack.js.org/guides/build-performance/
      symlinks: false,
      // This allows you to set a fallback for where Webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ["node_modules", "src"].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        env.NODE_PATH.split(path.delimiter).filter(Boolean),
      ),
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: paths.moduleFileExtensions
        .map((ext) => `.${ext}`)
        .filter((ext) => useTypeScript || !ext.includes("ts")),
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        "react-native": "react-native-web",
        // Lunchbox
        PackageData,
        ThemeData,
        CommonConfig,
        EnvironmentConfig,
        ImagesConfig,
        LanguageData,
        // GeoConfig,
        react: path.resolve("./node_modules/react"),
      },
      plugins: [
        // Adds support for installing with Plug'n'Play, leading to faster installs and adding
        // guards against forgotten dependencies and such.
        PnpWebpackPlugin,
      ],
    },
    resolveLoader: {
      plugins: [
        // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
        // from the current package.
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        !skipLinter && {
          test: /\.(js|mjs|jsx)$/,
          enforce: "pre",
          use: [
            {
              options: {
                formatter: require.resolve("react-dev-utils/eslintFormatter"),
                eslintPath: require.resolve("eslint"),
              },
              loader: require.resolve("eslint-loader"),
            },
          ],
          include: paths.appSrc,
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // Process generic image assets
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              // Transforms files into base64 URIs.
              loader: require.resolve("url-loader"),
              options: {
                limit: 10000,
                name: `static/media/${
                  isEnvProduction
                    ? "[name].[contenthash:8].[ext]"
                    : "[name].[ext]"
                }`,
              },
            },
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: jsRegex,
              include: paths.appSrc,
              loader: require.resolve("babel-loader"),
              options: {
                customize: require.resolve(
                  "babel-preset-react-app/webpack-overrides",
                ),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                cacheCompression: isEnvProduction,
                compact: isEnvProduction,
              },
            },
            // Process any JS outside of the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve("babel-loader"),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [
                    require.resolve("babel-preset-react-app/dependencies"),
                    { helpers: true },
                  ],
                ],
                cacheDirectory: true,
                cacheCompression: isEnvProduction,

                // If an error happens in a package, it's possible to be
                // because it was compiled. Thus, we don't want the browser
                // debugger to show the original code. Instead, the code
                // being evaluated would be much more helpful.
                sourceMaps: false,
              },
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  localIdentName: isEnvProduction
                    ? "[contenthash:base64:5]"
                    : "[name]__[local]__[contenthash:base64:5]",
                },
              }),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                },
                "sass-loader",
                {
                  // Prefer `dart-sass`
                  implementation: require("sass"),
                  additionalData: `$client: ${client};`,
                  sassOptions: {
                    includePaths: [
                      paths.appNodeModules,
                      paths.appSrc,
                      paths.clientPath(client),
                    ],
                  },
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                },
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    localIdentName: isEnvProduction
                      ? "[contenthash:base64:5]"
                      : "[name]__[local]__[contenthash:base64:5]",
                  },
                },
                "sass-loader",
                {
                  // Prefer `dart-sass`
                  implementation: require("sass"),
                  sassOptions: {
                    includePaths: [
                      paths.appNodeModules,
                      paths.appSrc,
                      paths.clientPath(client),
                    ],
                  },
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                },
              ),
            },
            // Handle SVG Files declared in Javascript Files
            {
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
              issuer: {
                test: jsRegex,
              },
              use: [
                // We are going to handle the babel from here
                {
                  loader: "babel-loader",
                  options: {
                    presets: ["@babel/preset-env"],
                  },
                },
                // Transform SVGs into React components.
                {
                  loader: "@svgr/webpack",
                  options: {
                    babel: true,
                  },
                },
                //
                {
                  loader: "url-loader",
                  options: {
                    // Default is true in the newest version, causing errors
                    esModule: false,
                  },
                },
              ],
            },
            // Handle SVG files declared in other files
            {
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
              // Transforms files into base64 URIs.
              loader: "url-loader",
            },

            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              loader: require.resolve("file-loader"),
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [jsRegex, /\.ejs$/, /\.html$/, /\.json$/, /\.svg$/],
              options: {
                name: `static/media/${
                  isEnvProduction
                    ? "[name].[contenthash:8].[ext]"
                    : "[name].[ext]"
                }`,
              },
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      // Remove all files inside output directory, as well as all
      // unused webpack assets after every successful rebuild.
      // https://github.com/johnagan/clean-webpack-plugin
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          "**/*",
          "!.well-known/**",
          "!apple-developer-merchantid-domain-association*",
        ],
      }),
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        title: isEnvProduction
          ? ClientConfig?.website?.name ??
            `${ClientConfig?.restaurant} Online Ordering`
          : `${client} (${webpackEnv})`,
        filename: "index.html",
        template: paths.appHtmlTemplate,
        templateContent: false,
        templateParameters: webpackHtmlTemplateParameters,
        inject: false,
        publicPath: "auto",
        scriptLoading: "defer",
        favicon: ``,
        meta: webpackHtmlMetaData,
        base: false,
        minify: webpackHtmlMinificationConfig,
        hash: false,
        cache: isEnvProduction,
        showErrors: !isEnvProduction,
      }),
      // Inlines the webpack runtime script. This script is too small to warrant
      // a network request.
      isEnvProduction &&
        shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(paths.appPath),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(dotenvData.stringified),
      // This is necessary to emit hot updates (currently CSS only):
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      isEnvDevelopment &&
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      // Generate a manifest file which contains a mapping of all asset filenames
      // to their corresponding output file so that tools can pick it up without
      // having to parse `index.html`.
      new ManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath,
        generate: (seed, files) => {
          const manifestFiles = files.reduce(function (manifest, file) {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);

          return {
            files: manifestFiles,
          };
        },
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // Generate a service worker script that will precache, and keep up to date,
      // the HTML & assets that are part of the Webpack build.
      isEnvProduction &&
        new WorkboxWebpackPlugin.GenerateSW({
          clientsClaim: true,
          exclude: [/\.map$/, /asset-manifest\.json$/],
          navigateFallback: `${publicUrl}/index.html`,
          navigateFallbackDenylist: [
            // Exclude URLs starting with /_, as they're likely an API call
            new RegExp("^/_"),
            // Exclude URLs containing a dot, as they're likely a resource in
            // public/ and not a SPA route
            new RegExp("/[^/]+\\.[^/]+$"),
          ],
        }),
      // TypeScript type checking
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          typescript: resolve.sync("typescript", {
            basedir: paths.appNodeModules,
          }),
          async: isEnvDevelopment,
          useTypescriptIncrementalApi: true,
          checkSyntacticErrors: true,
          resolveModuleNameModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          resolveTypeReferenceDirectiveModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          tsconfig: paths.tsConfig,
          reportFiles: [
            "**",
            "!**/__tests__/**",
            "!**/?(*.)(spec|test).*",
            "!**/src/setupProxy.*",
            "!**/src/setupTests.*",
          ],
          watch: paths.appSrc,
          silent: true,
          // The formatter is invoked directly in WebpackDevServerUtils during development
          formatter: isEnvProduction ? typescriptFormatter : undefined,
        }),
    ].filter(Boolean),
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };
};
