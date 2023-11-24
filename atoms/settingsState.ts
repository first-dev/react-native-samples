import i18n from '@i18n'
import { persistAtom } from '@utils/storage'
import { atom } from 'recoil'

export type Settings = {
  general: {
    theme: 'System preference' | 'Light' | 'Dark'
    language: string
  }
}
const defaultValue: Settings = {
  general: {
    theme: 'System preference',
    language: 'fr',
  },
}

export const settingsAtom = atom<Settings>({
  key: 'settingsState',
  default: defaultValue,
  effects: [
    persistAtom('settingsState', {
      defaultValue,
    }),
    ({ onSet }) => {
      onSet(newValue => {
        i18n.changeLanguage(newValue.general.language)
      })
    },
  ],
})
