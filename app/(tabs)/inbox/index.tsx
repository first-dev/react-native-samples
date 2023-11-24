/* eslint-disable react-native/no-unused-styles */
import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetRef } from "../../../components/BottomSheet";
import Button from "../../../components/Button";
import ChannelsList from "../../../components/Inbox/ChannelsList";
import Navigation from "../../../components/Inbox/Navigation";
import Loading from "../../../components/Loading";
import ShareSheet from "../../../components/ShareSheet";
import { View } from "../../../components/Themed";
import UsersList from "../../../components/UsersList";
import { IUser, TUuid } from "../../../interfaces";
import { useAppSelector } from "../../../redux/hooks";
import { useGetMyDMsQuery, useLazyGetMyDMsQuery } from "../../../redux/services/me";
import { useGetFriendsForUserQuery } from "../../../redux/services/users";
import { DMSearchParams } from "./DMs";

export type TInboxViewType = "Friends" | "Others";

const Inbox = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<TInboxViewType>("Friends");
  const me = useAppSelector((state) => state.users.me);
  const directMessageChannels = useAppSelector((state) => state.channels.privateChatChannels);
  const directMessageChannelsCount = Object.keys(directMessageChannels).length;
  const channelDetails = useAppSelector((state) => state.channels.channelDetails);
  const myFriends = useAppSelector(
    (state) => state.users.friendsForUser[state.users.me?.uuid ?? ""]
  ) as Record<string, boolean> | undefined;
  const myFriendsCount = Object.keys(myFriends ?? {}).length;
  useGetFriendsForUserQuery({ userUuid: me!.uuid }, { skip: !me || myFriendsCount > 0 }); // TODO: ADD PAGINATION
  const userDetails = useAppSelector((state) => state.users.userDetails);
  const [friendsDirectMessageChannelsUuids, othersDirectMessageChannelsUuids] = useMemo(() => {
    const friendsChannelsUuids: Record<string, boolean> = {};
    const othersChannelsUuids: Record<string, boolean> = {};
    Object.keys(directMessageChannels).forEach((channelUuid) => {
      const channel = channelDetails[channelUuid];
      if (!channel) return;
      const otherUser = channel.members.find((member) => member.uuid !== me?.uuid);
      if (!otherUser) return;
      if (myFriends?.[otherUser.uuid]) {
        friendsChannelsUuids[channelUuid] = true;
      } else {
        othersChannelsUuids[channelUuid] = true;
      }
    });
    return [friendsChannelsUuids, othersChannelsUuids];
  }, [directMessageChannels, channelDetails, myFriends, me?.uuid]);
  const [getMyDMs, { isLoading: directMessagesIsLoading }] = useLazyGetMyDMsQuery({});
  useFocusEffect(
    useCallback(() => {
      getMyDMs({});
    }, [getMyDMs])
  );
  // TODO: FETCH ABOVE IF THEY DON'T EXIST
  const styles = useStyles();
  const newMessageSheetRef = useRef<BottomSheetRef>(null);
  const sheetCancelHandler = useCallback(() => {
    newMessageSheetRef.current?.close();
  }, []);
  const sheetUserPressHandler = useCallback(
    (userUuid: TUuid) => {
      newMessageSheetRef.current?.close();
      const dmParams: DMSearchParams = {
        otherUserUuid: userUuid,
      };
      // check if a DM already exists for this user
      const existingChannelUuid = Object.keys(directMessageChannels).find((channelUuid) => {
        const channel = channelDetails[channelUuid];
        if (!channel) return false;
        const otherUser = channel.members.find((member) => member.uuid !== me?.uuid);
        if (!otherUser) return false;
        return otherUser.uuid === userUuid;
      });
      if (existingChannelUuid) {
        dmParams.channelUuid = existingChannelUuid;
      }
      router.push({ pathname: `(tabs)/inbox/DMs`, params: dmParams });
    },
    [channelDetails, directMessageChannels, me?.uuid, router]
  );

  const myFriendsDetails: IUser[] = useMemo(() => {
    return Object.keys(myFriends ?? {}).map((friendUuid) => userDetails[friendUuid]);
  }, [myFriends, userDetails]);

  const channelsUuids = useMemo(() => {
    return currentTab == "Friends"
      ? friendsDirectMessageChannelsUuids
      : othersDirectMessageChannelsUuids;
  }, [currentTab, friendsDirectMessageChannelsUuids, othersDirectMessageChannelsUuids]);

  const shareSheetRef = useRef<BottomSheetRef>(null);
  const handleShare = useCallback(() => {
    shareSheetRef.current?.open();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={["right", "left", "top"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.headerContainer}>
          <Navigation
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
            onNewMessagePress={() => {
              newMessageSheetRef.current?.open();
            }}
          />
        </View>
        {directMessagesIsLoading ? <Loading /> : <ChannelsList channelsUuids={channelsUuids} />}
      </SafeAreaView>
      <BottomSheet
        ref={newMessageSheetRef}
        style={styles.bottomSheet}
        backdrop
        headerComponent={
          <View style={styles.sheetHeader}>
            <TouchableOpacity style={styles.sheetHeaderAction} onPress={sheetCancelHandler}>
              <Text style={styles.sheetHeaderText}>Cancel</Text>
            </TouchableOpacity>
            <View pointerEvents="none" style={styles.sheetHeaderTitleContainer}>
              <Text style={styles.sheetHeaderTitle}>New Message</Text>
            </View>
          </View>
        }
      >
        <>
          {myFriendsDetails.length == 0 ? (
            <View style={styles.noneContainer}>
              <View style={styles.allowLocationContainer}>
                <View style={styles.iconBackground}>
                  <Ionicons name="person" size={64} color="#8C8C8C" />
                </View>
                <Text style={styles.allowLocationHeader}>No friends yet 🥲</Text>
                <Text style={styles.allowLocationText}>
                  Invite your friends and get this party started.
                </Text>
              </View>
              <View style={styles.btnContainer}>
                <Button title="Invite Friends" onPress={handleShare} />
              </View>
            </View>
          ) : (
            <UsersList
              contentStyle={styles.usersListContent}
              users={myFriendsDetails}
              mode="press"
              onPress={sheetUserPressHandler}
              searchEnabled={false}
              searchPlaceholder="Start typing name or @username"
            />
          )}
          <ShareSheet
            bottomSheetRef={shareSheetRef}
            link="https://share.radarchat.io/store.html"
            title="Share Radar with your friends"
          />
        </>
      </BottomSheet>
    </>
  );
};

const useStyles = () => {
  const theme = useTheme();
  const headerHight = 60;
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const bottomSheetTopMargin = 116;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: "#fff",
        },
        headerContainer: {
          width: "100%",
        },
        locationFooter: {
          fontSize: 12,
          color: "#8C8C8C",
        },
        container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        },
        allowLocationContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          paddingHorizontal: 32,
        },
        allowLocationText: {
          textAlign: "center",
          fontSize: 12,
        },
        allowLocationHeader: {
          textAlign: "center",
          fontSize: 30,
          fontWeight: "700",
        },
        inputContainer: {
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
          borderTopColor: "#E9E9E9",
          borderTopWidth: 1,
        },
        flatList: {
          flex: 1,
          paddingHorizontal: 16,
          width: "100%",
          marginBottom: 64,
          marginTop: 16,
        },
        iconBackground: {
          width: 160,
          height: 160,
          borderRadius: 80,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F3F3F3",
        },
        noneContainer: {
          flex: 1,
          padding: 16,
        },
        bottomSheet: {
          height: height - headerHight - bottomSheetTopMargin,
          marginTop: top + headerHight + bottomSheetTopMargin,
        },
        sheetHeader: {
          flexDirection: "row",
          height: 60,
          paddingHorizontal: theme.spacing.m,
          backgroundColor: "transparent",
          alignItems: "center",
        },
        sheetHeaderAction: {
          justifyContent: "center",
        },
        sheetHeaderText: {
          fontSize: 14,
          fontWeight: "500",
          color: theme.colors?.onBackground,
        },
        sheetHeaderTitleContainer: {
          flex: 1,
          position: "absolute",
          left: 0,
          right: 0,
          backgroundColor: "transparent",
        },
        sheetHeaderTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: theme.colors?.onBackground,
          textAlign: "center",
        },
        usersListContent: {
          paddingBottom: 40,
        },
        btnContainer: { paddingVertical: 36 },
      }),
    [headerHight, height, theme, top]
  );
  return styles;
};
export default Inbox;
