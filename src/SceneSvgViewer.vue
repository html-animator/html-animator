<template>
    <div class="scene-viewer svg-scene">
        <div class="scene-background" @pointerdown.passive="onPointerDown" @pointermove.passive="onPointerMove" @pointerup.passive="onPointerUp" @pointerleave.passive="onPointerLeave" @wheel.exact="onWheelScroll" @wheel.ctrl.prevent="onWheelCtrlScroll">
            <div class="scene-transform" :style="{ transform: sceneTransformStyle }" />
        </div>
        <div class="button-list">
            <Button class="icon-button" severity="secondary" title="Zoom in" @click="zoomIn">
                <span class="icon-zoom-in" />
            </Button>
            <Button class="icon-button" severity="secondary" title="Zoom out" @click="zoomOut">
                <span class="icon-zoom-out" />
            </Button>
            <Button class="icon-button" severity="secondary" title="Zoom to fit" @click="zoomToFit">
                <span class="icon-zoom-to-fit" />
            </Button>
        </div>
    </div>
</template>

<script>
    import MathHelper from "./shared/MathHelper.js";

    export default {
        props: {
            modelValue: {
                type: Object,
                default: null
            },
            scrollEventOptions: {
                type: Object,
                default: null
            }
        },
        emits: ["update:modelValue"],
        data() {
            return {
                sceneTransform: {
                    x: 0,
                    y: 0,
                    scale: 1
                }
            }
        },
        computed: {
            sceneTransformStyle() {
                return `translate(${this.sceneTransform.x}px, ${this.sceneTransform.y}px) scale(${this.sceneTransform.scale}, ${this.sceneTransform.scale})`;
            }
        },
        watch: {
            modelValue(element) {
                if (element) {
                    const selectedNodeBBox = element.getBBox();
                    if (selectedNodeBBox.width > 0 && selectedNodeBBox.height > 0) {
                        const transform = new DOMMatrixReadOnly(window.getComputedStyle(element).transform);
                        const transformedBoundingBox = MathHelper.getTransformedBoundingBox(transform, selectedNodeBBox);
                        let selectionBoundingBox = document.getElementById("htmlanimator-selection-bounding-box");
                        selectionBoundingBox.setAttribute("x", transformedBoundingBox.x);
                        selectionBoundingBox.setAttribute("y", transformedBoundingBox.y);
                        selectionBoundingBox.setAttribute("width", transformedBoundingBox.width);
                        selectionBoundingBox.setAttribute("height", transformedBoundingBox.height);
                        selectionBoundingBox.style = "stroke: #FFFFFF; stroke-width: 0.5%; stroke-dasharray: 2%; fill: transparent;";
                    }
                } else {
                    var selectionBoundingBox = document.getElementById("htmlanimator-selection-bounding-box");
                    selectionBoundingBox.style = "display: none;";
                }
            }
        },
        mounted() {
            this.pointerPositionOffset = { x: 0, y: 0 };
        },
        methods: {
            loadScene(sceneMarkup) {
                const sceneTransform = document.querySelector(".scene-transform");
                sceneTransform.innerHTML = sceneMarkup;
                this.zoomToFit();
                return Promise.resolve();
            },
            unloadScene() {
                const sceneTransform = document.querySelector(".scene-transform");
                sceneTransform.innerHTML = "";
            },
            startResize() {
            },
            endResize() {
            },
            zoom(delta) {
                this.sceneTransform.scale = Math.min(Math.max(this.sceneTransform.scale - delta / 1000, 0.1), 10);
            },
            zoomIn() {
                this.zoom(-100);
            },
            zoomOut() {
                this.zoom(100);
            },
            zoomToFit() {
                this.pointerPositionOffset.x = 0;
                this.pointerPositionOffset.y = 0;
                this.sceneTransform.x = 0;
                this.sceneTransform.y = 0;
                this.sceneTransform.scale = 1;

                this.$nextTick(() => {
                    const sceneBackgroundBoundingBox = document.querySelector(".scene-background").getBoundingClientRect();
                    const sceneBoundingBox = document.querySelector(".scene-transform svg").getBoundingClientRect();

                    var hRatio = sceneBackgroundBoundingBox.width / sceneBoundingBox.width;
                    var vRatio = sceneBackgroundBoundingBox.height / sceneBoundingBox.height;
                    var ratio = Math.min(hRatio, vRatio);

                    this.sceneTransform.scale = ratio;
                });
            },
            onPointerDown(event) {
                this.pointerDownPosition = { x: event.x, y: event.y };
                this.isPointerDown = true;
            },
            onPointerMove(event) {
                if (this.isPointerDown) {
                    this.sceneTransform.x = event.x - this.pointerDownPosition.x + this.pointerPositionOffset.x;
                    this.sceneTransform.y = event.y - this.pointerDownPosition.y + this.pointerPositionOffset.y;
                }
            },
            onPointerUp(event) {
                this.isPointerDown = false;
                this.pointerPositionOffset = { x: this.sceneTransform.x, y: this.sceneTransform.y };
                if (this.pointerDownPosition && this.pointerDownPosition.x === event.x && this.pointerDownPosition.y === event.y) {
                    var elements = document.elementsFromPoint(event.x, event.y).filter(x => !x.id.startsWith("htmlanimator"));
                    var workPaneIndex = elements.findIndex(x => x.className === "scene-background" || x.className === "scene-transform");
                    if (workPaneIndex > 0) {
                        elements = elements.slice(0, workPaneIndex);
                        let selectSceneElementIndex = 0;
                        if (elements.includes(this.modelValue) && elements.findIndex(x => x === this.modelValue) + 1 < elements.length) {
                            selectSceneElementIndex = elements.findIndex(x => x === this.modelValue) + 1;
                        }
                        this.$emit("update:modelValue", elements[selectSceneElementIndex]);
                    } else {
                        this.$emit("update:modelValue", null);
                    }
                }
            },
            onPointerLeave(event) {
                this.isPointerDown = false;
                this.pointerPositionOffset = { x: this.sceneTransform.x, y: this.sceneTransform.y };
            },
            onWheelScroll(event) {
                this.sceneTransform.y -= event.deltaY;
            },
            onWheelCtrlScroll(event) {
                this.zoom(event.deltaY);
            }
        }
    }
</script>
