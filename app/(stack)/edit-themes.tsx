import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FC, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemesPicker from "../../components/CreateGroupSheet/ThemesPicker";
import { CustomStackOptions } from "./_layout";
import { TUuid } from "../../interfaces";

type Params = {
  themesIds: string;
  groupUuid: TUuid;
};

const EditThemes: FC = () => {
  const styles = useStyles();
  const params = useLocalSearchParams<Params>();
  const router = useRouter();
  const [themesIds, setThemesIds] = useState(params.themesIds?.split(",") ?? []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={
          {
            title: `${themesIds.length} Themes`,
            onNext: () => {
              router.push({
                pathname: "edit-group",
                params: {
                  themesIds: encodeURIComponent(themesIds.join(",")), // need to URI encode to handle special chars in theme names, e.g. "LGTBQ+"
                  groupUuid: params.groupUuid,
                },
              });
            },
          } as CustomStackOptions
        }
      />
      <ThemesPicker
        style={styles.themePicker}
        selectedThemesIds={themesIds}
        setSelectedThemesIds={setThemesIds}
      />
    </SafeAreaView>
  );
};

export default EditThemes;

const useStyles = () => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors?.background,
        },
        themePicker: {
          marginHorizontal: theme.spacing.screenHorizontalSpacing,
        },
      }),
    [theme]
  );
  return styles;
};
