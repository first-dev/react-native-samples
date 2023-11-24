/* eslint-disable react-native/no-unused-styles */
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { FC, useCallback, useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import RadarIcon from "../../components/RadarIcon";
import TransparentPressable from "../../components/TransparentPressable";

const tabsRoutes = [
  {
    name: "explore",
    icon: "radar-logo",
    label: "Explore",
  },
  {
    name: "groups",
    icon: "user-group",
    label: "Groups",
  },
  {
    name: "ai-chats",
    icon: "message-ai",
    label: "AI Chats",
  },
  {
    name: "inbox",
    icon: "inbox",
    label: "Inbox",
  },
  {
    name: "profile",
    icon: "user",
    label: "Profile",
  },
] as const;

const TabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  const styles = useTabBarStyles();
  const pressHandler = useCallback(
    (routeName: string) => {
      const activeRouteName = state.routes[state.index].name;
      if (activeRouteName == routeName) {
        if (routeName === "explore") {
          navigation.navigate(routeName, { screen: "index", params: { tab: "Chat" } });
        } else {
          navigation.navigate(routeName, { screen: "index" });
        }
      } else {
        navigation.navigate(routeName);
      }
    },
    [navigation, state.index, state.routes]
  );

  return (
    <View style={styles.container}>
      {tabsRoutes.map(({ icon, label, name }) => {
        const isActive = state.routes[state.index].name === name;
        return (
          <TransparentPressable
            key={name}
            style={[
              styles.item,
              {
                opacity: isActive ? 1 : 0.32,
              },
            ]}
            onPress={() => pressHandler(name)}
          >
            {/* TODO: for the Profile tab, use the user's profile image instead of an icon */}
            <RadarIcon name={icon} size={name != "ai-chats" ? 24 : 40} />
            {name != "ai-chats" && <Text style={styles.text}>{label}</Text>}
          </TransparentPressable>
        );
      })}
    </View>
  );
};
const useTabBarStyles = () => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          justifyContent: "space-between",
          // height: 200,
          // paddingTop: 8,
          // paddingBottom: 20,
          paddingHorizontal: 24,
          paddingTop: 10,

          backgroundColor: theme.colors?.background,
          paddingBottom: Platform.OS == "ios" ? 20 : 10,
          // borderTopColor: "#000",
          // borderTopWidth: 0.5,
        },
        item: {
          // width: 40, // this is causing tab icon name cutting off on iOS
          justifyContent: "center",
          alignItems: "center",
        },
        text: {
          fontSize: 10,
          fontWeight: "400",
          textAlign: "center",
          color: theme.colors?.onBackground,
        },
      }),
    [theme]
  );
  return styles;
};

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ai-chats"
        options={{
          title: "AI Chats",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
