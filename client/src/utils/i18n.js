import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to RuralMed",
      "find_doctor": "Find a Doctor",
      "book_appointment": "Book Appointment",
      "symptom_checker": "Symptom Checker",
      "pharmacy": "Pharmacy",
      "emergency": "Emergency",
      "language": "Language"
    }
  },
  hi: {
    translation: {
      "welcome": "रूरलमेड में आपका स्वागत है",
      "find_doctor": "डॉक्टर खोजें",
      "book_appointment": "अपॉइंटमेंट बुक करें",
      "symptom_checker": "लक्षण जांचक",
      "pharmacy": "फार्मेसी",
      "emergency": "आपातकालीन",
      "language": "भाषा"
    }
  },
  pa: {
    translation: {
      "welcome": "ਰੂਰਲਮੈਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
      "find_doctor": "ਡਾਕਟਰ ਲੱਭੋ",
      "book_appointment": "ਅਪੌਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ",
      "symptom_checker": "ਲੱਛਣ ਜਾਂਚਕ",
      "pharmacy": "ਫਾਰਮੇਸੀ",
      "emergency": "ਐਮਰਜੈਂਸੀ",
      "language": "ਭਾਸ਼ਾ"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
