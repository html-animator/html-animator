<template>
    <template v-if="sceneNode">
        <table class="w-full mb-2">
            <tr>
                <th colspan="3" class="pb-2">
                    Element properties
                </th>
            </tr>
            <tr>
                <td>tagName</td>
                <td>{{ sceneNode.tagName.toLowerCase() }}</td>
                <td />
            </tr>
            <tr>
                <td>id</td>
                <td>{{ sceneNode.id }}</td>
                <td />
            </tr>
            <tr v-for="attribute in attributes.filter(x => x.name !== 'id').sort((a,b) => a.name > b.name ? 1 : -1)" :key="attribute">
                <td>{{ attribute.name }}</td>
                <td>
                    <template v-if="attribute.value.isNumber()">
                        {{ Math.round(attribute.value * 1000) / 1000 }}
                    </template>
                    <template v-else-if="attribute.value.includes(';')">
                        <div v-html="`<ul><li>${attribute.value.replaceAll(';', '</li><li>')}</li></ul>`" />
                    </template>
                    <template v-else>
                        <span class="text-word-break">{{ attribute.value.toString().truncate(200) }}</span>
                    </template>
                </td>
                <td>
                    <div v-if="attribute.name !== 'class' && attribute.name !== 'style'" class="flex justify-content-end gap-2">
                        <Button title="Add keyframe animation" class="icon-button" @click="onAddKeyframeAnimationClick($event, attribute.name)">
                            <span class="icon-keyframe" />
                        </Button>
                        <Button title="Add path animation" class="icon-button" @click="onAddPathAnimationClick($event, attribute.name)">
                            <span class="icon-path" />
                        </Button>
                    </div>
                </td>
            </tr>
        </table>
        <div class="flex justify-content-center flex-wrap gap-2 mb-4">
            <Button @click="$refs.addAnimation.toggle($event);">
                Add animation
            </Button>
        </div>
        <OverlayPanel ref="addAnimation">
            <div class="field grid">
                <label class="col-3">Type</label>
                <div class="col-9">
                    <Dropdown v-model="animationType" :options="animationTypes" option-value="value" option-label="label" class="w-full" />
                </div>
            </div>
            <div class="field grid">
                <label class="col-3">Property</label>
                <div class="col">
                    <Dropdown v-model="propertyName" :options="propertiesNames" editable placeholder="Property" class="w-full" />
                </div>
            </div>
            <div class="field grid">
                <div class="col flex justify-content-end gap-2">
                    <Button text severity="secondary" @click="$refs.addAnimation.toggle($event);">
                        Cancel
                    </Button>
                    <Button @click="onAddAnimationClick">
                        Add
                    </Button>
                </div>
            </div>
        </OverlayPanel>
    </template>
</template>

<script>
    import AnimationHelper from "./AnimationHelper.js";

    export default {
        props: {
            sceneNode: {
                type: Object,
                default: null
            }
        },
        emits: ["addKeyframeAnimationClick", "addPathAnimationClick"],
        data() {
            return {
                attributes: [],
                animationType: "keyframe",
                animationTypes: [{ value: "keyframe", label: "Keyframe" }, { value: "path", label: "Path" }],
                propertyName: null,
                propertiesNames: AnimationHelper.getAnimationPropertyNames()
            }
        },
        watch: {
            sceneNode(sceneNode) {
                if (sceneNode) {
                    this.attributes = [...sceneNode.attributes];
                    this.observer.observe(sceneNode, { attributes: true });
                } else {
                    this.observer.disconnect();
                }
            }
        },
        mounted() {
            this.observer = new MutationObserver((mutationList, observer) => {
                this.attributes = [...this.sceneNode.attributes];
            });
        },
        methods: {
            onAddKeyframeAnimationClick(event, attributeName) {
                this.$emit("addKeyframeAnimationClick", {
                    animationTargets: this.sceneNode.id !== undefined && this.sceneNode.id !== "" ? "#" + this.sceneNode.id : "",
                    propertyName: attributeName
                });
            },
            onAddPathAnimationClick(event, attributeName) {
                this.$emit("addPathAnimationClick", {
                    animationTargets: this.sceneNode.id !== undefined && this.sceneNode.id !== "" ? "#" + this.sceneNode.id : "",
                    propertyName: attributeName
                });
            },
            onAddAnimationClick(event) {
                this.$refs.addAnimation.toggle(event);

                if (this.animationType === "keyframe") {
                    this.$emit("addKeyframeAnimationClick", {
                        animationTargets: this.sceneNode.id !== undefined && this.sceneNode.id !== "" ? "#" + this.sceneNode.id : "",
                        propertyName: this.propertyName
                    });
                } else if (this.animationType === "path") {
                    this.$emit("addPathAnimationClick", {
                        animationTargets: this.sceneNode.id !== undefined && this.sceneNode.id !== "" ? "#" + this.sceneNode.id : "",
                        propertyName: this.propertyName
                    });
                }
            }
        }
    }
</script>
