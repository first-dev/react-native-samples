import { useRouter } from "expo-router"
import { useCallback } from "react"
import { Linking } from "react-native"

export const useDeepLinking = () => {
  const router = useRouter();
  /**
   * Handle deep-linking
   * @returns {boolean} true if the url is handled
   */
  const handleDeepLink = useCallback(async () => {
    const url = await Linking.getInitialURL();
    if (!url) return false;
    const [, , , ...segments] = url?.split("/") ?? [];
    if (!url) return false;
    let uuid: string;
    switch (segments[0]) {
      case "profile":
        uuid = segments[1];
        console.log(`deep-linking: redirect to profile ${uuid}`);
        router.replace(`/(tabs)/inbox`);
        router.push(`/(link)/profile/${uuid}`);
        break;
      case "group":
        uuid = segments[1];
        console.log(`deep-linking: redirect to group ${uuid}`);
        router.replace(`/(tabs)/groups`);
        router.push(`/(link)/group/${uuid}`);
        break;
      case "store.html":
        console.log(`deep-linking: redirect to explore`);
        router.replace(`/(tabs)/explore`);
        break;
      default:
        console.warn(`deep-linking: unmatched url ${url}`);
        router.replace(`/(tabs)/explore`);
        router.push(`/[...unmatched]`);
    }
    return true;
  }, [router]);

  return {
    handleDeepLink,
  };
};
