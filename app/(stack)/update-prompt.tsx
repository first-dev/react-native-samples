import Constants from "expo-constants";
import { Image } from "expo-image";
import { FC, useCallback, useMemo } from "react";
import { Linking, Platform, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Space from "../../components/Space";
import { View } from "../../components/Themed";

const UpdatePrompt: FC = () => {
  const theme = useTheme();
  const s = useStyles();
  const openStore = useCallback(async () => {
    const link = Platform.select({
      ios: Constants.expoConfig?.ios?.appStoreUrl,
      android: Constants.expoConfig?.android?.playStoreUrl,
    });
    if (!link) return;
    const canOpen = await Linking.canOpenURL(link);
    if (!canOpen) return;
    await Linking.openURL(link);
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <Image
        source={require("../../assets/images/icon-transparent.png")}
        style={s.image}
        contentFit="contain"
      />
      <Space height={theme.spacing.xl} />
      <Text style={s.title}>A new version of Radar {"\n"} is available</Text>
      <View style={{ flex: 1 }} />
      <Button title="Update now" onPress={openStore} />
      <Space height={theme.spacing.s} />
      <Text style={s.hint}>The version you are currently using is no longer supported</Text>
    </SafeAreaView>
  );
};
export default UpdatePrompt;
const useStyles = () => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingVertical: theme.spacing.screenVerticalSpacing,
          paddingHorizontal: theme.spacing.screenHorizontalSpacing,
          backgroundColor: theme.colors?.background,
          paddingTop: 220,
          alignItems: "center",
        },
        image: {
          width: 200,
          height: 200,
        },
        title: {
          fontSize: 30,
          fontWeight: "700",
          textAlign: "center",
          color: theme.colors.onBackground,
        },
        hint: {
          fontSize: 11,
          fontWeight: "400",
          color: theme.colors.onBackground,
          opacity: 0.5,
        },
      }),
    [theme]
  );
  return styles;
};
