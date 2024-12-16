import pluginVue from "eslint-plugin-vue";

export default [
    ...pluginVue.configs["flat/recommended"],
    {
        rules: {
            "vue/html-indent": ["error", 4],
            "vue/max-attributes-per-line": "off",
            "vue/multi-word-component-names": "off",
            "vue/no-reserved-component-names": "off",
            "vue/no-v-html": "off"
        }
    }
]
