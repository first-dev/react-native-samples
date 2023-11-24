import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import * as Sentry from "sentry-expo";
import ApiDebugToastExpand from "../components/ApiDebugToastExpand";
import { showToast } from "../utils/toast";

type IgnoreError = {
  endpointName?: string;
  status?: string;
};

const ignoreErrors: IgnoreError[] = [
  {
    status: "403",
  },
  {
    endpointName: "checkUsername",
    status: "400",
  },
  {
    status: "426",
  },
];

export class RTKQueryError extends Error {
  constructor(message?: string, endpointName?: string, status?: string) {
    super(message);
    this.name = `RTKQ: ${endpointName} | ${status}`;
    this.cause = message;
  }
}

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const type: string | undefined = action?.type;
    const status: string | undefined = action?.payload?.status?.toString();
    const message: string | undefined = action?.payload?.data?.message;
    const endpointName: string | undefined = action?.meta?.arg?.endpointName;
    const fullAction = JSON.stringify(action);

    // ignore errors
    if (
      ignoreErrors.some(
        (ignoreError) =>
          (ignoreError.endpointName === endpointName || !ignoreError.endpointName) &&
          (ignoreError.status === status || !ignoreError.status)
      )
    ) {
      return next(action);
    }

    Sentry.Native.withScope((scope) => {
      scope.setExtra("type", type);
      scope.setExtra("status", status);
      scope.setExtra("endpointName", endpointName);
      scope.setExtra("fullAction", fullAction);
      Sentry.Native.captureException(new RTKQueryError(message, endpointName, status));
    });
    const expandable = ["development", "preview", "staging"].includes(
      process.env.EXPO_PUBLIC_EAS_PROFILE ?? ""
    );
    const toastHandler = showToast(
      {
        variant: "error",
        message: "Oops! Something went wrong...",
        expandable,
        ExpandableComponent: (
          <ApiDebugToastExpand
            type={type}
            endpoint={endpointName}
            status={status}
            message={message}
            fullAction={JSON.stringify(action)}
            onDismiss={() => toastHandler.destroy()}
          />
        ),
      },
      {
        autoDismiss: !expandable,
      }
    );
  }

  return next(action);
};
