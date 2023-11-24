import { configureStore, Middleware } from "@reduxjs/toolkit";
import { rtkQueryErrorLogger } from "./error";
import channelsReducer from "./features/channels/channelsSlice";
import groupsReducer from "./features/groups/groupsSlice";
import locationsReducer from "./features/locations/locationsSlice";
import mediaReducer from "./features/media/mediaSlice";
import notificationsReducer from "./features/notifcations/notificationsSlice";
import themesReducer from "./features/themes/themesSlice";
import usersReducer from "./features/users/usersSlice";
import { api } from './services/api'
import { channelsApi } from "./services/channels";
import { groupsApi } from "./services/groups";
import { locationsApi } from "./services/locations";
import { meApi } from "./services/me";
import { mediaApi } from "./services/media";
import { messagesApi } from "./services/messages";
import { notificationsApi } from "./services/notifications";
import { themesApi } from "./services/themes";
import { usersApi } from "./services/users";
import { timeLogMiddleware } from "./utils";

const extraMiddleware: Middleware[] = [
  timeLogMiddleware,
  api.middleware,
  channelsApi.middleware,
  groupsApi.middleware,
  locationsApi.middleware,
  meApi.middleware,
  mediaApi.middleware,
  messagesApi.middleware,
  notificationsApi.middleware,
  themesApi.middleware,
  usersApi.middleware,
  rtkQueryErrorLogger,
];

export const store = configureStore({
  reducer: {
    channels: channelsReducer,
    groups: groupsReducer,
    locations: locationsReducer,
    notifications: notificationsReducer,
    themes: themesReducer,
    users: usersReducer,
    media: mediaReducer,
    [api.reducerPath]: api.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [meApi.reducerPath]: meApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [themesApi.reducerPath]: themesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(extraMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
