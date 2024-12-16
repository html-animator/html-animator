<template>
    <OverlayPanel ref="colorSelector" style="width: 200px;">
        <div v-for="(e, row) in 5" :key="row" :class="`flex justify-content-center gap-2${row < 4 ? ' mb-2': ''}`">
            <button v-for="(f, column) in 5" :key="column" :style="{ backgroundColor: colors[row * 5 + column].color, borderColor: colors[row * 5 + column].borderColor }" class="color-button" @click="onColorSelected($event, colors[row * 5 + column].color)" />
        </div>
    </OverlayPanel>
</template>

<script>
    export default {
        data() {
            return {
                colors: [{
                    color: "rgb(51, 250.92, 255)",
                    borderColor: "rgb(40.8, 200.74, 204)"
                }, {
                    color: "rgb(51, 201.96, 255)",
                    borderColor: "rgb(40.8, 161.57, 204)"
                }, {
                    color: "rgb(51, 153, 255)",
                    borderColor: "rgb(40.8, 122.4, 204)"
                }, {
                    color: "rgb(51, 104.04, 255)",
                    borderColor: "rgb(40.8, 83.23, 204)"
                }, {
                    color: "rgb(51, 55.08, 255)",
                    borderColor: "rgb(40.8, 44.06, 204)"
                }, {
                    color: "rgb(95.88, 51, 255)",
                    borderColor: "rgb(76.7, 40.8, 204)"
                }, {
                    color: "rgb(144.84, 51, 255)",
                    borderColor: "rgb(115.87, 40.8, 204)"
                }, {
                    color: "rgb(193.8, 51, 255)",
                    borderColor: "rgb(155.04, 40.8, 204)"
                }, {
                    color: "rgb(242.76, 51, 255)",
                    borderColor: "rgb(194.21, 40.8, 204)"
                }, {
                    color: "rgb(255, 51, 218.28)",
                    borderColor: "rgb(204, 40.8, 174.62)"
                }, {
                    color: "rgb(255, 51, 169.32)",
                    borderColor: "rgb(204, 40.8, 135.46)"
                }, {
                    color: "rgb(255, 51, 120.36)",
                    borderColor: "rgb(204, 40.8, 96.29)"
                }, {
                    color: "rgb(255, 51, 71.4)",
                    borderColor: "rgb(204, 40.8, 57.12)"
                }, {
                    color: "rgb(255, 79.56, 51)",
                    borderColor: "rgb(204, 63.65, 40.8)"
                }, {
                    color: "rgb(255, 128.52, 51)",
                    borderColor: "rgb(204, 102.82, 40.8)"
                }, {
                    color: "rgb(255, 177.48, 51)",
                    borderColor: "rgb(204, 141.98, 40.8)"
                }, {
                    color: "rgb(255, 226.44, 51)",
                    borderColor: "rgb(204, 181.15, 40.8)"
                }, {
                    color: "rgb(234.6, 255, 51)",
                    borderColor: "rgb(187.68, 204, 40.8)"
                }, {
                    color: "rgb(185.64, 255, 51)",
                    borderColor: "rgb(148.51, 204, 40.8)"
                }, {
                    color: "rgb(136.68, 255, 51)",
                    borderColor: "rgb(109.34, 204, 40.8)"
                }, {
                    color: "rgb(87.72, 255, 51)",
                    borderColor: "rgb(70.18, 204, 40.8)"
                }, {
                    color: "rgb(51, 255, 63.24)",
                    borderColor: "rgb(40.8, 204, 50.59)"
                }, {
                    color: "rgb(51, 255, 112.2)",
                    borderColor: "rgb(40.8, 204, 89.76)"
                }, {
                    color: "rgb(51, 255, 161.16)",
                    borderColor: "rgb(40.8, 204, 128.93)"
                }, {
                    color: "rgb(51, 255, 210.12)",
                    borderColor: "rgb(40.8, 204, 168.1)"
                }]
            }
        },
        methods: {
            toggle(event) {
                this.$refs.colorSelector.toggle(event);
            },
            setOnColorSelectedCallback(callback) {
                this.onColorSelectedCallback = callback;
            },
            onColorSelected(event, color) {
                this.onColorSelectedCallback(color);
                this.$refs.colorSelector.toggle(event);
            }
        }
    }
</script>

<style>
    .color-button {
        all: unset;
        width: 24px;
        height: 24px;
        border-style: solid;
        border-width: 2px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
