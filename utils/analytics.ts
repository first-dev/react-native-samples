import { Mixpanel } from "mixpanel-react-native";
import analytics from "@react-native-firebase/analytics";

const mixpanel = new Mixpanel(process.env.EXPO_PUBLIC_MIXPANEL_TOKEN ?? "", true);
mixpanel.init();
mixpanel.setLoggingEnabled(true);

export default class Analytics {
  static debug = {
    enable: false,
    logScreenView: false,
  };
  static track = (event: string, properties?: Record<string, any>) => {
    mixpanel.track(event, properties);
    analytics().logEvent(event, properties);
    if (Analytics.debug.enable) {
      if (Analytics.debug.logScreenView || event !== "screen_view") {
        if (properties) console.log("Analytics.track", event, "\n", properties);
        else console.log("Analytics.track", event);
      }
      mixpanel.flush();
    }
  };
  static identify = (id: string) => {
    mixpanel.identify(id);
    analytics().setUserId(id);
  };
  static setUserProperties = (properties: Record<string, any>) => {
    mixpanel.getPeople().set(properties);
    // analytics().setUserProperties(properties);
  };
  static setSuperProperties = (properties: Record<string, any>) => {
    mixpanel.registerSuperProperties(properties);
  };
  static reset = () => {
    mixpanel.reset();
    analytics().resetAnalyticsData();
  };
}
