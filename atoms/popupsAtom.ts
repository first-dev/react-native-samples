import { persistAtom } from '@utils/storage'
import { atom } from 'recoil'

export type PopupsState = {
  lastResetTime: number
  popupsViewRecord: Record<string, number>
}
const defaultValue: PopupsState = {
  lastResetTime: 0,
  popupsViewRecord: {},
}

export const POPUPS_ATOM_KEY = '@atoms/popups'
export const popupsAtom = atom<PopupsState>({
  key: POPUPS_ATOM_KEY,
  default: defaultValue,
  effects: [
    persistAtom(POPUPS_ATOM_KEY, {
      defaultValue,
    }),
  ],
})
