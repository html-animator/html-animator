import { createI18n } from "vue-i18n"
import resources from "./resources.js"

const i18n = createI18n({
    locale: window.navigator.language,
    fallbackLocale: "en",
    silentFallbackWarn: true,
    silentTranslationWarn: true,
    messages: resources
});

export default i18n;
