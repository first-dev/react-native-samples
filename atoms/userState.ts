import { persistAtom } from '@utils/storage'
import { atom } from 'recoil'

export type User = {
  avatar: string
  avatarsList: { [id: string]: string }
}
const defaultValue: User = {
  avatar: 'avatar0',
  avatarsList: {}
}

export const userAtom = atom<User>({
  key: 'userState',
  default: defaultValue,
  effects: [
    persistAtom('userState', {
      defaultValue,
    }),
  ],
})
