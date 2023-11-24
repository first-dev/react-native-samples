/* eslint-disable no-var */
import type { TFunction } from 'i18next'
import type { AxiosInstance } from 'axios'
import type Pubnub from 'pubnub'
import { FC } from 'react'

declare global {
  /**
   * @deprecated
   */
  var t: TFunction<'translation', undefined>
  var api: AxiosInstance
  var pubnub: Pubnub | undefined
  var wait: (ms: number) => Promise<unknown>
}
declare module 'rn-flipper-async-storage-advanced'
declare module 'react-native-mathjax';