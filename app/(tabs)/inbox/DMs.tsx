import { Entypo } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatView from "../../../components/ChatView";
import ProfileMedia from "../../../components/Groups/ProfileMedia";
import Loading from "../../../components/Loading";
import { Text, View } from "../../../components/Themed";
import TransparentPressable from "../../../components/TransparentPressable";
import WrapperView from "../../../components/WrapperView";
import { useNewDmChannelMutation } from "../../../redux/services/channels";
import { useGetMyDMsQuery } from "../../../redux/services/me";
import { useGetUserByIdQuery } from "../../../redux/services/users";

export type DMSearchParams = {
  channelUuid?: string; // `undefined` if this is a new DM
  otherUserUuid?: string;
};

const DMs = () => {
  const router = useRouter();
  const theme = useTheme();
  const { channelUuid: paramChannelUuid, otherUserUuid } = useLocalSearchParams<DMSearchParams>();
  const [channelUuid, setChannelUuid] = useState(paramChannelUuid);
  const [newDmChannel] = useNewDmChannelMutation();
  useEffect(() => {
    (async () => {
      if (!channelUuid && otherUserUuid) {
        try {
          const { uuid } = await newDmChannel({ userUuid: otherUserUuid }).unwrap();
          setChannelUuid(uuid);
        } catch (e) {
          console.log("error creating new dm channel", e);
          //TODO: handle newDmChannel error
        }
      }
    })();
  }, [channelUuid, newDmChannel, otherUserUuid]);
  const { data: otherUser, isFetching: otherUserIsFetching } = useGetUserByIdQuery(
    otherUserUuid as string,
    { skip: !otherUserUuid }
  );
  const { isFetching: DMsIsFetching } = useGetMyDMsQuery({});
  const handleNavigateBack = () => {
    router.back();
  };

  if (otherUserIsFetching || DMsIsFetching) {
    return <Loading />;
  }

  if (!otherUser) {
    // || !channel check was removed from here.
    // return <Redirect href="[...uncached]" />;
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <WrapperView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.navigationContainer}>
          <TransparentPressable onPress={handleNavigateBack}>
            <Entypo name="chevron-left" size={24} color="black" />
          </TransparentPressable>
          <View>
            <Text style={styles.groupName}>{otherUser.name || `@${otherUser.username}`}</Text>
          </View>
          <View style={styles.mediaContainer}>
            <ProfileMedia profileMedia={otherUser.profile_media} userUuid={otherUser.uuid} />
          </View>
        </View>
        {channelUuid ? (
          <ChatView channelUuid={channelUuid} chatType="dm" />
        ) : (
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        )}
      </WrapperView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "center",
  },
  mediaContainer: {
    width: 32,
    height: 32,
    borderRadius: 40,
  },
});

export default DMs;
