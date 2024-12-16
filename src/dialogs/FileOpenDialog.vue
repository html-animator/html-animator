<template>
    <ModalDialog ref="modalDialog" :title="title">
        <div class="text-center">
            <div class="mb-3">
                {{ message }}
            </div>
            <FileUpload mode="basic" :max-file-size="1000000" :accept="accept" @select="onFileSelected" />
        </div>
    </ModalDialog>
</template>

<script>
    import ModalDialog from "./ModalDialog.vue";

    export default {
        components: {
            ModalDialog
        },
        props: {
            accept: {
                type: String,
                default: null
            },
            title: {
                type: String,
                default: null
            },
            message: {
                type: String,
                default: null
            }
        },
        emits: ["fileOpened"],
        data() {
            return {
            }
        },
        methods: {
            show() {
                this.$refs.modalDialog.show();
            },
            onFileSelected(event) {
                let reader = new FileReader();
                let filename = null;
                reader.onload = () => {
                    this.$emit("fileOpened", { data: reader.result, name: filename });
                    this.$refs.modalDialog.hide();
                };
                if (event.files.length === 1) {
                    filename = event.files[0].name;
                    reader.readAsText(event.files[0]);
                }
            }
        }
    }
</script>
