<template>
    <div class="scene-viewer html-scene">
        <div class="scene-background" @wheel.ctrl.prevent="onWheelCtrlScroll">
            <iframe :style="sceneStyle" />
        </div>
        <div v-if="Math.round(sceneTransform.scale * 100) !== 100" class="info">
            {{ Math.round(sceneTransform.scale * 100) }}%
        </div>
    </div>
</template>

<script>
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
        emits: ["update:modelValue", "scrollProgress"],
        data() {
            return {
                sceneTransform: {
                    scale: 1
                }
            }
        },
        computed: {
            sceneStyle() {
                const size = 100 / this.sceneTransform.scale;
                const offset = (100 - size) / 2;
                return {
                    position: "relative",
                    transform: `scale(${this.sceneTransform.scale}, ${this.sceneTransform.scale})`,
                    width: `${size}%`,
                    height: `${size}%`,
                    left: `${offset}%`,
                    top: `${offset}%`,
                };
            }
        },
        watch: {
            modelValue(element) {
                if (element) {
                    let elementBoundingBox = element.getBoundingClientRect();
                    let selectionBoundingBox = this.iframe.contentWindow.document.getElementById("htmlanimator-selection-bounding-box");
                    selectionBoundingBox.style.cssText = `position: fixed; left: ${elementBoundingBox.x}px; top: ${elementBoundingBox.y}px; width:${elementBoundingBox.width}px; height:${elementBoundingBox.height}px; border: dashed 1px #FFFFFF; outline: dashed 1px #000000; pointer-events: none;`;
                } else {
                    var selectionBoundingBox = this.iframe.contentWindow.document.getElementById("htmlanimator-selection-bounding-box");
                    selectionBoundingBox.style = "display: none;";
                }
            }
        },
        mounted() {
            this.iframe = document.querySelector("iframe");
        },
        methods: {
            loadScene(sceneMarkup) {
                const promise = new Promise((resolve) => {
                    const onIframeLoad = (event) => {
                        this.iframe.removeEventListener("load", onIframeLoad);
                        resolve();
                    };
                    this.iframe.addEventListener("load", onIframeLoad);
                });
                this.iframe.contentWindow.document.open();
                this.iframe.contentWindow.document.write(sceneMarkup);
                this.iframe.contentWindow.document.close();
                this.iframe.contentWindow.removeEventListener("scroll", this.onScroll, { passive: true });
                this.iframe.contentWindow.addEventListener("scroll", this.onScroll, { passive: true });
                return promise;
            },
            unloadScene() {
                this.iframe.contentWindow.document.open();
                this.iframe.contentWindow.document.write("<html><head></head><body></body></html>");
                this.iframe.contentWindow.document.close();
            },
            startResize() {
                //this.iframe.style.pointerEvents = "none";
            },
            endResize() {
                //this.iframe.style.pointerEvents = "auto";
            },
            onScroll(event) {
                const scrollerHeight = this.iframe.contentWindow.document.body.clientHeight;
                const scrollerScrollTop = this.iframe.contentWindow.document.body.scrollTop;
                const scrollerContentHeight = this.iframe.contentWindow.document.body.scrollHeight;
                if (this.scrollEventOptions.raiseScrollProgressEvents) {
                    let verticalScrollPercentage = Math.min(Math.max(scrollerScrollTop / (scrollerContentHeight - scrollerHeight) * 100, 0), 100);
                    if (verticalScrollPercentage > 99.75) {
                        verticalScrollPercentage = 100;
                    }
                    this.$emit("scrollProgress", {
                        percentage: verticalScrollPercentage
                    });
                } else if (this.scrollEventOptions.raiseViewProgressEvents) {
                    const subject = this.iframe.contentWindow.document.querySelector(this.scrollEventOptions.subjectElementSelector);
                    const offset = 0;
                    const subjectOffsetTop = subject.offsetTop - offset;
                    const subjectHeight = subject.getBoundingClientRect().height + 2 * offset;
                    if (scrollerHeight + scrollerScrollTop > subjectOffsetTop && scrollerScrollTop < subjectOffsetTop + subjectHeight) {
                        const visibleHeight = scrollerHeight + scrollerScrollTop - subjectOffsetTop;
                        const totalVisibleHeight = scrollerHeight + subjectHeight;
                        const verticalScrollPercentage = visibleHeight / totalVisibleHeight * 100;
                        this.$emit("scrollProgress", {
                            percentage: verticalScrollPercentage
                        });
                    }
                }
            },
            onWheelCtrlScroll(event) {
                this.sceneTransform.scale = Math.min(Math.max(this.sceneTransform.scale - event.deltaY / 1000, 0.1), 10);
            }
        }
    }
</script>
