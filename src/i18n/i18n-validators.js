import * as validators from "@vuelidate/validators";
import { createI18nMessage } from "@vuelidate/validators";
import i18n from "../i18n";

const { t } = i18n.global || i18n;

const messagePath = (a) => `MessageValidationError${a.$params.type.toFirstUpperCase()}`;

const withI18nMessage = createI18nMessage({ t, messagePath });

export const required = withI18nMessage(validators.required);
export const requiredIf = withI18nMessage(validators.requiredIf, { withArguments: true });
export const minLength = withI18nMessage(validators.minLength, { withArguments: true });
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true });
export const sameAs = withI18nMessage(validators.sameAs, { withArguments: true });
export const email = withI18nMessage(validators.email);
export const selectorReturnsElement = withI18nMessage({
    $validator: (value) => {
        if (!value) {
            return true;
        }
        try {
            const svgContainer = document.querySelector(".scene-transform");
            if (svgContainer) {
                return svgContainer.querySelectorAll(value).length > 0;
            } else {
                const iframe = document.querySelector("iframe");
                return iframe.contentWindow.document.querySelectorAll(value).length > 0;
            }
        } catch {
            return false;
        }
    },
    $message: "The selector didn't match any elements",
    $params: {
        type: "selectorReturnsElement"
    }
});
