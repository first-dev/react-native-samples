import { Redirect, Stack } from "expo-router";
import auth from "@react-native-firebase/auth";

const Layout = () => {
  if (auth().currentUser) {
    return <Redirect href="/(tabs)/explore" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
};
export default Layout;
