<template>
    <template v-if="mode === 'icon'">
        <span v-if="modelValue && modelValue.length > 0" :title="errorTooltip" class="input-error icon icon-exclamation-mark-triangle" />
    </template>
    <template v-else>
        <div v-if="modelValue.length > 0" class="input-error text">
            {{ modelValue[0].$message }}
        </div>
    </template>
</template>

<script>
    export default {
        props: {
            modelValue: {
                type: Array,
                default: () => []
            },
            mode: {
                type: String,
                default: null
            }
        },
        computed: {
            errorTooltip() {
                return this.modelValue.map(error => `${error.$message}\r\n`);
            }
        }
    }
</script>
