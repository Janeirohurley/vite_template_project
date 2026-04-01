import type { Language } from "@/lib";
import { useTranslation } from "react-i18next";

const useTranslations = () => {
    const { i18n } = useTranslation();
const changeLanguage = (lang: Language) => {
        i18n.changeLanguage(lang);
    };

    return { changeLanguage };
}


export default useTranslations;