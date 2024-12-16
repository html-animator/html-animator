<template>
    <OverlayPanel ref="keyframeGroupSettings" style="width: 360px;">
        <div class="field grid">
            <label for="iterations" class="col-3">Iterations</label>
            <div class="col-9">
                <InputText v-model="iterations" class="w-full" @change="onIterationsChanged($event)" />
                <InputValidator v-model="v$.iterations.$errors" />
            </div>
        </div>
        <div class="field grid">
            <div class="col flex justify-content-end gap-2">
                <Button text severity="secondary" @click="$refs.keyframeGroupSettings.toggle($event);">
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
    import { required } from "../i18n/i18n-validators.js";
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
                keyframeGroups: null,
                keyframeGroupId: null,
                iterations: null
            }
        },
        validations() {
            return {
                iterations: { required }
            }
        },
        methods: {
            toggle(event, keyframeGroups, keyframeGroupId) {
                this.v$.$reset();

                this.keyframeGroups = keyframeGroups;
                this.keyframeGroupId = keyframeGroupId;
                this.iterations = keyframeGroups[keyframeGroupId] ? keyframeGroups[keyframeGroupId].iterations : null;
                this.$refs.keyframeGroupSettings.toggle(event);
            },
            onIterationsChanged(event) {
                this.iterations = event.target.value.isNumber() ? Math.min(Math.max(parseInt(event.target.value), 0), 100) : null;
            },
            onApplyClick(event) {
                this.v$.$touch();
                if (!this.v$.$error) {
                    if (this.keyframeGroups[this.keyframeGroupId]) {
                        this.keyframeGroups[this.keyframeGroupId].iterations = this.iterations;
                    } else {
                        this.keyframeGroups[this.keyframeGroupId] = { iterations: this.iterations };
                    }

                    this.$refs.keyframeGroupSettings.toggle(event);
                }
            }
        }
    }
</script>
