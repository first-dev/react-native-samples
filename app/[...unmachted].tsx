import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import GradientRingsText from "../components/GradientRingsText";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View />
      <GradientRingsText
        title="Not found"
        subtitle="Unfortunately, we didn't find what you're looking for. Try again later."
      />
      <Button title="Back" onPress={() => router.replace("/(tabs)/explore")} />
      {/* <Button title="Back" onPress={() => router.back()} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
});
