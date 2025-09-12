// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // other plugins if you have them...
      "react-native-worklets/plugin", // must stay LAST
    ],
  };
};
