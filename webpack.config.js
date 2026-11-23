const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const ESLintPlugin = require("eslint-webpack-plugin");

const plugins = defaultConfig.plugins.filter((p) => {
  if (
    Object.values(p).length === 2 &&
    Object.values(p)?.[1]["filename"] &&
    Object.values(p)?.[1]["filename"] === "[name]-rtl.css"
  ) {
    return false;
  }
  return true;
});

module.exports = {
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry(),
    "admin/dashboard": "./src/admin/dashboard.js",
    "admin/post": "./src/admin/post.js",
    "admin/onboarding": "./src/admin/onboarding.js",
    "blocks/index": "./src/blocks/index.js"
  },
  plugins: [...plugins, new ESLintPlugin()],
  // Size hints are only noise here: the Free bundles are small enough for an admin
  // page and a single player block.
  performance: { hints: false },
  // Dart Sass prints its own deprecation notices (legacy JS API, @import) through
  // webpack's logger; they come from the build tools, not from anything we can fix here.
  infrastructureLogging: { level: "error" },
  stats: { logging: "error" },
  optimization: {},
};
