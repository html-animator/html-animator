<template>
    <tr v-for="(keyframe, keyframeIndex) in keyframes" :key="keyframe.id">
        <td class="width-80">
            <div class="flex align-items-center gap-1">
                <div :class="`pl-1 pr-1 keyframe${highlightedKeyframeIds.includes(keyframe.id) ? '' : ' selected'}`">
                    <span :class="keyframe.type === 'path' ? 'icon-path' : 'icon-keyframe'" />
                </div>
                <InputValidator v-if="v$.$dirty" v-model="v$.keyframes.$each.$response.$errors[keyframeIndex].time" mode="icon" />
                <InputText v-model="keyframe.time" placeholder="Time in ms" class="w-full" @change="onKeyframeTimeChanged($event, keyframe)" />
            </div>
        </td>
        <td>
            <div class="flex align-items-center gap-1">
                <InputValidator v-if="v$.$dirty" v-model="v$.keyframes.$each.$response.$errors[keyframeIndex].value" mode="icon" />
                <input v-model.lazy="keyframe.value" placeholder="Value" class="p-inputtext p-component p-filled p-inputtext-sm w-full" @change="onKeyframeValueChanged($event, keyframe)">
            </div>
        </td>
        <td class="min-width">
            <div class="flex align-items-center gap-1">
                <InputValidator v-if="v$.$dirty" v-model="v$.keyframes.$each.$response.$errors[keyframeIndex].pathSelector" mode="icon" />
                <InputValidator v-if="v$.$dirty" v-model="v$.keyframes.$each.$response.$errors[keyframeIndex].pathProperty" mode="icon" />
                <Button class="icon-button" severity="secondary" @click="toggleKeyframeMenu($event, keyframe, keyframeIndex)">
                    <span class="icon-vertical-dots" />
                </Button>
            </div>
        </td>
        <td>
            <template v-if="keyframeIndex < keyframes.length - 1">
                <template v-if="keyframes[keyframeIndex].type === keyframes[keyframeIndex + 1].type && keyframes[keyframeIndex].value !== keyframes[keyframeIndex + 1].value">
                    <InputGroup class="keyframe-offset">
                        <template v-if="keyframe.easing">
                            <InputText v-model="keyframe.easing" placeholder="Easing" class="w-full" />
                        </template>
                        <template v-else>
                            <InputText :value="defaultEasing" class="w-full" disabled />
                        </template>
                        <Button class="icon-button" severity="secondary" @click="toggleEasingSelector($event, keyframe, true)">
                            <span class="icon-easing" />
                        </Button>
                    </InputGroup>
                </template>
                <template v-else>
                    <InputGroup class="keyframe-offset">
                        <InputText placeholder="hold" class="w-full" disabled />
                        <Button class="icon-button" disabled>
                            <span class="icon-easing" severity="secondary" />
                        </Button>
                    </InputGroup>
                </template>
            </template>
        </td>
        <td v-if="keyframeIndex === 0 || keyframes[keyframeIndex].groupId !== keyframes[keyframeIndex - 1].groupId" :rowspan="keyframes.filter(x => x.groupId === keyframes[keyframeIndex].groupId).length" class="min-width">
            <Button class="icon-button" severity="secondary" @click="toggleKeyframeGroupSettings($event, keyframes[keyframeIndex].groupId)">
                <span class="icon-tune" />
            </Button>
        </td>
    </tr>
    <Menu ref="keyframeMenu" :model="keyframeMenu" :popup="true" />
    <PathKeyframeSettings ref="pathKeyframeSettings" />
    <EasingSelector ref="easingSelector" />
    <KeyframeGroupSettings ref="keyframeGroupSettings" />
</template>

<script>
    import { helpers } from "@vuelidate/validators";
    import { required, requiredIf } from "../i18n/i18n-validators.js";
    import AnimationHelper from "../AnimationHelper.js";
    import EasingSelector from "./EasingSelector.vue";
    import InputValidator from "../shared/InputValidator.vue";
    import KeyframeGroupSettings from "./KeyframeGroupSettings.vue";
    import PathKeyframeSettings from "./PathKeyframeSettings.vue";
    import RandomIds from "../shared/RandomIds.js";
    import useVuelidate from "@vuelidate/core";

    export default {
        components: {
            EasingSelector,
            InputValidator,
            KeyframeGroupSettings,
            PathKeyframeSettings
        },
        props: {
            keyframes: {
                type: Array,
                default: () => []
            },
            keyframeGroups: {
                type: Object,
                default: null
            },
            highlightedKeyframeIds: {
                type: Array,
                default: () => []
            },
            defaultEasing: {
                type: String,
                default: null
            }
        },
        emits: ["keyframeDeleted"],
        setup() {
            return {
                v$: useVuelidate()
            }
        },
        data() {
            return {
                keyframeMenu: [],
                insertedKeyframeIds: []
            }
        },
        validations() {
            return {
                keyframes: {
                    $each: helpers.forEach({
                        time: { required },
                        value: { required },
                        pathSelector: { requiredIf: requiredIf((value, object) => { return object.type === "path"; }) },
                        pathProperty: { requiredIf: requiredIf((value, object) => { return object.type === "path"; }) }
                    })
                }
            }
        },
        methods: {
            onKeyframeTimeChanged(event, keyframe) {
                keyframe.time = event.target.value.isNumber() ? Math.min(Math.max(parseInt(event.target.value), 0), 600000) : null;
                AnimationHelper.updateKeyframeGroups(this.keyframes, this.keyframeGroups);
            },
            onKeyframeValueChanged(event, keyframe) {
                keyframe.value = event.target.value;
                AnimationHelper.updateKeyframeGroups(this.keyframes, this.keyframeGroups);
            },
            toggleKeyframeMenu(event, keyframe, keyframeIndex) {
                const target = event.currentTarget;
                this.keyframeMenu.splice(0);
                if (keyframe.type === "path") {
                    this.keyframeMenu.push({
                        label: "Edit path properties",
                        icon: "icon-edit",
                        command: () => {
                            setTimeout(() => {
                                this.togglePathKeyframeSettings({ currentTarget: target }, keyframe);
                            }, 0);
                        }
                    });
                }
                this.keyframeMenu.push({
                    label: "Insert keyframe below",
                    icon: "icon-table-insert-row-after",
                    command: () => {
                        this.insertKeyframe(keyframeIndex + 1);
                    }
                });
                this.keyframeMenu.push({
                    label: "Delete keyframe",
                    icon: "icon-delete",
                    command: () => {
                        this.deleteKeyframe(keyframeIndex);
                    }
                });
                this.$refs.keyframeMenu.toggle(event);
            },
            insertKeyframe(keyframeIndex) {
                let value = null;
                if (keyframeIndex < this.keyframes.length) {
                    if (this.keyframes[keyframeIndex - 1].value.toString().isNumber() && this.keyframes[keyframeIndex].value.toString().isNumber()) {
                        value = (parseFloat(this.keyframes[keyframeIndex - 1].value) + parseFloat(this.keyframes[keyframeIndex].value)) / 2;
                    } else {
                        value = this.keyframes[keyframeIndex - 1].value;
                    }
                } else {
                    value = this.keyframes[keyframeIndex - 1].value;
                }

                const newKeyframe = {
                    id: RandomIds.generateId(),
                    type: this.keyframes[keyframeIndex - 1].type,
                    pathSelector: this.keyframes[keyframeIndex - 1].pathSelector,
                    pathProperty: this.keyframes[keyframeIndex - 1].pathProperty,
                    value: value.toString(),
                    time: keyframeIndex < this.keyframes.length ? (this.keyframes[keyframeIndex - 1].time + this.keyframes[keyframeIndex].time) / 2 : this.keyframes[keyframeIndex - 1].time + 1000,
                    easing: null,
                    groupId: this.keyframes[keyframeIndex - 1].groupId
                };
                this.keyframes.splice(keyframeIndex, 0, newKeyframe);
                this.insertedKeyframeIds.push(newKeyframe.id);
                AnimationHelper.updateKeyframeGroups(this.keyframes, this.keyframeGroups);
            },
            deleteKeyframe(keyframeIndex) {
                const deleteKeyframeId = this.keyframes[keyframeIndex].id;
                if (!this.insertedKeyframeIds.includes(deleteKeyframeId)) {
                    this.$emit("keyframeDeleted", { keyframeId: this.keyframes[keyframeIndex].id });
                }
                this.keyframes.splice(keyframeIndex, 1);
                AnimationHelper.updateKeyframeGroups(this.keyframes, this.keyframeGroups);
            },
            togglePathKeyframeSettings(event, pathKeyframe) {
                this.$refs.pathKeyframeSettings.toggle(event, this.keyframes.filter(x => x.type === "path"), pathKeyframe);
            },
            toggleEasingSelector(event, item) {
                this.$refs.easingSelector.setOnEasingSelectedCallback((easing) => {
                    item.easing = easing;
                });
                this.$refs.easingSelector.toggle(event, true);
            },
            toggleKeyframeGroupSettings(event, keyframeGroupId) {
                this.$refs.keyframeGroupSettings.toggle(event, this.keyframeGroups, keyframeGroupId);
            }
        }
    }
</script>
