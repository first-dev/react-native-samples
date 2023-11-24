import { persistAtom } from '@utils/storage'
import { atom } from 'recoil'

export type Auth = {
  loggedIn: boolean | null
  userId: string | null
  token: {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
    refresh_token: string
  } | null
  isRetrieved: boolean
}
const defaultValue: Auth = {
  loggedIn: null,
  userId: null,
  token: null,
  isRetrieved: false
}

export const AUTH_ATOM_KEY = 'authState'
export const authAtom = atom<Auth>({
  key: AUTH_ATOM_KEY,
  default: defaultValue,
  effects: [
    persistAtom(AUTH_ATOM_KEY, {
      defaultValue,
    }),
  ],
})
