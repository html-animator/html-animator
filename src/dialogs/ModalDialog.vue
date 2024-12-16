<template>
    <Dialog v-model:visible="isVisible" modal :header="title" :style="{ width: width ? width : '600px' }">
        <form>
            <slot />
        </form>
    </Dialog>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: null
            },
            width: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                isVisible: false
            }
        },
        methods: {
            show() {
                this.isVisible = true
            },
            hide() {
                this.isVisible = false;
            }
        }
    }
</script>
