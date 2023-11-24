// https://gist.github.com/hirbod/d6bb5d0fc946a12ba9e3cf01120c604a
const { createRunOncePlugin, withAndroidStyles, AndroidConfig } = require("@expo/config-plugins");

function setForceDarkModeToFalse(styles) {
  styles = AndroidConfig.Styles.assignStylesValue(styles, {
    add: true,
    parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
    name: `android:forceDarkAllowed`,
    value: "false",
  });

  return styles;
}

const withDisableForcedDarkModeAndroid = (config) => {
  return withAndroidStyles(config, (config) => {
    config.modResults = setForceDarkModeToFalse(config.modResults);
    return config;
  });
};

module.exports = createRunOncePlugin(
  withDisableForcedDarkModeAndroid,
  "disable-forced-dark-mode",
  "1.0.0"
);
