/* eslint-disable react-native/no-unused-styles */
import { format } from "date-fns";
import { Stack, useLocalSearchParams } from "expo-router";
import { FC, Fragment, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useTheme } from "react-native-paper";
import useChannel from "../../hooks/useChannel";
import useImageDownloader from "../../hooks/useImageDownloader";
import { showToast } from "../../utils/toast";
import { CustomStackOptions } from "./_layout";

type Params = {
  channelUuid: string;
  messageUuid: string;
  activeIndex: string;
};

const ChatPhoto: FC = () => {
  const styles = useStyles();
  const params = useLocalSearchParams<Params>();
  const theme = useTheme();
  const initialPage = params.activeIndex ? parseInt(params.activeIndex) : 0;
  const pagerRef = useRef<PagerView>(null);
  const [activePage, setActivePage] = useState(initialPage);
  const { channel } = useChannel(params.channelUuid ?? "", { readonly: true });
  const message = channel?.messages.find((m) => m.uuid === params.messageUuid);
  const mediaUrls = useMemo(() => message?.media_urls ?? [], [message?.media_urls]);
  const senderName = message?.sender.name ?? "";
  const sendingDate = useMemo(() => new Date(message?.sent_at ?? ""), [message?.sent_at]);
  const formattedSendingDate = format(sendingDate, "MM/dd/yyyy, h:mm a");
  const { isDownloading, downloadImage, hasDownloadedImage } = useImageDownloader();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={
          {
            title: `${activePage + 1} of ${mediaUrls.length}`,
            onNext: () => {
              if (!hasDownloadedImage) downloadImage(mediaUrls[activePage]);
              else
                showToast({
                  message: "Image already saved",
                  variant: "warning",
                });
            },
            headerNextLoading: isDownloading,
            headerNextIcon: !hasDownloadedImage ? "download" : "check",
          } as CustomStackOptions
        }
      />
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={initialPage}
        onPageScroll={(e) => setActivePage(e.nativeEvent.position)}
      >
        {mediaUrls.map((url, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [loaded, setLoaded] = useState(false);
          return (
            <Fragment key={index}>
              {!loaded && (
                <ActivityIndicator
                  style={styles.indicator}
                  size={48}
                  color={theme.colors?.secondary}
                />
              )}
              <Image source={{ uri: url }} style={styles.image} onLoad={() => setLoaded(true)} />
            </Fragment>
          );
        })}
      </PagerView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {senderName} (@{message?.sender.username})
        </Text>
        <Text style={styles.footerText}>{formattedSendingDate}</Text>
      </View>
    </View>
  );
};
export default ChatPhoto;
const useStyles = () => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors?.background,
        },
        pagerView: {
          flex: 1,
        },
        image: {
          width: "100%",
          height: "100%",
          resizeMode: "contain",
        },
        footer: {
          height: 60,
          paddingTop: 12,
          marginBottom: 6,
          alignItems: "center",
        },
        footerText: {
          fontSize: 12,
          fontWeight: "400",
          color: "rgba(11, 11, 14, 0.48)",
          opacity: 48,
        },
        indicator: {
          height: "100%",
        },
      }),
    [theme]
  );
  return styles;
};
