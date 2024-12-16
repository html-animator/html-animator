<template>
    <OverlayPanel ref="easingSelector" style="width: 400px;">
        <div class="text-center white-space-nowrap mt-2">
            <div class="grid">
                <div class="col-12 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'linear')">
                        Linear
                    </Button>
                </div>
            </div>
            <div class="grid">
                <Divider />
            </div>
            <div class="grid">
                <div class="col-4 p-2">
                    Ease
                </div>
                <div class="col-2 p-2">
                    In
                </div>
                <div class="col-2 p-2">
                    Out
                </div>
                <div class="col-2 p-2">
                    In-Out
                </div>
                <div class="col-2 p-2">
                    Out-In
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Sine
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInSine')">
                        <span class="icon-ease-in-sine text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutSine')">
                        <span class="icon-ease-out-sine text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutSine')">
                        <span class="icon-ease-in-out-sine text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInSine')">
                        <span class="icon-ease-out-in-sine text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Quad
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInQuad')">
                        <span class="icon-ease-in-quad text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutQuad')">
                        <span class="icon-ease-out-quad text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutQuad')">
                        <span class="icon-ease-in-out-quad text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInQuad')">
                        <span class="icon-ease-out-in-quad text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Cubic
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInCubic')">
                        <span class="icon-ease-in-cubic text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutCubic')">
                        <span class="icon-ease-out-cubic text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutCubic')">
                        <span class="icon-ease-in-out-cubic text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInCubic')">
                        <span class="icon-ease-out-in-cubic text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Quart
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInQuart')">
                        <span class="icon-ease-in-quart text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutQuart')">
                        <span class="icon-ease-out-quart text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutQuart')">
                        <span class="icon-ease-in-out-quart text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInQuart')">
                        <span class="icon-ease-out-in-quart text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Quint
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInQuint')">
                        <span class="icon-ease-in-quint text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutQuint')">
                        <span class="icon-ease-out-quint text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutQuint')">
                        <span class="icon-ease-in-out-quint text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInQuint')">
                        <span class="icon-ease-out-in-quint text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Expo
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInExpo')">
                        <span class="icon-ease-in-expo text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutExpo')">
                        <span class="icon-ease-out-expo text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutExpo')">
                        <span class="icon-ease-in-out-expo text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInExpo')">
                        <span class="icon-ease-out-in-expo text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Circ
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInCirc')">
                        <span class="icon-ease-in-circ text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutCirc')">
                        <span class="icon-ease-out-circ text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutCirc')">
                        <span class="icon-ease-in-out-circ text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInCirc')">
                        <span class="icon-ease-out-in-circ text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Back
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInBack')">
                        <span class="icon-ease-in-back text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutBack')">
                        <span class="icon-ease-out-back text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutBack')">
                        <span class="icon-ease-in-out-back text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInBack')">
                        <span class="icon-ease-out-in-back text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Bounce
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInBounce')">
                        <span class="icon-ease-in-bounce text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutBounce')">
                        <span class="icon-ease-out-bounce text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutBounce')">
                        <span class="icon-ease-in-out-bounce text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInBounce')">
                        <span class="icon-ease-out-in-bounce text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-4 p-0">
                    Elastic (1, .6)
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInElastic(1, .6)')">
                        <span class="icon-ease-in-elastic text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutElastic(1, .6)')">
                        <span class="icon-ease-out-elastic text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeInOutElastic(1, .6)')">
                        <span class="icon-ease-in-out-elastic text-4xl" />
                    </Button>
                </div>
                <div class="col-2 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'easeOutInElastic(1, .6)')">
                        <span class="icon-ease-out-in-elastic text-4xl" />
                    </Button>
                </div>
            </div>
            <div class="grid">
                <Divider />
            </div>
            <div class="grid">
                <div class="col-12 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'cubicBezier(.5, .05, .1, .3)')">
                        Cubic Bezier (.5, .05, .1, .3)
                    </Button>
                </div>
            </div>
            <div class="grid">
                <Divider />
            </div>
            <div class="grid">
                <div class="col-12 p-0">
                    <Button text severity="secondary" @click="onEasingSelected($event, 'steps(5)')">
                        Steps (5)
                    </Button>
                </div>
            </div>
            <template v-if="allowNull">
                <div class="grid">
                    <Divider />
                </div>
                <div class="grid">
                    <div class="col-12 p-0">
                        <Button text severity="secondary" @click="onEasingSelected($event, null)">
                            Inherit from animation
                        </Button>
                    </div>
                </div>
            </template>
        </div>
    </OverlayPanel>
</template>

<script>
    export default {
        data() {
            return {
                allowNull: null
            }
        },
        methods: {
            toggle(event, allowNull) {
                this.allowNull = allowNull;
                this.$refs.easingSelector.toggle(event);
            },
            setOnEasingSelectedCallback(callback) {
                this.onEasingSelectedCallback = callback;
            },
            onEasingSelected(event, easing) {
                this.onEasingSelectedCallback(easing);
                this.$refs.easingSelector.toggle(event);
            }
        }
    }
</script>
