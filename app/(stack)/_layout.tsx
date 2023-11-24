import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import auth from "@react-native-firebase/auth";
import { Redirect } from "expo-router";

export type CustomStackOptions = NativeStackNavigationOptions & {
  headerNextTitle?: string;
  onBack?: () => void;
  onNext?: () => void;
  headerBackIcon?: string;
  headerNextIcon?: string;
  headerNextLoading?: boolean;
};

export default function Layout() {
  const styles = useStyles();

  if (!auth().currentUser) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={
        {
          headerBackIcon: "chevron-back",
          header: ({ options, navigation }) => {
            const {
              headerBackTitle,
              title,
              headerNextTitle,
              onBack = navigation.goBack,
              onNext,
              headerBackIcon,
              headerNextIcon,
              headerNextLoading,
            } = options as CustomStackOptions;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const theme = useTheme();
            return (
              <SafeAreaView style={styles.safeArea}>
                <View style={styles.header} pointerEvents="box-none">
                  <TouchableOpacity style={styles.headerAction} onPress={onBack}>
                    {headerBackIcon ? (
                      // TODO: (important)Migrate to RadarIcon after merging
                      <Icon source={{ pack: "Ionicons", name: headerBackIcon as any }} size={24} />
                    ) : (
                      <Text style={styles.headerText}>{headerBackTitle}</Text>
                    )}
                  </TouchableOpacity>
                  <View pointerEvents="none" style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{title}</Text>
                  </View>
                  <TouchableOpacity style={styles.headerAction} onPress={onNext}>
                    {headerNextLoading ? (
                      <ActivityIndicator color={theme.colors?.secondary} size={24} />
                    ) : headerNextIcon ? (
                      <Icon source={{ pack: "Feather", name: headerNextIcon as any }} size={24} />
                    ) : (
                      <Text style={styles.headerText}>{headerNextTitle}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            );
          },
        } as CustomStackOptions
      }
    >
      <Stack.Screen
        name="edit-group"
        options={
          {
            headerShown: false,
            title: "",
            headerNextTitle: "Done",
          } as CustomStackOptions
        }
      />
      <Stack.Screen
        name="set-location"
        options={
          {
            title: "Set Group Location",
            headerNextTitle: "Done",
          } as CustomStackOptions
        }
      />
      <Stack.Screen
        name="edit-members"
        options={
          {
            title: "Edit Members",
            headerNextTitle: "Edit",
          } as CustomStackOptions
        }
      />
      <Stack.Screen
        name="edit-themes"
        options={
          {
            title: "Edit Themes",
            headerNextTitle: "Done",
          } as CustomStackOptions
        }
      />
      <Stack.Screen
        name="chat-photo"
        options={
          {
            headerNextIcon: "download",
            title: "Chat Photo",
            headerNextTitle: "Done",
          } as CustomStackOptions
        }
      />
      <Stack.Screen
        name="update-prompt"
        options={
          {
            headerShown: false,
          } as CustomStackOptions
        }
      />
    </Stack>
  );
}
const useStyles = () => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          backgroundColor: theme.colors?.background,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          height: 60,
          paddingHorizontal: theme.spacing.m,
          alignItems: "center",
        },
        headerAction: {
          justifyContent: "center",
        },
        headerText: {
          fontSize: 14,
          fontWeight: "500",
          color: theme.colors?.onBackground,
        },
        headerTitleContainer: {
          flex: 1,
          position: "absolute",
          left: 0,
          right: 0,
        },
        headerTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: theme.colors?.onBackground,
          textAlign: "center",
        },
      }),
    [theme]
  );
  return styles;
};
