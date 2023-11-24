import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { DEFAULT_IMAGE_COMPRESSION } from "../constants";
import { listenForChannelMessages } from "../firebaseConfig";
import { IChannel, ICreateMessageData, IMessage, TUuid } from "../interfaces";
import {
  appendMessage,
  initChannel,
  prependMessages,
  setMessageDeleted,
  updateMessage,
  updateMessageStatus,
} from "../redux/features/channels/channelsSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  useCreateMessageForChannelMutation,
  useLazyGetChannelQuery,
  useLazyGetMessagesForChannelQuery,
} from "../redux/services/channels";
import { useUploadMediaMutation } from "../redux/services/media";
import {
  useDeleteMessageMutation,
  useReactToMessageMutation,
  useUnreactToMessageMutation,
} from "../redux/services/messages";

export type MessageToSend = {
  text?: string;
  mediaUrls?: string[];
};

const MESSAGES_FETCH_LIMIT = 30;
const useChannel = (
  channelUuid: string,
  options = {
    readonly: false,
  }
) => {
  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.users.me);
  const storeChannel = useAppSelector((state) => state.channels.channels[channelUuid]);
  const channel = storeChannel?.channel as IChannel | undefined;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [totalMessagesCount, setTotalMessagesCount] = useState(0);
  const [getChannel] = useLazyGetChannelQuery();
  const [getMessagesForChannel, { isLoading: loadingMore }] = useLazyGetMessagesForChannelQuery();
  const [postMessage] = useCreateMessageForChannelMutation();
  const [uploadMedia] = useUploadMediaMutation();
  const [reactToMessageMutation] = useReactToMessageMutation();
  const [unreactToMessageMutation] = useUnreactToMessageMutation();
  const [deleteMessageMutation] = useDeleteMessageMutation();
  const canLoadMore = useMemo(() => {
    if (channel?.messages.length === undefined) return false;
    return channel.messages.length < totalMessagesCount;
  }, [channel?.messages.length, totalMessagesCount]);

  //* initialize channel in redux store -----------------------------------------------------------
  useEffect(() => {
    if (options.readonly) return;
    (async () => {
      if (!channel) {
        setIsLoading(true);
        const { data, isError, error } = await getChannel(channelUuid, true);
        if (data) {
          dispatch(initChannel({ channel: data }));
          setTotalMessagesCount(data.num_messages);
        }
        if (isError) {
          setError(error);
        } else {
          setError(undefined);
        }
      }
      setIsLoading(false);
    })();
  }, [dispatch, getChannel, channel, channelUuid, options.readonly]);

  //* listen for new messages from firebase -------------------------------------------------------
  const firebaseHandlers = useRef<{
    addMessage: (message: IMessage) => void;
    updateMessage: (message: IMessage) => void;
  }>({
    addMessage: () => 0,
    updateMessage: () => 0,
  });
  useEffect(() => {
    if (options.readonly) return;
    firebaseHandlers.current = {
      addMessage: (message) => {
        if (!channel?.messages) return;
        // only way addMessage fires on an existing message is when the message is temporary
        const existingMessage = channel.messages.find((m) => m.uuid === message.uuid);
        if (existingMessage) {
          // replace the temporary message that has been added by `sendMessage`
          const existingMessageStatus = message.status;
          if (existingMessageStatus === "sending") {
            dispatch(updateMessage({ channelUuid, message }));
            dispatch(
              updateMessageStatus({ channelUuid, messageUuid: message.uuid, status: "sent" })
            );
          }
        } else {
          const lastMessageTime = new Date(channel.messages[0]?.sent_at ?? 0).getTime();
          const newMessageTime = new Date(message.sent_at).getTime();
          // only add the message if it's newer than the last message in the store
          if (newMessageTime > lastMessageTime) {
            dispatch(appendMessage({ channelUuid, message }));
          }
        }
      },
      updateMessage: (message) => {
        dispatch(updateMessage({ channelUuid, message }));
      },
    };
  }, [channel?.messages, channelUuid, dispatch, options.readonly]);
  useEffect(() => {
    if (options.readonly) return;
    // this wired approach is needed to not add a new listener every time something changes
    listenForChannelMessages(
      [channelUuid],
      (...args) => firebaseHandlers.current.addMessage(...args),
      (...args) => firebaseHandlers.current.updateMessage(...args)
    );
  }, [channelUuid, dispatch, options.readonly]);

  //* send message --------------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (messageToSend: MessageToSend, replySubject?: IMessage) => {
      if (!me) return;
      // 1. create message
      const messageUuid = uuidV4();
      const createMessageData: ICreateMessageData = {
        uuid: messageUuid,
        text: messageToSend.text ?? "",
        channel_uuid: channelUuid,
        reply_subject_uuid: replySubject?.uuid,
      };
      const localTempMessage: IMessage = {
        ...createMessageData,
        uuid: messageUuid,
        sender: me,
        sent_at: new Date().toISOString(),
        editable: true,
        media_urls: messageToSend.mediaUrls ?? [],
        reactions: [],
        num_comments: 0,
        reply_subject: replySubject ?? null,
        num_unread_comments: 0,
        num_unread_comment_mentions: 0,
        is_deleted: false,
      };
      // 2. add message to store (temporarily)
      dispatch(appendMessage({ channelUuid: channelUuid, message: localTempMessage }));
      dispatch(updateMessageStatus({ channelUuid, messageUuid, status: "sending" }));
      try {
        if (messageToSend?.mediaUrls && messageToSend.mediaUrls.length > 0) {
          // 3. prepare media
          const formData = new FormData();
          for (let i = 0; i < messageToSend.mediaUrls.length; i++) {
            const uri = messageToSend.mediaUrls[i];
            const manipulateResult = await manipulateAsync(uri, undefined, {
              compress: DEFAULT_IMAGE_COMPRESSION,
              format: SaveFormat.JPEG,
            });
            if (!manipulateResult.uri) {
              continue;
            }
            const data = {
              uri: manipulateResult.uri,
              name: `image-${i}.jpeg`,
              type: "image/jpeg",
            } as unknown as Blob; // FormData overridden in React Native
            formData.append("image", data);
          }
          // 4. upload media
          const uploadMediaResponse = await uploadMedia({
            formData,
            message_uuid: messageUuid,
            isTempMessage: true,
          }).unwrap();
          createMessageData.media_uuids = uploadMediaResponse.map((media) => media.uuid);
        }
        // 5. post message to server
        await postMessage(createMessageData).unwrap();
      } catch (error) {
        dispatch(updateMessageStatus({ channelUuid, messageUuid, status: "failed" }));
        console.error("failed to send message", error);
      }
    },
    [me, channelUuid, dispatch, postMessage, uploadMedia]
  );

  //* modify message ------------------------------------------------------------------------------
  const modifyMessage = useCallback(async (message: MessageToSend) => {
    // TODO: implement modifyMessage
    message;
  }, []);

  //* react to message ----------------------------------------------------------------------------
  const reactToMessage = useCallback(
    async (messageUuid: TUuid, emoji: string) => {
      let action: "react" | "unreact" = "react";
      if (!me) return;
      // 1. save snapshot of local message in case something fails
      const localMessageSnapshot = channel?.messages.find((m) => m.uuid === messageUuid);
      if (!localMessageSnapshot) return;
      // 2. create a temporary message with the reaction
      const localTempMessage = cloneDeep(localMessageSnapshot);
      const reactions = localTempMessage.reactions;
      const reactionIndex = reactions.findIndex((r) => r.text === emoji);
      if (reactionIndex === -1) {
        reactions.push({ text: emoji, count: 1, reactors: [me.uuid] });
      } else {
        const userIndex = reactions[reactionIndex].reactors.findIndex((uuid) => uuid === me.uuid);
        if (userIndex === -1) {
          reactions[reactionIndex].reactors.push(me.uuid);
          reactions[reactionIndex].count++;
          action = "react";
        } else {
          if (reactions[reactionIndex].count === 1) {
            reactions.splice(reactionIndex, 1);
          } else {
            reactions[reactionIndex].reactors.splice(userIndex, 1);
            reactions[reactionIndex].count--;
          }
          action = "unreact";
        }
      }
      // 3. update message in store (temporarily)
      dispatch(updateMessage({ channelUuid, message: localTempMessage }));
      // 4. send reaction to server
      try {
        if (action === "react") {
          await reactToMessageMutation({ message_uuid: messageUuid, emoji }).unwrap();
        } else if (action === "unreact") {
          await unreactToMessageMutation({ message_uuid: messageUuid, emoji }).unwrap();
        }
      } catch (error) {
        // if something fails, undo the local changes
        dispatch(updateMessage({ channelUuid, message: localMessageSnapshot }));
        throw error;
      }
    },
    [channel?.messages, channelUuid, dispatch, me, reactToMessageMutation, unreactToMessageMutation]
  );

  //* delete message ------------------------------------------------------------------------------
  const deleteMessage = useCallback(
    async (messageUuid: TUuid) => {
      // 1. delete message from store
      dispatch(setMessageDeleted({ channelUuid, messageUuid }));
      // 2. delete message from server
      await deleteMessageMutation(messageUuid);
    },
    [channelUuid, deleteMessageMutation, dispatch]
  );

  //* load more messages --------------------------------------------------------------------------
  const loadMoreMessages = useCallback(async () => {
    try {
      if (loadingMore) return;
      const { results, count } = await getMessagesForChannel({
        channel_uuid: channelUuid,
        offset: channel?.messages.length,
        limit: MESSAGES_FETCH_LIMIT,
      }).unwrap();
      dispatch(prependMessages({ channelUuid, messages: results }));
      setTotalMessagesCount(count);
    } catch (e) {
      console.error("failed to load more messages", e);
      //TODO: handle load more messages error
    }
  }, [channel?.messages.length, channelUuid, dispatch, getMessagesForChannel, loadingMore]);

  //* returns -------------------------------------------------------------------------------------
  return {
    channel,
    isLoading,
    error,
    sendMessage,
    reactToMessage,
    deleteMessage,
    modifyMessage,
    loadMoreMessages,
    canLoadMore,
  };
};
export default useChannel;
