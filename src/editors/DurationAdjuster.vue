<template>
    <OverlayPanel ref="durationAdjuster" style="width: 200px;">
        <div class="field grid">
            <label class="col-6">New duration</label>
            <div class="col-6">
                <InputText v-model="duration" class="w-full" @change="onDurationChanged($event)" />
                <InputValidator v-model="v$.duration.$errors" />
            </div>
        </div>
        <div class="field grid">
            <div class="col flex justify-content-end gap-2">
                <Button text severity="secondary" @click="$refs.durationAdjuster.toggle($event);">
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
                duration: null
            }
        },
        validations() {
            return {
                duration: { required }
            }
        },
        methods: {
            onDurationChanged(event) {
                this.duration = event.target.value.isNumber() ? Math.min(Math.max(parseInt(event.target.value), 100), 600000) : null;
            },
            toggle(event, duration) {
                this.duration = duration;
                this.$refs.durationAdjuster.toggle(event);
            },
            setOnDurationChangedCallback(callback) {
                this.onColorSelectedCallback = callback;
            },
            onApplyClick(event) {
                this.v$.$touch();
                if (!this.v$.$error) {
                    this.onColorSelectedCallback(this.duration);
                    this.$refs.durationAdjuster.toggle(event);
                }
            }
        }
    }
</script>
