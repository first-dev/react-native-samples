declare module 'react-native-mathjax' {
  import { WebView } from 'react-native-webview'
  const MathJax = React.Component<
    | React.ComponentPropsWithoutRef<typeof WebView>
    | {
        html: string
        mathJaxOptions: Record<string, unknown>
      }
  >
  export = MathJax
}
