import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { isEmpty } from "lodash";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetRef } from "../../../components/BottomSheet";
import CreateGroupSheet from "../../../components/CreateGroupSheet";
import GroupsList from "../../../components/GroupsList";
import Loading from "../../../components/Loading";
import Rings from "../../../components/Rings";
import TransparentPressable from "../../../components/TransparentPressable";
import { useAppSelector } from "../../../redux/hooks";
import { useGetMyGroupsJoinedQuery } from "../../../redux/services/me";

import MaskedView from "@react-native-masked-view/masked-view";
import Button from "../../../components/Button";

const Groups = () => {
  const joinedGroups = useAppSelector((state) => state.groups.joinedGroups);
  const joinedGroupsCount = Object.keys(joinedGroups).length;
  const router = useRouter();

  const { data: joinedGroupsData, isFetching: joinedGroupsIsFetching } = useGetMyGroupsJoinedQuery(
    {},
    {
      skip: joinedGroupsCount > 0, // TODO: this logic is flawed; e.g. say the user opens the app, creates a group from the Explore screen, then navigates to the Groups screen. The Groups screen will show 1 group - the group they just created - without fetching the user's joined groups.
    }
  );
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={["right", "left", "top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      {joinedGroupsIsFetching ? (
        <Loading />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <View style={{ width: 24 }} />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerText}>Groups</Text>
              <Text style={styles.headerSubText}>{joinedGroupsCount} groups</Text>
            </View>
            <TransparentPressable onPress={() => bottomSheetRef.current?.open()}>
              <Entypo name="plus" size={24} color="black" />
            </TransparentPressable>
          </View>
          {!isEmpty(joinedGroups) ? (
            <GroupsList groupsUuids={joinedGroups} />
          ) : (
            <>
              <View style={styles.noGroupsContainer}>
                <Rings style={styles.rings} icon="user-group" />
                <MaskedView
                  style={{ height: 74 }}
                  maskElement={
                    <Text style={styles.noGroupsTitle}>You haven’t joined any groups yet</Text>
                  }
                >
                  <LinearGradient
                    colors={["#0b0b0e", "#515159"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ flex: 1 }}
                  />
                </MaskedView>
                <Text style={styles.noGroupsSubtitle}>
                  Create your first group and invite friends or explore groups nearby!
                </Text>
              </View>
              <View style={styles.buttonsContainer}>
                <Button title="Create Group" onPress={() => bottomSheetRef.current?.open()} />
                <Button
                  title="Explore Groups Nearby"
                  customStyle={{
                    backgroundColor: "#F0F0F1",
                  }}
                  titleStyle={{
                    color: "#0B0B0E",
                  }}
                  onPress={() => router.replace({ pathname: "explore", params: { tab: "Groups" } })}
                />
              </View>
            </>
          )}
        </>
      )}
      <CreateGroupSheet bottomSheetRef={bottomSheetRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitleContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerSubText: {
    fontSize: 12,
    color: "#8C8C8C",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  noGroupsContainer: {
    margin: 32,
    justifyContent: "flex-end",
    gap: 24,
    paddingHorizontal: 32,
    flex: 1,
  },
  rings: {
    alignSelf: "center",
  },
  noGroupsTitle: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  noGroupsSubtitle: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "400",
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 32,
    marginHorizontal: 32,
  },
});

export default Groups;
