import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import VueGtag from "vue-gtag-next";

import Button from "primevue/button";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import Fieldset from "primevue/fieldset";
import FileUpload from "primevue/fileupload";
import InlineMessage from "primevue/inlinemessage";
import InputGroup from "primevue/inputgroup";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import OverlayPanel from 'primevue/overlaypanel';
import PrimeVue from "primevue/config";
import RadioButton from "primevue/radiobutton";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Tree from "primevue/tree";

import "primeflex/primeflex.css";
import "./assets/icons.css";
import "./assets/themes/material/material-dark/compact/blue/theme.scss";
import "./assets/style.scss";

Number.prototype.milliSecondsToTimeSpanString = function () {
    const value = this;
    const seconds = Math.floor(value / 1000);
    const milliSeconds = value - seconds * 1000;
    return `${seconds.toString().padStart(2, "0")}.${milliSeconds.toString().padStart(3, "0")}`;
};

String.prototype.isNumber = function () {
    const value = this;
    return !isNaN(value) && !isNaN(parseFloat(value));
};
String.prototype.truncate = function (maxLength) {
    const value = this;
    return value.length > maxLength ? value.substring(0, maxLength - 3) + "..." : value;
};
String.prototype.toFirstUpperCase = function () {
    const value = this;
    return value.charAt(0).toUpperCase() + value.slice(1);
};

Array.prototype.moveElementUp = function (element) {
    const value = this;
    let index = value.indexOf(element);
    if (index > 0) {
        value[index] = value[index - 1];
        value[index - 1] = element;
    }
}
Array.prototype.moveElementDown = function (element) {
    const value = this;
    let index = value.indexOf(element);
    if (index !== -1 && index < value.length - 1) {
        value[index] = value[index + 1];
        value[index + 1] = element;
    }
}

Date.prototype.toFilenameString = function () {
    const p = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC"
    }).formatToParts(this).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});

    return `${p.year}-${p.month}-${p.day}_${p.hour}${p.minute}`;
}

const app = createApp(App);

app.use(i18n);
app.use(PrimeVue);
app.use(ToastService);
app.use(VueGtag, {
    property: {
        id: "G-RLE3SJ34XJ"
    }
});

app.component("Button", Button);
app.component("Card", Card);
app.component("Checkbox", Checkbox);
app.component("Dialog", Dialog);
app.component("Divider", Divider);
app.component("Dropdown", Dropdown);
app.component("Fieldset", Fieldset);
app.component("FileUpload", FileUpload);
app.component("InlineMessage", InlineMessage);
app.component("InputGroup", InputGroup);
app.component("InputText", InputText);
app.component("Menu", Menu);
app.component("Menubar", Menubar);
app.component("OverlayPanel", OverlayPanel);
app.component("RadioButton", RadioButton);
app.component("Splitter", Splitter);
app.component("SplitterPanel", SplitterPanel);
app.component("Tag", Tag);
app.component("Toast", Toast);
app.component("Tree", Tree);

app.mount("#app")
