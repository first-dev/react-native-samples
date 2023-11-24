import RootSiblings from "react-native-root-siblings";
import Toast, { ToastProps } from "../components/Toast";

export const showToast = (
  props: ToastProps,
  options?: {
    autoDismiss?: boolean;
    duration?: number;
  }
) => {
  const autoDismiss = options?.autoDismiss ?? true;
  const duration = options?.duration ?? 3000;
  const sibling = new RootSiblings(<Toast {...props} />);
  if (autoDismiss) {
    setTimeout(() => {
      sibling.destroy();
    }, duration);
  }
  return {
    destroy: () => sibling.destroy(),
  };
};
