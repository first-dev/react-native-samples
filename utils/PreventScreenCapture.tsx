import { usePreventScreenCapture } from 'expo-screen-capture'
import { FC } from 'react'

const PreventScreenCapture: FC = () => {
  usePreventScreenCapture()
  return null
}
export default PreventScreenCapture
