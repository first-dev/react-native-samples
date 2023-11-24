import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { IShallowNotificationData } from "../interfaces";

/**
 *
 * @param appInitialized set to true when the app is fully initialized and ready to handle notifications
 */

const useNotifications = (appInitialized: boolean) => {
  const router = useRouter();
  const [notificationDataToHandle, setNotificationDataToHandle] =
    useState<IShallowNotificationData>();

  const handleNotification = useCallback(
    (notificationData: IShallowNotificationData) => {
      const { notification_type } = notificationData;
      console.log(`handling notification:`, notification_type);
      console.log(notificationData);
      switch (notification_type) {
        case "new_message_local":
          console.log(`push-notifications/${notification_type}: redirect to explore/chat`);
          router.push({ pathname: "/(tabs)/explore", params: { tab: "Chat" } });
          break;
        case "new_message_group":
          console.log(
            `push-notifications/${notification_type}: redirect to group chat ${notificationData.group_uuid}`
          );
          router.push(`(tabs)/explore/groups/${notificationData.group_uuid}/chat`);
          break;
        case "new_message_dm":
          console.log(
            `push-notifications/${notification_type}: redirect to DM with user ${notificationData.user_uuid}`
          );
          router.push({
            pathname: `/(tabs)/inbox/DMs`,
            params: {
              channelUuid: notificationData.channel_uuid,
              otherUserUuid: notificationData.sender_uuid,
            },
          });
          break;
        case "new_group":
          console.log(
            `push-notifications/${notification_type}: redirect to group ${notificationData.group_uuid}`
          );
          router.push(`/(link)/group/${notificationData.group_uuid}`);
          break;
        case "new_user":
          console.log(
            `push-notifications/${notification_type}: redirect to profile ${notificationData.user_uuid}`
          );
          router.push(`/(link)/profile/${notificationData.user_uuid}`);
          break;
        case "friend_request_received":
          console.log(
            `push-notifications/${notification_type}: redirect to profile ${notificationData.sender_uuid}`
          );
          router.push(`/(link)/profile/${notificationData.sender_uuid}`);
          break;
        case "friend_request_accepted":
          console.log(
            `push-notifications/${notification_type}: redirect to profile ${notificationData.sender_uuid}`
          );
          router.push(`/(link)/profile/${notificationData.sender_uuid}`);
          break;
      }
      setNotificationDataToHandle(undefined);
    },
    [router]
  );

  useEffect(() => {
    const responseReceivedListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as IShallowNotificationData;
        setNotificationDataToHandle(data);
      }
    );
    return () => Notifications.removeNotificationSubscription(responseReceivedListener);
  }, [appInitialized, handleNotification]);
  useEffect(() => {
    if (!appInitialized) return;
    if (notificationDataToHandle) {
      handleNotification(notificationDataToHandle);
    }
  }, [notificationDataToHandle, handleNotification, appInitialized]);

  useEffect(() => {
    // Notifications.getExpoPushTokenAsync({
    //   projectId: Constants.expoConfig?.extra?.eas.projectId,
    // }).then((token) => {
    //   console.log(`expo push token:`, token.data);
    // });
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }, []);
};

export default useNotifications;
