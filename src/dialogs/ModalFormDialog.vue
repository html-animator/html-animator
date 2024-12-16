<template>
    <Dialog v-model:visible="isVisible" modal :header="title" :style="{ width: width ? width : '600px' }">
        <form>
            <slot />
            <div class="field grid justify-content-end gap-2">
                <Button text @click="cancelButtonClicked">
                    {{ cancelButtonText }}
                </Button>
                <Button type="submit" class="mr-2" @click="primaryButtonClicked">
                    {{ primaryButtonText }}
                </Button>
            </div>
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
            cancelButtonText: {
                type: String,
                default: null
            },
            primaryButtonText: {
                type: String,
                default: null
            },
            width: {
                type: String,
                default: null
            }
        },
        emits: ["cancelButtonClicked", "primaryButtonClicked"],
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
            },
            cancelButtonClicked() {
                this.hide();
                this.$emit("cancelButtonClicked", null);
            },
            primaryButtonClicked(e) {
                e.preventDefault();
                this.$emit("primaryButtonClicked", null);
            }
        }
    }
</script>
