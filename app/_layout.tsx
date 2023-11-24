import FontAwesome from "@expo/vector-icons/FontAwesome";
import { PortalProvider } from "@gorhom/portal";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import AnalyticsConfigurator from "../components/AnalyticsConfigurator";
import AppInitializer from "../components/AppInitializer";
import LocationListener from "../components/LocationListener";
import { store } from "../redux/store";
import { paperTheme } from "../utils/theme";

export { default as ErrorBoundary } from "../components/CustomErrorBoundary";

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    RadarIcons: require("../assets/fonts/radar-icons.ttf"),
    ...FontAwesome.font,
  });
  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!fontsLoaded && <SplashScreen />}
      {fontsLoaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={paperTheme}>
      <Provider store={store}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <PortalProvider>
            <RootSiblingParent>
              <AppInitializer />
              <LocationListener />
              <AnalyticsConfigurator />
              <Stack screenOptions={{ headerShown: false }} />
            </RootSiblingParent>
          </PortalProvider>
        </ThemeProvider>
      </Provider>
    </PaperProvider>
  );
}
