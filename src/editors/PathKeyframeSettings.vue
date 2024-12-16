<template>
    <OverlayPanel ref="pathKeyframeSettings" style="width: 360px;">
        <div class="field grid">
            <label class="col-3">Selector</label>
            <div class="col-9">
                <InputText v-model="pathSelector" class="w-full" />
                <InputValidator v-model="v$.pathSelector.$errors" />
            </div>
        </div>
        <div class="field grid">
            <label class="col-3">Property</label>
            <div class="col">
                <InputText v-model="pathProperty" class="w-full" />
                <InputValidator v-model="v$.pathProperty.$errors" />
            </div>
        </div>
        <div class="field grid">
            <div class="col-offset-3 col">
                <Checkbox v-model="applyToAdjacentKeyframes" input-id="applyToAdjacentKeyframes" :binary="true" />
                <label for="applyToAdjacentKeyframes" class="ml-2">Apply to adjacent keyframes</label>
            </div>
        </div>
        <div class="field grid">
            <div class="col flex justify-content-end gap-2">
                <Button text severity="secondary" @click="$refs.pathKeyframeSettings.toggle($event);">
                    Cancel
                </Button>
                <Button @click="onApplyClick">
                    Apply
                </Button>
            </div>
        </div>
    </OverlayPanel>
</template>

<script>
    import { required, selectorReturnsElement } from "../i18n/i18n-validators.js";
    import InputValidator from "../shared/InputValidator.vue";
    import useVuelidate from "@vuelidate/core";

    export default {
        components: {
            InputValidator
        },
        setup() {
            return {
                v$: useVuelidate({ $scope: false })
            }
        },
        data() {
            return {
                pathKeyframes: [],
                pathKeyframe: null,
                pathSelector: null,
                pathProperty: null,
                applyToAdjacentKeyframes: true
            }
        },
        validations() {
            return {
                pathSelector: { required, selectorReturnsElement },
                pathProperty: { required }
            }
        },
        methods: {
            toggle(event, pathKeyframes, pathKeyframe) {
                this.v$.$reset();

                this.pathKeyframes = pathKeyframes;
                this.pathKeyframe = pathKeyframe;
                this.pathSelector = pathKeyframe.pathSelector;
                this.pathProperty = pathKeyframe.pathProperty;
                this.$refs.pathKeyframeSettings.toggle(event);
            },
            onApplyClick(event) {
                this.v$.$touch();
                if (!this.v$.$error) {
                    if (this.applyToAdjacentKeyframes) {
                        this.pathKeyframes.forEach(pathKeyframe => {
                            pathKeyframe.pathSelector = this.pathSelector;
                            pathKeyframe.pathProperty = this.pathProperty;
                        });
                    } else {
                        this.pathKeyframe.pathSelector = this.pathSelector;
                        this.pathKeyframe.pathProperty = this.pathProperty;
                    }
                    this.$refs.pathKeyframeSettings.toggle(event);
                }
            }
        }
    }
</script>
