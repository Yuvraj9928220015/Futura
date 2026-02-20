// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Yaha saari translations define karte hain
const resources = {
  en: {
    translation: {
      LANGUAGE: "Language",
      PERFORMANCE_FEATURES: "Performance Features",
      CONTACT_US: "Contact Us",
      LOGIN: "Login",
      REGISTER: "Register",
      NAME: "Name",
      EMAIL: "Email",
      PASSWORD: "Password",
      CONFIRM_PASSWORD: "Confirm Password",
      FORGOT_PASSWORD: "Forgot Password?",
      DONT_HAVE_ACCOUNT: "Don't have an account? Register",
      ALREADY_HAVE: "Already have an account? Login",
      SEND_MESSAGE: "Send Message",
      SEARCH: "Search",
    },
  },
  de: {
    translation: {
      LANGUAGE: "Sprache",
      PERFORMANCE_FEATURES: "Leistungsmerkmale",
      CONTACT_US: "Kontaktiere uns",
      LOGIN: "Anmelden",
      REGISTER: "Registrieren",
      NAME: "Name",
      EMAIL: "E-Mail",
      PASSWORD: "Passwort",
      CONFIRM_PASSWORD: "Passwort bestätigen",
      FORGOT_PASSWORD: "Passwort vergessen?",
      DONT_HAVE_ACCOUNT: "Noch kein Konto? Registrieren",
      ALREADY_HAVE: "Schon ein Konto? Anmelden",
      SEND_MESSAGE: "Nachricht senden",
      SEARCH: "Suchen",
    },
  },
  fr: {
    translation: {
      LANGUAGE: "Langue",
      PERFORMANCE_FEATURES: "Fonctionnalités",
      CONTACT_US: "Contactez-nous",
      LOGIN: "Connexion",
      REGISTER: "S'inscrire",
      NAME: "Nom",
      EMAIL: "E-mail",
      PASSWORD: "Mot de passe",
      CONFIRM_PASSWORD: "Confirmer le mot de passe",
      FORGOT_PASSWORD: "Mot de passe oublié ?",
      DONT_HAVE_ACCOUNT: "Pas de compte ? S'inscrire",
      ALREADY_HAVE: "Déjà un compte ? Connexion",
      SEND_MESSAGE: "Envoyer le message",
      SEARCH: "Recherche",
    },
  },
  ur: {
    translation: {
      welcome: "خوش آمدید",
      hello: "ہیلو، آپ کیسے ہیں؟",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
