import AsyncStorage from '@react-native-async-storage/async-storage'
import { cloneDeep, merge } from 'lodash'
import { AtomEffect } from 'recoil'
export const persistAtom =
  <T>(
    key: string,
    options?: {
      defaultValue?: T
      parse?: typeof JSON.parse
      stringify?: typeof JSON.stringify
    },
  ): AtomEffect<T> =>
  ({ onSet, setSelf, trigger }) => {
    const parse = options?.parse ?? JSON.parse
    const stringify = options?.stringify ?? JSON.stringify
    const defaultValue = cloneDeep(options?.defaultValue)
    if (trigger === 'get') {
      ;(async () => {
        try {
          const savedValue = await AsyncStorage.getItem(key)
          if (savedValue) {
            const valueToSet = defaultValue
              ? merge(defaultValue, parse(savedValue))
              : parse(savedValue)
            setSelf(valueToSet)
          }
        } catch (error) {
          console.error(`failed to recover ${key} from AsyncStorage`)
          console.error(error)
        }
        setSelf(state => merge(cloneDeep(state), { isRetrieved: true }))
      })()
    }
    onSet((newValue, _, isReset) => {
      if (isReset) {
        AsyncStorage.removeItem(key)
      } else {
        AsyncStorage.setItem(key, stringify(newValue))
      }
    })
  }
