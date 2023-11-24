import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetRef } from "../../components/BottomSheet";
import Icon from "../../components/Icon";
import Space from "../../components/Space";
import UsersList, { UsersListRef } from "../../components/UsersList";
import { DUMMY_USERS } from "../../constants/dummy_data";
import { CustomStackOptions } from "./_layout";
import KeyboardSpacer from "react-native-keyboard-spacer";

type Params = {
  membersIds: string;
  membersType: "members" | "moderators";
};

type Props = {
  style?: StyleProp<ViewStyle>;
};

const EditMembers: FC<Props> = ({ style }) => {
  const theme = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const params = useSearchParams<Params>();
  const [mode, setMode] = useState<"view" | "delete">("view");
  const [usersIds, setUsersIds] = useState<string[]>([]);
  const [deletedUsersIds, setDeletedUsersIds] = useState<string[]>([]);
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const sheetUsersListRef = useRef<UsersListRef>(null);
  const users = useMemo(() => {
    //TODO: need to fetch users
    return DUMMY_USERS.filter((user) => usersIds.includes(user.uuid));
  }, [usersIds]);
  const usersToAdd = useMemo(() => {
    //TODO: need to fetch users
    return DUMMY_USERS.filter((user) => !usersIds.includes(user.uuid));
  }, [usersIds]);
  const deleteHandler = useCallback((userId: string) => {
    setUsersIds((prev) => prev.filter((id) => id != userId));
    setDeletedUsersIds((prev) => [...prev, userId]);
  }, []);
  const sheetCancelHandler = useCallback(() => {
    bottomSheetRef.current?.close();
    sheetUsersListRef.current?.resetSelectedUsersIds();
  }, []);
  const sheetAddHandler = useCallback(() => {
    bottomSheetRef.current?.close();
    setUsersIds((prev) => [...prev, ...(sheetUsersListRef.current?.getSelectedUsersIds() ?? [])]);
    sheetUsersListRef.current?.resetSelectedUsersIds();
  }, []);
  useEffect(() => {
    setUsersIds(params.membersIds?.split(",") ?? []);
  }, [params.membersIds]);

  return (
    <View style={[styles.container, style]}>
      <Stack.Screen
        options={
          {
            title: `${usersIds.length} ${
              params.membersType == "members" ? "Members" : "Moderators"
            }`,
            headerNextTitle: mode == "view" ? "Edit" : "Done",
            onNext: () => {
              if (mode == "view") setMode("delete");
              else setMode("view");
            },
            onBack: () => {
              if (mode == "view")
                router.push({
                  pathname: "edit-group",
                  params:
                    params.membersType == "members"
                      ? { membersIds: usersIds.join(",") }
                      : { moderatorsIds: usersIds.join(",") },
                });
              else {
                setUsersIds((prev) => [...prev, ...deletedUsersIds]);
                setDeletedUsersIds([]);
                setMode("view");
              }
            },
          } as CustomStackOptions
        }
      />
      <UsersList
        users={users}
        searchEnabled
        mode={mode}
        onDelete={deleteHandler}
        ListHeader={
          mode == "view"
            ? () => (
                <View style={styles.listHeader}>
                  <TouchableOpacity
                    style={styles.listHeaderItem}
                    onPress={() => bottomSheetRef.current?.open()}
                  >
                    <Icon source={{ pack: "FontAwesome", name: "user-plus" }} />
                    <Space width={12} />
                    <Text style={styles.listHeaderText}>
                      Add {params.membersType == "members" ? "Members" : "Moderators"}
                    </Text>
                  </TouchableOpacity>
                  {params.membersType == "members" && (
                    <>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: theme.colors?.outline,
                        }}
                      />
                      <TouchableOpacity style={styles.listHeaderItem}>
                        <Icon source={{ pack: "Feather", name: "link" }} />
                        <Space width={12} />
                        <Text style={styles.listHeaderText}>Share Invite Link</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <View
                    style={{
                      height: 1,
                      backgroundColor: theme.colors?.outline,
                    }}
                  />
                </View>
              )
            : null
        }
      />
      <BottomSheet
        ref={bottomSheetRef}
        style={styles.bottomSheet}
        backdrop
        headerComponent={
          <View style={styles.sheetHeader}>
            <TouchableOpacity style={styles.sheetHeaderAction} onPress={sheetCancelHandler}>
              <Text style={styles.sheetHeaderText}>Cancel</Text>
            </TouchableOpacity>
            <View pointerEvents="none" style={styles.sheetHeaderTitleContainer}>
              <Text style={styles.sheetHeaderTitle}>
                Add {params.membersType == "members" ? "Members" : "Moderators"}
              </Text>
            </View>
            <TouchableOpacity style={styles.sheetHeaderAction} onPress={sheetAddHandler}>
              <Text style={styles.sheetHeaderText}>Add</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <UsersList
          ref={sheetUsersListRef}
          users={usersToAdd}
          searchEnabled
          searchPlaceholder="Start typing name or @username"
          mode="select"
        />
        <KeyboardSpacer />
      </BottomSheet>
    </View>
  );
};
export default EditMembers;
const useStyles = () => {
  const theme = useTheme();
  const headerHight = useHeaderHeight();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const bottomSheetTopMargin = 116;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors?.background,
        },
        listHeader: {},
        listHeaderItem: {
          flexDirection: "row",
          alignItems: "center",
          height: 48,
          padding: 12,
        },
        listHeaderText: {
          fontSize: 14,
          fontWeight: "500",
          color: theme.colors?.onBackground,
        },
        bottomSheet: {
          //TODO: fix BottomSheet component to support auto height
          height: height - headerHight + top - bottomSheetTopMargin,
          marginTop: headerHight + bottomSheetTopMargin,
        },
        sheetHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
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
        },
        sheetHeaderTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: theme.colors?.onBackground,
          textAlign: "center",
        },
      }),
    [headerHight, height, theme, top]
  );
  return styles;
};
