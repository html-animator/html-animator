<template>
    <template v-if="animations.length > 0">
        <table class="w-full">
            <tr>
                <th colspan="5" class="pb-2">
                    Animation properties
                </th>
            </tr>
            <template v-for="(animation, animationIndex) in animations" :key="animation.id">
                <tr>
                    <td>Targets</td>
                    <td colspan="4">
                        <InputText v-model="animation.targets" placeholder="Targets" class="w-full" />
                        <InputValidator v-if="v$.$dirty" v-model="v$.animations.$each.$response.$errors[animationIndex].targets" />
                    </td>
                </tr>
                <tr>
                    <td>Easing</td>
                    <td colspan="4">
                        <InputGroup>
                            <InputText v-model="animation.defaults.easing" placeholder="Easing" class="w-full" />
                            <Button class="icon-button" severity="secondary" @click="toggleEasingSelector($event, animation.defaults)">
                                <span class="icon-easing" />
                            </Button>
                        </InputGroup>
                    </td>
                </tr>
                <template v-for="(property, propertyIndex) in animation.properties" :key="property.id">
                    <tr>
                        <td>Property</td>
                        <td colspan="4">
                            <Dropdown v-model="property.name" :options="propertiesNames" editable placeholder="Property" class="w-full" />
                            <template v-if="v$.animations.$each.$response.$errors[animationIndex].properties.length > 0">
                                <InputValidator v-if="v$.$dirty" v-model="v$.animations.$each.$response.$errors[animationIndex].properties[0].$response.$errors[propertyIndex].name" />
                            </template>
                        </td>
                    </tr>
                    <AnimationKeyframeEditor ref="animationKeyframeEditor" :keyframes="property.keyframes" :keyframe-groups="property.keyframeGroups" :highlighted-keyframe-ids="highlightedAnimationKeyframeIds" :default-easing="animation.defaults.easing" @keyframe-deleted="onKeyframeDeleted" />
                    <tr>
                        <td colspan="5">
                            <pre style="display: none; font-size: 12px;">{{ JSON.stringify(property, 2, " ") }}</pre>
                        </td>
                    </tr>
                </template>
            </template>
        </table>
        <EasingSelector ref="easingSelector" />
        <div class="flex justify-content-center flex-wrap gap-2">
            <Button text severity="secondary" @click="onCancelClick">
                Cancel
            </Button>
            <Button @click="onApplyClick($event)">
                <template v-if="mode === 'Add'">
                    Add
                </template>
                <template v-else>
                    Update
                </template>
            </Button>
        </div>
    </template>
</template>

<script>
    import { helpers } from "@vuelidate/validators";
    import { required, selectorReturnsElement } from "../i18n/i18n-validators.js";
    import AnimationHelper from "../AnimationHelper.js";
    import AnimationKeyframeEditor from "./AnimationKeyframeEditor.vue";
    import EasingSelector from "./EasingSelector.vue";
    import InputValidator from "../shared/InputValidator.vue";
    import useVuelidate from "@vuelidate/core";

    export default {
        components: {
            EasingSelector,
            InputValidator,
            AnimationKeyframeEditor
        },
        emits: ["added", "updated", "canceled"],
        setup() {
            return {
                v$: useVuelidate()
            }
        },
        data() {
            return {
                mode: null,
                propertiesNames: AnimationHelper.getAnimationPropertyNames(),
                animations: [],
                highlightedAnimationKeyframeIds: [],
                deletedAnimationKeyframeIds: []
            }
        },
        validations() {
            return {
                animations: {
                    $each: helpers.forEach({
                        targets: { required, selectorReturnsElement },
                        properties: {
                            $each: helpers.forEach({
                                name: { required }
                            })
                        }
                    })
                }
            }
        },
        methods: {
            showAdd(animations) {
                this.v$.$reset();

                this.mode = "Add";
                this.animations = animations;
                this.highlightedAnimationKeyframeIds = [];
            },
            showUpdate(animations, highlightedAnimationKeyframeIds) {
                this.v$.$reset();

                this.mode = "Update";
                this.animations = animations;
                this.highlightedAnimationKeyframeIds = highlightedAnimationKeyframeIds;
            },
            toggleEasingSelector(event, item) {
                this.$refs.easingSelector.setOnEasingSelectedCallback((easing) => {
                    item.easing = easing;
                });
                this.$refs.easingSelector.toggle(event, false);
            },
            onKeyframeDeleted(event) {
                this.deletedAnimationKeyframeIds.push(event.keyframeId);
            },
            onCancelClick(event) {
                this.$emit("canceled");
                this.animations.splice(0);
                this.highlightedAnimationKeyframeIds.splice(0);
                this.deletedAnimationKeyframeIds.splice(0);
            },
            onApplyClick(event) {
                this.v$.$touch();
                if (!this.v$.$error) {
                    if (this.mode === "Add") {
                        this.$emit("added", {
                            newAnimations: this.animations,
                        });
                    } else {
                        this.$emit("updated", {
                            updatedAnimations: this.animations,
                            deletedAnimationKeyframeIds: this.deletedAnimationKeyframeIds
                        });
                    }
                    this.animations.splice(0);
                    this.highlightedAnimationKeyframeIds.splice(0);
                    this.deletedAnimationKeyframeIds.splice(0);
                }
            }
        }
    }
</script>
