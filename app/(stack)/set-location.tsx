import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FC, useCallback, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import LocationSearch from "../../components/CreateGroupSheet/AddDetails/LocationSearch";
import { CustomStackOptions } from "./_layout";
import { TUuid } from "../../interfaces";

type Props = {
  style?: StyleProp<ViewStyle>;
};

const SetLocation: FC<Props> = ({ style }) => {
  const styles = useStyles();
  const router = useRouter();
  const { defaultLocationUuid, groupUuid } = useLocalSearchParams(); // TODO: reflect that this is now UUID, not name. NB: could be undefined
  const locationSharedValue = useSharedValue((defaultLocationUuid as TUuid) ?? "");

  const selectHandler = useCallback(() => {
    router.push({
      pathname: "edit-group",
      params: {
        groupUuid,
        locationUuid: locationSharedValue.value,
      },
    });
  }, [locationSharedValue.value, router]);

  return (
    <View style={[styles.container, style]}>
      <Stack.Screen
        options={
          {
            onNext: selectHandler,
          } as CustomStackOptions
        }
      />
      <LocationSearch
        onLocationSelected={selectHandler}
        locationSharedValue={locationSharedValue}
        avoidKeyboard={false}
      />
    </View>
  );
};

export default SetLocation;

const useStyles = () => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors?.background,
          paddingBottom: theme.spacing.screenBottomSpacing,
        },
      }),
    [theme]
  );
  return styles;
};
