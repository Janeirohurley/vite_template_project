import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./fr";
import en from "./en";
import rn from "./rn";

// On crée un type qui correspond aux clés des fichiers de traduction
type TranslationKeys = keyof typeof fr;

// On étend le module react-i18next pour que useTranslation() ait l'autocomplétion
declare module "react-i18next" {
    interface CustomTypeOptions {
        // Indique à i18next les clés de traduction disponibles
        resources: {
            translation: TranslationKeys
        };
        defaultNS: "translation";
        // permet à t('key') de connaître les clés
        returnNull: false;
    }
}

i18n.use(initReactI18next).init({
    resources: {
        fr: { translation: fr },
        en: { translation: en },
        rn: { translation: rn },
    },
    lng: "rn", // langue par défaut
    fallbackLng: "en", // langue de secours
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
