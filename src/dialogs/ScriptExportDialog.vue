<template>
    <ModalDialog ref="modalDialog" title="Export animation script">
        <div class="text-center mb-2">
            <Button text severity="secondary" @click="copyToClipboard">
                Copy to clipboard
            </Button>
        </div>
        <div class="text-center">
            <Button @click="saveFile">
                Export...
            </Button>
        </div>
    </ModalDialog>
</template>

<script>
    import ModalDialog from "./ModalDialog.vue";

    export default {
        components: {
            ModalDialog
        },
        data() {
            return {
                animationScriptJson: null,
                animationScriptFilename: []
            }
        },
        methods: {
            show(animationScriptJson, animationScriptFilename) {
                this.animationScriptJson = animationScriptJson;
                this.animationScriptFilename = animationScriptFilename;

                this.$refs.modalDialog.show();
            },
            async copyToClipboard() {
                await navigator.clipboard.writeText(this.animationScriptJson);

                this.$refs.modalDialog.hide();
            },
            async saveFile() {
                const blob = new Blob([this.animationScriptJson], { type: "text/plain;charset=utf-8" });

                try {
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: this.animationScriptFilename
                    });
                    const writableStream = await fileHandle.createWritable();
                    await writableStream.write(blob);
                    await writableStream.close();
                } catch { }

                this.$refs.modalDialog.hide();
            }
        }
    }
</script>
