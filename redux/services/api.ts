import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  DummyInitialContentResponse,
  GetInitialContentResponse,
} from "../../.local/endpointsRemake";
import { API_URL } from "../../constants";
import { prepareHeaders, timeOutRetry } from "../utils";
import { channelsApi } from "./channels";
import { meApi } from "./me";

export const api = createApi({
  reducerPath: "api",
  baseQuery: timeOutRetry(
    fetchBaseQuery({
      baseUrl: API_URL + "/",
      prepareHeaders,
    })
  ),
  endpoints: (builder) => ({
    getInitialContent: builder.query<GetInitialContentResponse, void>({
      // query: () => "me/initial",
      queryFn: async () => {
        return {
          data: DummyInitialContentResponse,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: initialContent } = await queryFulfilled;
          dispatch(
            meApi.util.upsertQueryData("authenticateMe", undefined, initialContent.currentUser)
          );
          dispatch(
            channelsApi.util.upsertQueryData(
              "getChannel",
              initialContent.localChannel.uuid,
              initialContent.localChannel
            )
          );
          console.log(`cache initiated`);
        } catch (e) {
          console.log(`Manual cache update failed: ${e}`);
        }
      },
    }),
  }),
});

export const { useLazyGetInitialContentQuery } = api;
