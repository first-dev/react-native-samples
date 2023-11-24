import { LogBox } from "react-native";

if (__DEV__) {
  const ignoreWarns = [
    // need to be fixed by the libraries authors
    "ViewPropTypes",
    // probably because expo-firebase-recaptcha is deprecated
    "No native ExpoFirebaseCore",
    // can be safely ignored since it's development only
    "SerializableStateInvariantMiddleware",
    //
    "Constants.platform.ios.model",
  ];
  const warn = console.warn;
  console.warn = (...arg) => {
    if (arg.some((s) => ignoreWarns.some((w) => s.includes?.(w)))) return;
    else warn(...arg);
  };
  const ignoreErrors = ["ViewPropTypes"];
  const error = console.error;
  console.error = (...arg) => {
    if (arg.some((s) => ignoreErrors.some((w) => s.includes?.(w)))) return;
    else error(...arg);
  };
  LogBox.ignoreLogs(ignoreWarns);
}
