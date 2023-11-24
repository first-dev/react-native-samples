import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ar } from './ar'
import { fr } from './fr'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    fr: {
      translation: fr,
    },
    ar: {
      translation: ar,
    },
  },
  fallbackLng: ['fr', 'ar'],
  lng: 'fr',
})

export default i18n
