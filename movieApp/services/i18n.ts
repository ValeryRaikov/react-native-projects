import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '@/locales/en.json';
import bg from '@/locales/bg.json';

i18n
  .use(initReactI18next)
  .init({
    lng: Localization.locale.startsWith('bg') ? 'bg' : 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      bg: { translation: bg },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;