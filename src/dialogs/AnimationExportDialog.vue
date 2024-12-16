<template>
    <ModalDialog ref="modalDialog" title="Export animation">
        <div class="field text-center">
            <label class="mb-2">Export as</label>
            <div class="flex justify-content-center gap-2">
                <div v-if="exportTypes.includes('svg')" class="flex align-items-center">
                    <RadioButton v-model="exportType" input-id="exportTypeSvg" value="svg" />
                    <label for="exportTypeSvg" class="ml-2">SVG</label>
                </div>
                <div v-if="exportTypes.includes('html')" class="flex align-items-center">
                    <RadioButton v-model="exportType" input-id="exportTypeHtml" value="html" />
                    <label for="exportTypeHtml" class="ml-2">HTML</label>
                </div>
            </div>
        </div>
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
    import Export from "../export/Export.js";
    import ModalDialog from "./ModalDialog.vue";

    export default {
        components: {
            ModalDialog
        },
        data() {
            return {
                exportType: null,
                exportTypes: [],
                sceneType: null,
                sceneMarkup: null,
                animationScript: null,
                animationName: null
            }
        },
        methods: {
            show(sceneType, sceneMarkup, animationScript, animationName) {
                this.sceneType = sceneType;
                if (this.sceneType === "html") {
                    this.exportType = "html";
                    this.exportTypes.push("html");
                } else if (this.sceneType === "svg") {
                    this.exportType = "svg";
                    this.exportTypes.push(...["html", "svg"]);
                }
                this.sceneMarkup = sceneMarkup;
                this.animationScript = animationScript;
                this.animationName = animationName;

                this.$refs.modalDialog.show();
            },
            async copyToClipboard() {
                const exported = Export.export(this.sceneType, this.sceneMarkup, this.animationScript, this.exportType);
                await navigator.clipboard.writeText(exported);

                this.$refs.modalDialog.hide();
            },
            async saveFile() {
                const exported = Export.export(this.sceneType, this.sceneMarkup, this.animationScript, this.exportType);
                const blob = new Blob([exported], { type: "text/plain;charset=utf-8" });

                try {
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: `${this.animationName}-${new Date().toFilenameString()}.${this.exportType}`
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
