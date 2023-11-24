import Constants from "expo-constants";

/**
 * Loads environment variables from `eas.json` (forwarded through `app.config.js`)
 * 
 * _Note: this is done automatically in SDK 49+_
 */
export const loadEasEnv = () => {
  const env: Record<string, string> = Constants.expoConfig?.extra?.env;
  if (env) {
    Object.keys(env).forEach((key) => {
      process.env[key] = env[key];
    });
  }
};
