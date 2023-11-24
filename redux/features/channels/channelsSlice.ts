import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeFirebaseChannelListeners } from "../../../firebaseConfig";
import { IChannel, IMessage, IUser, TMessageStatus, TUuid } from "../../../interfaces";
import { ROOT_ACTION_TYPES } from "../../root/actions";

export type TChannelsByUuid = Record<TUuid, IChannel>;
export type TChannelType = "local" | "private" | "recommended" | "joined";
export interface IChannelsState {
  // groupDetails: Record<TUuid, IGroup>;
  // recommendedGroups: Record<TUuid, boolean>;
  channelDetails: Record<TUuid, IChannel>;
  membersForChannels: Record<TUuid, Record<TUuid, boolean>>; // Channel UUID -> Set of User UUIDs
  localChatChannels: Record<TUuid, boolean>;
  privateChatChannels: Record<TUuid, boolean>;
  recommendedGroupChannels: Record<TUuid, boolean>;
  joinedGroupChannels: Record<TUuid, boolean>;
  firebaseListeningChannels: Record<TUuid, boolean>;
  channels: Record<
    TUuid,
    {
      channel: IChannel;
    }
  >;
}

const initialState: IChannelsState = {
  channelDetails: {},
  membersForChannels: {},
  localChatChannels: {},
  privateChatChannels: {},
  recommendedGroupChannels: {},
  joinedGroupChannels: {},
  firebaseListeningChannels: {},
  channels: {},
};

const findChannelsObjForType = (state: IChannelsState, type: TChannelType) => {
  switch (type) {
    case "local":
      return state.localChatChannels;
    case "private":
      return state.privateChatChannels;
    case "recommended":
      return state.recommendedGroupChannels;
    case "joined":
      return state.joinedGroupChannels;
    default:
      throw new Error("Invalid channel type");
  }
};

export const ChannelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addChannels: (
      state,
      action: PayloadAction<{
        type: TChannelType;
        channels: IChannel[];
      }>
    ) => {
      const channelsObj = findChannelsObjForType(state, action.payload.type);
      for (let i = 0; i < action.payload.channels.length; i++) {
        const channel = action.payload.channels[i];
        channelsObj[channel.uuid] = true;
        state.channelDetails[channel.uuid] = channel;
        state.membersForChannels[channel.uuid] = channel.members.reduce(
          (acc, member) => {
            acc[member.uuid] = true;
            return acc;
          },
          {} as Record<TUuid, boolean>
        );
      }
    },
    clearLocalChatChannels: (state) => {
      const localChannelUuids = Object.keys(state.localChatChannels);
      for (let i = 0; i < localChannelUuids.length; i++) {
        const channelUuid = localChannelUuids[i];
        delete state.channelDetails[channelUuid];
        delete state.membersForChannels[channelUuid];
        delete state.firebaseListeningChannels[channelUuid];
      }
      state.localChatChannels = {};
      removeFirebaseChannelListeners(localChannelUuids);
    },
    addChannelDetails: (state, action: PayloadAction<IChannel>) => {
      // TODO: REMOVE MEMBERS & MESSAGES FIRST?
      // console.log("adding channel details for ", action.payload.uuid);
      state.channelDetails[action.payload.uuid] = action.payload;
    },
    addJoinedGroupChannels: (state, action: PayloadAction<TUuid[]>) => {
      const channelUuids = action.payload;
      for (let i = 0; i < channelUuids.length; i++) {
        const channelUuid = channelUuids[i];
        state.joinedGroupChannels[channelUuid] = true;
      }
    },
    removeJoinedGroupChannels: (state, action: PayloadAction<TUuid[]>) => {
      const channelUuids = action.payload;
      for (let i = 0; i < channelUuids.length; i++) {
        const channelUuid = channelUuids[i];
        delete state.joinedGroupChannels[channelUuid];
      }
    },
    addPrivateChatChannels: (state, action: PayloadAction<TUuid[]>) => {
      // console.log("adding private chat channels: ", action.payload);
      const channelUuids = action.payload;
      for (let i = 0; i < channelUuids.length; i++) {
        const channelUuid = channelUuids[i];
        state.privateChatChannels[channelUuid] = true;
      }
    },
    addFirebaseListeningChannels: (state, action: PayloadAction<TUuid[]>) => {
      const channelUuids = action.payload;
      for (let i = 0; i < channelUuids.length; i++) {
        const channelUuid = channelUuids[i];
        state.firebaseListeningChannels[channelUuid] = true;
      }
    },
    removeFirebaseListeningChannels: (state, action: PayloadAction<TUuid[]>) => {
      const channelUuids = action.payload;
      for (let i = 0; i < channelUuids.length; i++) {
        const channelUuid = channelUuids[i];
        delete state.firebaseListeningChannels[channelUuid];
      }
    },
    addMembersForChannels: (
      state,
      action: PayloadAction<{ channelUuid: TUuid; members: IUser[] }[]>
    ) => {
      for (let i = 0; i < action.payload.length; i++) {
        const { channelUuid, members } = action.payload[i];
        for (let j = 0; j < members.length; j++) {
          const member = members[j];
          if (!state.membersForChannels[channelUuid]) {
            state.membersForChannels[channelUuid] = {};
          }
          state.membersForChannels[channelUuid][member.uuid] = true;
        }
      }
    },
    removeMembersForChannel: (
      state,
      action: PayloadAction<{ channelUuid: TUuid; members: TUuid[] }>
    ) => {
      const { channelUuid, members } = action.payload;
      for (let i = 0; i < members.length; i++) {
        const memberUuid = members[i];
        delete state.membersForChannels[channelUuid][memberUuid];
      }
    },
    pushMessagesOntoChannel: (
      state,
      action: PayloadAction<{ messages: IMessage[]; source: string }>
    ) => {
      let { messages } = action.payload;
      // console.log({ source });

      const channel = state.channelDetails[messages[0]?.channel_uuid];
      if (channel) {
        // ensure no duplication
        // a bit of a hack - really messages should be indexed by UUID so we don't have to do this every time but it shouldn't be a big deal in the meantime
        const existingMessageUuids = channel.messages.reduce(
          (acc, m) => {
            acc[m.uuid] = true;
            return acc;
          },
          {} as Record<TUuid, boolean>
        );
        messages = messages.filter((m) => !existingMessageUuids[m.uuid]);
        channel.messages.push(...messages);
        channel.messages.sort(
          (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
        );
      }
    },
    replaceChannelMessage: (state, action: PayloadAction<IMessage>) => {
      const message = action.payload;
      const channel = state.channelDetails[message.channel_uuid];
      if (channel) {
        const messageIndex = channel.messages.findIndex((m) => m.uuid === message.uuid);
        if (messageIndex !== -1) {
          channel.messages[messageIndex] = message;
        }
      }
    },
    markChannelMessagesAsRead: (state, action: PayloadAction<TUuid>) => {
      state.channelDetails[action.payload].num_unread_messages = 0;
      state.channelDetails[action.payload].num_unread_mentions = 0;
    },
    setLocalChat: (state, action: PayloadAction<IChannel>) => {
      state.localChatChannels = { [action.payload.uuid]: true };
      state.channelDetails[action.payload.uuid] = action.payload;
    },
    // new chat rework --------------------------------------------------------
    initChannel: (
      state,
      action: PayloadAction<{
        channel: IChannel;
      }>
    ) => {
      const { channel } = action.payload;
      if (channel) {
        state.channels[channel.uuid] = { channel };
      }
    },
    appendMessage: (
      state,
      action: PayloadAction<{
        channelUuid: string;
        message: IMessage;
      }>
    ) => {
      const { channelUuid, message } = action.payload;
      if (state.channels[channelUuid]) {
        state.channels[channelUuid].channel.messages.unshift(message);
      }
    },
    prependMessages: (
      state,
      action: PayloadAction<{
        channelUuid: string;
        messages: IMessage[];
      }>
    ) => {
      const { channelUuid, messages } = action.payload;
      if (state.channels[channelUuid]) {
        state.channels[channelUuid].channel.messages.push(...messages);
      }
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        channelUuid: TUuid;
        message: IMessage;
      }>
    ) => {
      const { channelUuid, message } = action.payload;
      if (state.channels[channelUuid]) {
        const oldMessageIndex = state.channels[channelUuid].channel.messages.findIndex(
          (m) => m.uuid === message.uuid
        );
        const oldMessageMediaUrls =
          state.channels[channelUuid].channel.messages[oldMessageIndex].media_urls;
        if (oldMessageIndex !== -1) {
          if (oldMessageMediaUrls && oldMessageMediaUrls.length > 0) {
            message.media_urls = oldMessageMediaUrls;
          }
          state.channels[channelUuid].channel.messages[oldMessageIndex] = message;
        }
      }
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{
        channelUuid: TUuid;
        messageUuid: TUuid;
        status: TMessageStatus;
      }>
    ) => {
      const { channelUuid, messageUuid, status } = action.payload;
      const messageIndex = state.channels[channelUuid].channel.messages.findIndex(
        (m) => m.uuid === messageUuid
      );
      if (messageIndex !== -1) {
        state.channels[channelUuid].channel.messages[messageIndex].status = status;
      }
    },
    setMessageDeleted: (
      state,
      action: PayloadAction<{
        channelUuid: TUuid;
        messageUuid: TUuid;
      }>
    ) => {
      const { channelUuid, messageUuid } = action.payload;
      if (!state.channels[channelUuid]) return;
      const oldMessageIndex = state.channels[channelUuid].channel.messages.findIndex(
        (m) => m.uuid === messageUuid
      );
      state.channels[channelUuid].channel.messages[oldMessageIndex].is_deleted = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(ROOT_ACTION_TYPES.RESET_STORE, () => {
      return initialState; // Reset the state to its initial value
    });
  },
});

export const {
  addChannels,
  addChannelDetails,
  clearLocalChatChannels,
  addJoinedGroupChannels,
  removeJoinedGroupChannels,
  addPrivateChatChannels,
  addFirebaseListeningChannels,
  removeFirebaseListeningChannels,
  addMembersForChannels,
  removeMembersForChannel,
  pushMessagesOntoChannel,
  replaceChannelMessage,
  markChannelMessagesAsRead,
  setLocalChat,
  initChannel,
  appendMessage,
  prependMessages,
  updateMessage,
  updateMessageStatus,
  setMessageDeleted,
} = ChannelsSlice.actions;
export default ChannelsSlice.reducer;
