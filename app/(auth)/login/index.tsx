/* eslint-disable react-native/no-raw-text */
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Image, ImageSourcePropType, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import Button from "../../../components/Button";
import Space from "../../../components/Space";
import { Text, View } from "../../../components/Themed";
import Analytics from '../../../utils/analytics'

const paginationBullet = () => {
  return (
    <View
      style={{
        backgroundColor: "#D9D9D9",
        height: 4,
        width: 50,
        borderRadius: 2,
      }}
    />
  );
};

const activePaginationBullet = () => {
  return (
    <View
      style={{
        backgroundColor: "#000",
        height: 4,
        width: 50,
        borderRadius: 2,
      }}
    />
  );
};

function OverviewSlide(
  idx: number,
  firstLine: string,
  secondLine: string,
  image: ImageSourcePropType
) {
  return (
    <View style={styles.slide} key={idx}>
      <View style={styles.container}>
        {/* TODO: Replace placeholder with images */}
        <Image source={image} style={styles.image} />
        <Text style={styles.text}>{firstLine}</Text>
        <Text style={styles.text}>{secondLine}</Text>
      </View>
    </View>
  );
}

const slides = [
  {
    first: "Meet local",
    second: "friends like you",
    image: require("../../../assets/images/overview-image-1.png"),
  },
  {
    first: "Find local groups",
    second: "you really need",
    image: require("../../../assets/images/overview-image-2.png"),
  },
  {
    first: "Keep group",
    second: "chats organized",
    image: require("../../../assets/images/overview-image-3.png"),
  },
  {
    first: "Stay safe in",
    second: "local community",
    image: require("../../../assets/images/overview-image-4.png"),
  },
  // {
  //   first: "Customize",
  //   second: "personal AI bots",
  //   image: require("../../assets/images/overview-image-5.png"),
  // },
];

const Login = () => {
  const router = useRouter();

  const handleLogin = async () => {
    router.push("/(auth)/login/phone-verification");
    Analytics.track("auth_start_login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Swiper
        style={styles.wrapper}
        paginationStyle={{ gap: 4, position: "absolute", top: 0, bottom: undefined }}
        autoplay
        autoplayTimeout={3}
        dot={paginationBullet()}
        activeDot={activePaginationBullet()}
      >
        {slides.map((slide, idx) => OverviewSlide(idx, slide.first, slide.second, slide.image))}
      </Swiper>
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={handleLogin} />
      </View>
      <Space height={24} />
      <Text style={styles.termsText}>
        By selecting Sign In, I agree to Radar’s {"\n"}{" "}
        <Text
          style={styles.highlightedText}
          onPress={() => WebBrowser.openBrowserAsync("https://www.radarchat.io/terms")}
        >
          Terms of Use
        </Text>
        {" and "}
        <Text
          style={styles.highlightedText}
          onPress={() => WebBrowser.openBrowserAsync("https://www.radarchat.io/privacy")}
        >
          Privacy policy
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  wrapper: {},
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flex: 1,
  },
  text: {
    color: "#000",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  buttonContainer: {
    paddingHorizontal: 32,
  },
  termsText: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    color: "#0B0B0E7A",
  },
  highlightedText: {
    color: "#0B0B0E",
    textDecorationLine: "underline",
  },
});

export default Login;
