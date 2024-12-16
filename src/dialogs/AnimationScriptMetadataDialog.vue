<template>
    <ModalDialog ref="modalDialog" title="Animation properties">
        <Fieldset legend="Timeline" class="mb-4">
            <div class="field grid">
                <label class="col-4">Timeline type</label>
                <div class="col-8">
                    <Dropdown v-model="timelineType" :options="timelineTypes" option-value="value" option-label="label" class="w-full" />
                    <InputValidator v-model="v$.timelineType.$errors" />
                </div>
            </div>
            <template v-if="timelineType === 'ScrollProgressTimeline' || timelineType === 'ViewProgressTimeline'">
                <div class="field grid">
                    <div class="col-offset-4 col-8">
                        <InlineMessage v-if="timelineType === 'ScrollProgressTimeline'" severity="info">
                            The position in the scroll range is converted into a percentage of progress - 0% at the start and 100% at the end.
                        </InlineMessage>
                        <InlineMessage v-if="timelineType === 'ViewProgressTimeline'" severity="info">
                            The visibility of the subject inside the scroller is tracked as a percentage of progress - by default, the timeline is at 0% when the subject is first visible at one edge of the scroller, and 100% when it reaches the opposite edge.
                        </InlineMessage>
                    </div>
                </div>
                <div class="field grid">
                    <label class="col-4">Scoller element selector</label>
                    <div class="col-8">
                        <InputText v-model="scrollerElementSelector" placeholder="" class="w-full" />
                        <InputValidator v-model="v$.scrollerElementSelector.$errors" />
                    </div>
                </div>
                <div v-if="timelineType === 'ViewProgressTimeline'" class="field grid">
                    <label class="col-4">Subject element selector</label>
                    <div class="col-8">
                        <InputText v-model="subjectElementSelector" placeholder="" class="w-full" />
                        <InputValidator v-model="v$.subjectElementSelector.$errors" />
                    </div>
                </div>
            </template>
        </Fieldset>
        <Fieldset legend="Export" class="mb-4">
            <template v-if="timelineType === 'RegularTimeline'">
                <div class="field grid">
                    <label class="col-4">Play animation</label>
                    <div class="col-8">
                        <Dropdown v-model="playEvent" :options="playEvents" option-value="value" option-label="label" class="w-full" />
                        <InputValidator v-model="v$.playEvent.$errors" />
                    </div>
                </div>
                <div v-if="playEvent === 'OnClick' || playEvent === 'OnHover'" class="field grid">
                    <label class="col-4">Play element selector</label>
                    <div class="col-8">
                        <InputText v-model="playElementSelector" placeholder="" class="w-full" />
                        <InputValidator v-model="v$.playElementSelector.$errors" />
                    </div>
                </div>
            </template>
            <div class="field grid">
                <label class="col-4">Loop animation</label>
                <div class="col-8">
                    <Dropdown v-model="iterationCount" :options="iterationCounts" option-value="value" option-label="label" class="w-full" />
                    <InputValidator v-model="v$.iterationCount.$errors" />
                </div>
            </div>
        </Fieldset>
        <div class="field grid">
            <div class="col flex justify-content-end gap-2">
                <Button text severity="secondary" @click="secondaryButtonClicked">
                    Cancel
                </Button>
                <Button @click="primaryButtonClicked">
                    Save
                </Button>
            </div>
        </div>
    </ModalDialog>
</template>

<script>
    import { required, requiredIf, selectorReturnsElement } from "../i18n/i18n-validators.js";
    import InputValidator from "../shared/InputValidator.vue";
    import ModalDialog from "./ModalDialog.vue";
    import useVuelidate from "@vuelidate/core";

    export default {
        components: {
            ModalDialog,
            InputValidator
        },
        emits: ["primaryButtonClicked"],
        setup() {
            return {
                v$: useVuelidate()
            }
        },
        data() {
            return {
                iterationCount: null,
                iterationCounts: [{ value: 1, label: "No" }, { value: 0, label: "Yes" }],
                timelineType: null,
                timelineTypes: [],
                playEvent: null,
                playEvents: [{ value: "OnLoad", label: "After document has loaded" }, { value: "OnClick", label: "On click on element" }, { value: "OnHover", label: "On hovering over an element" }],
                playElementSelector: null,
                scrollerElementSelector: null,
                subjectElementSelector: null
            }
        },
        validations() {
            return {
                iterationCount: { required },
                timelineType: { required },
                playEvent: { requiredIf: requiredIf(() => this.timelineType === "RegularTimeline") },
                playElementSelector: { requiredIf: requiredIf(() => this.playEvent === "OnClick" || this.playEvent === "OnHover"), selectorReturnsElement },
                scrollerElementSelector: { requiredIf: requiredIf(() => this.timelineType === "ScrollProgressTimeline" || this.timelineType === "ViewProgressTimeline"), selectorReturnsElement },
                subjectElementSelector: { requiredIf: requiredIf(() => this.timelineType === "ViewProgressTimeline"), selectorReturnsElement }
            }
        },
        methods: {
            show(sceneType, animationScriptMetadata) {
                this.reset();

                this.iterationCount = animationScriptMetadata.iterationCount !== undefined ? animationScriptMetadata.iterationCount : 1;
                if (sceneType === "svg") {
                    this.timelineType = "RegularTimeline";
                    this.timelineTypes = [{ value: "RegularTimeline", label: "Regular" }];
                } else if (sceneType === "html") {
                    this.timelineType = animationScriptMetadata.timeline.type !== undefined ? animationScriptMetadata.timeline.type : "RegularTimeline";
                    this.timelineTypes = [{ value: "RegularTimeline", label: "Regular" }, { value: "ScrollProgressTimeline", label: "Scroll progress" }, { value: "ViewProgressTimeline", label: "View progress" }]
                }
                this.playEvent = animationScriptMetadata.timeline.play !== undefined ? animationScriptMetadata.timeline.play : "OnLoad";
                this.playElementSelector = animationScriptMetadata.timeline.playElementSelector !== undefined ? animationScriptMetadata.timeline.playElementSelector : null;
                this.scrollerElementSelector = animationScriptMetadata.timeline.scrollerElementSelector !== undefined ? animationScriptMetadata.timeline.scrollerElementSelector : null;
                this.subjectElementSelector = animationScriptMetadata.timeline.subjectElementSelector !== undefined ? animationScriptMetadata.timeline.subjectElementSelector : null;

                this.$refs.modalDialog.show();
            },
            reset() {
                this.v$.$reset();

                this.iterationCount = 1;
            },
            secondaryButtonClicked() {
                this.$refs.modalDialog.hide();
            },
            primaryButtonClicked() {
                this.v$.$touch();
                if (!this.v$.$error) {
                    const timeline = {
                        type: this.timelineType
                    };
                    switch (this.timelineType) {
                        case "RegularTimeline":
                            timeline.play = this.playEvent;
                            if (timeline.play !== "OnLoad") {
                                timeline.playElementSelector = this.playElementSelector;
                            }
                            break;
                        case "ScrollProgressTimeline":
                            timeline.scrollerElementSelector = this.scrollerElementSelector;
                            break;
                        case "ViewProgressTimeline":
                            timeline.scrollerElementSelector = this.scrollerElementSelector;
                            timeline.subjectElementSelector = this.subjectElementSelector;
                            break;
                    }

                    this.$emit("primaryButtonClicked", {
                        iterationCount: this.iterationCount,
                        timeline: timeline
                    });
                    this.$refs.modalDialog.hide();
                }
            }
        }
    }
</script>
