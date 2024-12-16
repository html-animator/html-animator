<template>
    <div class="timeline">
        <div class="legend">
            <div class="header">
                <slot name="timelineLegendHeaderItems" />
                <Button class="icon-button ml-auto" severity="secondary" title="Expand all animations" @click="expandAllTracks">
                    <span class="icon-expand" />
                </Button>
                <Button class="icon-button" severity="secondary" title="Collapse all animations" @click="collapseAllTracks">
                    <span class="icon-collapse" />
                </Button>
            </div>
            <div class="content">
                <div class="tracks">
                    <template v-for="(groupedTracks, groupName) in Object.groupBy(tracks, (track) => track.groupName)" :key="groupedTracks">
                        <div class="track">
                            <div>
                                <Button text severity="secondary" title="groupedTracks.some(x => x.isExpanded) ? 'Collapse animation' : 'Expand animation'" @click="toggleTrackExpansion(groupedTracks)">
                                    <span v-if="groupedTracks.some(x => x.isExpanded)" class="icon-chevron-down" />
                                    <span v-else class="icon-chevron-right" />
                                </Button>
                            </div>
                            <div>
                                <Button text severity="secondary" @click="toggleTrackExpansion(groupedTracks)">
                                    {{ groupName }}
                                </Button>
                            </div>
                            <div>
                                <Button text severity="secondary" title="groupedTracks.some(x => x.isDisabled) ? 'Enable animation' : 'Disable animation'" @click="toggleTrackDisabledState(groupedTracks)">
                                    <span v-if="groupedTracks.some(x => x.isDisabled)" class="icon-radio-button-off" />
                                    <span v-else class="icon-radio-button-on" />
                                </Button>
                                <Button text severity="secondary" title="Select all animation keyframes" @click="selectTrackHandles(groupedTracks)">
                                    <span class="icon-edit" />
                                </Button>
                                <Button text severity="secondary" title="Show animation menu" @click="toggleTrackGroupMenu($event, groupName, groupedTracks)">
                                    <span class="icon-vertical-dots" />
                                </Button>
                            </div>
                        </div>
                        <template v-for="track in groupedTracks" :key="track">
                            <div v-if="track.isExpanded" class="track">
                                <div />
                                <div>{{ track.description }}</div>
                                <div>
                                    <Button text severity="secondary" title="track.isDisabled ? 'Enable animation property' : 'Disable animation property'" @click="toggleTrackDisabledState([track])">
                                        <span v-if="track.isDisabled" class="icon-radio-button-off" />
                                        <span v-else class="icon-radio-button-on" />
                                    </Button>
                                    <Button text severity="secondary" title="Select all animation property keyframes" @click="selectTrackHandles([track])">
                                        <span class="icon-edit" />
                                    </Button>
                                    <Button text severity="secondary" title="Show animation property menu" @click="toggleTrackMenu($event, track, groupedTracks)">
                                        <span class="icon-vertical-dots" />
                                    </Button>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
                <Menu ref="trackMenu" :model="trackMenu" :popup="true" />
            </div>
        </div>
        <div class="data">
            <div class="header">
                <Button class="icon-button" severity="secondary" title="Copy selected keyframes" @click="copy">
                    <span class="icon-content-copy" />
                </Button>
                <Button class="icon-button" severity="secondary" title="Paste copied keyframes" @click="paste">
                    <span class="icon-content-paste" />
                </Button>
                <Button class="icon-button mr-4" severity="secondary" title="Adjust animation duration" @click="adjustDuration">
                    <span class="icon-duration" />
                </Button>
                <Button class="icon-button" severity="secondary" title="Zoom in" @click="zoomIn">
                    <span class="icon-zoom-in" />
                </Button>
                <Button class="icon-button" severity="secondary" title="Zoom out" @click="zoomOut">
                    <span class="icon-zoom-out" />
                </Button>
                <Button class="icon-button" severity="secondary" title="Zoom to fit" @click="zoomToFit">
                    <span class="icon-zoom-to-fit" />
                </Button>
                <div class="ml-auto">
                    {{ time.milliSecondsToTimeSpanString() }}
                </div>
            </div>
            <div class="content" @pointerdown.passive="onPointerDown" @pointermove.passive="onPointerMove" @pointerup.passive="onPointerUp" @pointerleave.passive="onPointerLeave" @wheel.ctrl.prevent="onWheelCtrlScroll">
                <svg class="ruler">
                    <template v-for="rulerMark in rulerMarks" :key="rulerMark">
                        <text v-if="rulerMark.time !== ''" :x="rulerMark.x" y="12" :class="Number.isInteger(rulerMark.time) ? 'large' : 'small'">{{ rulerMark.time }}</text>
                        <line v-if="rulerMark.isVisible" :x1="rulerMark.x" :x2="rulerMark.x" y1="18" y2="25" :class="Number.isInteger(rulerMark.time) ? 'top large' : 'top small'" />
                        <line v-if="rulerMark.isVisible" :x1="rulerMark.x" :x2="rulerMark.x" y1="25" y2="100%" :class="Number.isInteger(rulerMark.time) ? 'background large' : 'background small'" />
                    </template>
                </svg>
                <div class="tracks">
                    <template v-for="(groupedTracks) in Object.groupBy(tracks, (track) => track.groupName)" :key="groupedTracks">
                        <div class="track">
                            <div class="bar" :style="{ left: `${getPositionInPx(getMinTime(groupedTracks))}`, width: `${getWidthInPx(getMaxTime(groupedTracks) - getMinTime(groupedTracks))}`, backgroundColor: getAverageColor(groupedTracks) }" />
                        </div>
                        <template v-for="track in groupedTracks" :key="track">
                            <div v-if="track.isExpanded" class="track">
                                <div v-for="bar in track.bars" :key="bar" class="bar" :style="{ left: `${getPositionInPx(bar.startTime)}`, width: `${getWidthInPx(bar.endTime - bar.startTime)}`, backgroundColor: track.color }">
                                    {{ bar.text }}
                                </div>
                                <div v-for="bar in getGroupBars(track)" :key="bar" class="bar loop" :style="{ left: `${getPositionInPx(bar.startTime)}`, width: `${getWidthInPx(bar.endTime - bar.startTime)}`, backgroundColor: track.color }">
                                    {{ bar.text }}
                                </div>
                                <template v-for="(groupedHandles) in Object.groupBy(track.handles, (handle) => handle.groupId)" :key="groupedHandles">
                                    <div class="bar" :style="{ left: `${getPositionInPx(groupedHandles[0].time)}`, width: `${getWidthInPx(groupedHandles[groupedHandles.length - 1].time - groupedHandles[0].time)}`, backgroundColor: track.color }" />
                                </template>
                                <div v-for="handle in track.handles" :key="handle" :data-handle-id="handle.id" :class="`handle${selectedTrackHandles.includes(handle) ? ' selected' : ''}`" :style="{ width: `${options.handle.size}px`, height: `${options.handle.size}px`, left: `${getPositionInPx(handle.time, options.handle.size / 2)}`, backgroundColor: track.color }" @pointerdown.prevent="() => {}" />
                            </div>
                        </template>
                    </template>
                    <svg v-if="indicatorPosition > 0 && indicatorPosition < rulerSize.width" :style="{ left: `${indicatorPosition}px` }" class="indicator">
                        <polygon points="5 26 3 29 2 29 0 26 0 19 5 19 5 26" />
                        <line x1="2.5" x2="2.5" y1="28" y2="100%" />
                    </svg>
                </div>
            </div>
        </div>
        <ColorSelector ref="colorSelector" />
        <DurationAdjuster ref="durationAdjuster" />
    </div>
</template>

<script>
    import ColorSelector from "./ColorSelector.vue";
    import DurationAdjuster from "./DurationAdjuster.vue";

    export default {
        components: {
            ColorSelector,
            DurationAdjuster
        },
        props: {
            tracks: {
                type: Array,
                default: () => []
            },
            selectedTrackHandles: {
                type: Array,
                default: () => []
            },
            time: {
                type: Number,
                default: 0
            }
        },
        emits: ["keyframeAnimationAdded", "pathAnimationAdded", "trackGroupDeleted", "tracksUpdated", "tracksDeleted", "trackMovedUp", "trackMovedDown", "trackGroupMovedUp", "trackGroupMovedDown", "trackHandlesUpdated", "trackHandlesPasted", "durationAdjusted", "timeUpdated"],
        data() {
            return {
                scale: 0.5,
                rulerSize: { left: 0, width: 0 },
                dataTracksScrollLeft: 0,
                dataTracksOffset: 10,
                trackMenu: [],
                options: {
                    indicator: {
                        width: 5
                    },
                    handle: {
                        size: 10
                    }
                }
            }
        },
        computed: {
            rulerWidthInMs() {
                const rulerWidthInMs = this.rulerSize.width / this.scale;
                return rulerWidthInMs;
            },
            rulerMarks() {
                let rulerMarks = [];
                const rulerStartInMs = Math.round(this.dataTracksScrollLeft / this.scale * 100) / 100;
                for (let rulerMarkInMs = rulerStartInMs; rulerMarkInMs < rulerStartInMs + this.rulerWidthInMs + 100; rulerMarkInMs += 100) {
                    let x = (rulerMarkInMs - rulerMarkInMs % 100) * this.scale + this.dataTracksOffset - this.dataTracksScrollLeft;
                    const time = Math.floor(rulerMarkInMs / 100) * 100;
                    rulerMarks.push({
                        x: x,
                        isVisible: this.scale < 0.2 ? time % 500 === 0 ? true : false : true,
                        time: this.scale < 0.3 ? time % 500 === 0 ? time / 1000 : "" : time / 1000
                    });
                }
                return rulerMarks;
            },
            indicatorPosition() {
                return this.time * this.scale - this.options.indicator.width / 2 + this.dataTracksOffset - this.dataTracksScrollLeft;
            }
        },
        mounted() {
            this.rulerSize = document.querySelector("svg.ruler").getBoundingClientRect();
            window.addEventListener("resize", (event) => {
                this.rulerSize = document.querySelector("svg.ruler").getBoundingClientRect();
            });

            const scrollHeight = document.querySelector(".timeline .data .tracks").offsetHeight - document.querySelector(".timeline .data .tracks").clientHeight;
            document.querySelector(".timeline .legend .tracks").style.paddingBottom = `${scrollHeight}px`;

            document.querySelector(".timeline .legend .tracks").addEventListener("scroll", (event) => {
                document.querySelector(".timeline .data .tracks").scrollTop = event.srcElement.scrollTop;
            }, { passive: true });
            document.querySelector(".timeline .data .tracks").addEventListener("scroll", (event) => {
                document.querySelector(".timeline .legend .tracks").scrollTop = event.srcElement.scrollTop;
                this.dataTracksScrollLeft = event.srcElement.scrollLeft;
            }, { passive: true });
        },
        methods: {
            copy() {
                if (this.selectedTrackHandles.length === 0) {
                    this.$toast.add({ severity: "error", summary: "No keyframes selected", detail: "Select keyframes before you can copy them", life: 3000 });
                } else {
                    this.copiedTrackHandles = JSON.parse(JSON.stringify(this.selectedTrackHandles));
                    this.$toast.add({ severity: "info", summary: "Keyframes copied", detail: "Keyframes copied to application clipboard", life: 3000 });
                }
            },
            paste() {
                if (!this.copiedTrackHandles) {
                    this.$toast.add({ severity: "error", summary: "Clipboard empty", detail: "Copy keyframes to the clipboard before you can paste them", life: 3000 });
                } else {
                    this.$emit("trackHandlesPasted", { handles: this.copiedTrackHandles });
                }
            },
            adjustDuration(event) {
                const currentDuration = this.getMaxTime(this.tracks)
                this.$refs.durationAdjuster.setOnDurationChangedCallback((newDuration) => {
                    if (newDuration !== currentDuration) {
                        this.$emit("durationAdjusted", { currentDuration: currentDuration, newDuration: newDuration });
                    }
                });
                this.$refs.durationAdjuster.toggle(event, currentDuration);
            },
            expandAllTracks() {
                this.tracks.forEach(track => {
                    track.isExpanded = true;
                });
                this.$emit("tracksUpdated", JSON.parse(JSON.stringify({ tracks: this.tracks })));
            },
            collapseAllTracks() {
                this.tracks.forEach(track => {
                    track.isExpanded = false;
                });
                this.$emit("tracksUpdated", JSON.parse(JSON.stringify({ tracks: this.tracks })));
            },
            toggleTrackExpansion(tracks) {
                tracks.forEach(track => {
                    track.isExpanded = !track.isExpanded;
                });
                this.$emit("tracksUpdated", JSON.parse(JSON.stringify({ tracks: tracks })));
            },
            toggleTrackDisabledState(tracks) {
                tracks.forEach(track => {
                    track.isDisabled = !track.isDisabled;
                });
                this.$emit("tracksUpdated", JSON.parse(JSON.stringify({ tracks: tracks })));
            },
            selectTrackHandles(tracks) {
                this.selectedTrackHandles.splice(0, this.selectedTrackHandles.length, ...tracks.flatMap(x => x.handles));
            },
            toggleTrackGroupMenu(event, trackGroupName, groupedTracks) {
                const target = event.currentTarget;
                this.trackMenu.splice(0);
                this.trackMenu.push({
                    label: "Add keyframe animation",
                    icon: "icon-keyframe",
                    command: () => {
                        this.$emit("keyframeAnimationAdded", { trackGroupName: trackGroupName });
                    }
                });
                this.trackMenu.push({
                    label: "Add path animation",
                    icon: "icon-path",
                    command: () => {
                        this.$emit("pathAnimationAdded", { trackGroupName: trackGroupName });
                    }
                });
                this.trackMenu.push({
                    label: "Change color",
                    icon: "icon-palette",
                    command: (event) => {
                        setTimeout(() => {
                            this.$refs.colorSelector.setOnColorSelectedCallback((color) => {
                                groupedTracks.forEach(track => {
                                    track.color = color;
                                });
                                this.$emit("tracksUpdated", JSON.parse(JSON.stringify({ tracks: groupedTracks })));
                            });
                            this.$refs.colorSelector.toggle({ currentTarget: target });
                        }, 0);
                    }
                });
                if (this.tracks.indexOf(groupedTracks[0]) > 0) {
                    this.trackMenu.push({
                        label: "Move up",
                        icon: "icon-arrow-up",
                        command: () => {
                            this.$emit("trackGroupMovedUp", { trackGroupName: trackGroupName });
                        }
                    });
                }
                if (this.tracks.indexOf(groupedTracks[groupedTracks.length - 1]) < this.tracks.length - 1) {
                    this.trackMenu.push({
                        label: "Move down",
                        icon: "icon-arrow-down",
                        command: () => {
                            this.$emit("trackGroupMovedDown", { trackGroupName: trackGroupName });
                        }
                    });
                }
                this.trackMenu.push({
                    label: "Delete",
                    icon: "icon-delete",
                    command: () => {
                        this.tracks.splice(0, this.tracks.length, ...this.tracks.filter(t => t.groupName !== trackGroupName));
                        this.$emit("trackGroupDeleted", { trackGroupNames: [trackGroupName] });
                    }
                });
                this.$refs.trackMenu.toggle(event);
            },
            toggleTrackMenu(event, track, groupedTracks) {
                const target = event.currentTarget;
                this.trackMenu.splice(0);
                this.trackMenu.push({
                    label: "Change color",
                    icon: "icon-palette",
                    command: (event) => {
                        setTimeout(() => {
                            this.$refs.colorSelector.setOnColorSelectedCallback((color) => {
                                track.color = color;
                                this.$emit("tracksUpdated", JSON.parse(JSON.stringify({ tracks: [track] })));
                            });
                            this.$refs.colorSelector.toggle({ currentTarget: target });
                        }, 0);
                    }
                });
                if (groupedTracks.indexOf(track) > 0) {
                    this.trackMenu.push({
                        label: "Move up",
                        icon: "icon-arrow-up",
                        command: () => {
                            this.$emit("trackMovedUp", { track: track });
                        }
                    });
                }
                if (groupedTracks.indexOf(track) < groupedTracks.length - 1) {
                    this.trackMenu.push({
                        label: "Move down",
                        icon: "icon-arrow-down",
                        command: () => {
                            this.$emit("trackMovedDown", { track: track });
                        }
                    });
                }
                this.trackMenu.push({
                    label: "Delete",
                    icon: "icon-delete",
                    command: () => {
                        this.tracks.splice(0, this.tracks.length, ...this.tracks.filter(t => t !== track));
                        this.$emit("tracksDeleted", { tracks: [track] });
                    }
                });
                this.$refs.trackMenu.toggle(event);
            },
            zoom(delta) {
                this.scale = Math.min(Math.max(this.scale - delta / 2000, 0.05), 1);
            },
            zoomIn() {
                this.zoom(-100);
            },
            zoomOut() {
                this.zoom(100);
            },
            zoomToFit() {
                this.scale = Math.min(Math.max(Math.floor(this.scale * (this.rulerWidthInMs / this.getMaxTime(this.tracks)) * 20) / 20, 0.05), 1);
            },
            getMinTime(tracks) {
                const min = tracks
                    .map(track => track.handles
                        .reduce((acc, handle) => { return acc === null || handle.time < acc ? handle.time : acc; }, null))
                    .reduce((acc, val) => { return acc < val ? acc : val; });
                return min;
            },
            getMaxTime(tracks) {
                let max = 0;
                tracks.forEach(track => {
                    track.handles.forEach(handle => {
                        if (handle.time > max) {
                            max = handle.time;
                        }
                    });

                    const groupIds = [...new Set(track.handles.map(handle => handle.groupId))];
                    groupIds.forEach(groupId => {
                        const group = track.groups.find(group => group.id === groupId);
                        if (group) {
                            if (group.options.iterations > 0) {
                                const handles = track.handles.filter(handle => handle.groupId === groupId);
                                const handlesLoopDuration = handles[handles.length - 1].time - handles[0].time;
                                const handlesLoopStart = handles[0].time;
                                let end = handlesLoopStart + group.options.iterations * handlesLoopDuration;
                                if (end > max) {
                                    max = end;
                                }
                            }
                        }
                    });
                });
                return max;
            },
            getGroupBars(track) {
                let bars = [];
                const groupIds = [...new Set(track.handles.map(handle => handle.groupId))];
                groupIds.forEach(groupId => {
                    const group = track.groups.find(group => group.id === groupId);
                    if (group) {
                        if (group.options.iterations > 0) {
                            const handles = track.handles.filter(handle => handle.groupId === groupId);
                            const handlesLoopDuration = handles[handles.length - 1].time - handles[0].time;
                            const handlesLoopStart = handles[0].time;
                            let start = handlesLoopStart;
                            for (var i = 2; i <= group.options.iterations; i++) {
                                start += handlesLoopDuration;
                                bars.push({ startTime: start, endTime: start + handlesLoopDuration, text: `${i}` });
                            }
                        }
                    }
                });
                return bars;
            },
            getPositionInPx(time, offset) {
                offset = offset ? offset : 0;
                return `${time * this.scale - offset + this.dataTracksOffset}px`;
            },
            getWidthInPx(duration) {
                return `${duration * this.scale}px`;
            },
            getAverageColor(tracks) {
                const averageTrackColor = tracks.reduce((acc, cur) => {
                    const color = this.parseColor(cur.color);
                    acc[0] += color[0];
                    acc[1] += color[1];
                    acc[2] += color[2];
                    return acc;
                }, [0, 0, 0]).map(x => Math.round(x / tracks.length));
                return `rgb(${averageTrackColor[0]}, ${averageTrackColor[1]}, ${averageTrackColor[2]})`;
            },
            parseColor(colorString) {
                const div = document.createElement("div");
                div.style.color = colorString;
                document.body.appendChild(div);
                const parsedColor = getComputedStyle(div).color.match(/[.\d]+/g).map(Number);
                document.body.removeChild(div);
                return parsedColor;
            },
            onPointerDown(event) {
                this.pointerDownPosition = { x: event.x, y: event.y };
                this.pointerMovePreviousPosition = { x: event.x, y: event.y };
                this.handleMovementAccumulator = 0;

                const elementsAtPointerPosition = document.elementsFromPoint(event.x, event.y);

                const handleElements = elementsAtPointerPosition.filter(x => x.classList.contains("handle"));
                if (handleElements.length > 0) {
                    const handles = this.tracks.map(track => track.handles).flat().filter(handle => handleElements.map(x => x.getAttribute("data-handle-id")).includes(handle.id));
                    if (this.selectedTrackHandles.some(x => handles.some(y => y.id === x.id))) {
                        this.pointerAction = "moveHandle";
                    } else {
                        this.pointerAction = "selectHandle";
                    }
                }
                else {
                    const indicatorElements = elementsAtPointerPosition.filter(x => x.classList.contains("indicator"));
                    if (indicatorElements.length > 0) {
                        this.pointerAction = "moveIndicator";
                    } else {
                        this.pointerAction = "selectIndicator";
                    }
                }
            },
            onPointerMove(event) {
                if (this.pointerAction === "moveHandle") {
                    this.handleMovementAccumulator += (event.x - this.pointerMovePreviousPosition.x) / this.scale;
                    if (Math.abs(this.handleMovementAccumulator) > 100) {
                        this.selectedTrackHandles.forEach(handle => {
                            handle.time += this.handleMovementAccumulator > 0 ? 100 : -100;
                        });
                        this.handleMovementAccumulator = 0;
                        this.$emit("trackHandlesUpdated", { handles: this.selectedTrackHandles });
                    }
                } else if (this.pointerAction === "moveIndicator") {
                    let timeInMs = (event.x - this.rulerSize.left - this.dataTracksOffset + this.dataTracksScrollLeft) / this.scale;
                    if (timeInMs < 0) {
                        timeInMs = 0;
                    }
                    const roundedTimeInMs = Math.round(timeInMs / 50) * 50;
                    this.$emit("timeUpdated", { time: roundedTimeInMs });
                }
                this.pointerMovePreviousPosition = { x: event.x, y: event.y };
            },
            onPointerUp(event) {
                if (this.pointerAction === "selectHandle" && this.pointerDownPosition && this.pointerDownPosition.x === event.x && this.pointerDownPosition.y === event.y) {
                    const handleElements = document.elementsFromPoint(event.x, event.y).filter(x => x.className === "handle");
                    if (handleElements.length > 0) {
                        const handles = this.tracks.map(track => track.handles).flat().filter(handle => handleElements.map(x => x.getAttribute("data-handle-id")).includes(handle.id));
                        if (event.ctrlKey) {
                            this.selectedTrackHandles.push(...handles);
                        } else {
                            this.selectedTrackHandles.splice(0, this.selectedTrackHandles.length, ...handles);
                        }
                    }
                } else if (this.pointerAction === "selectIndicator" && this.pointerDownPosition && this.pointerDownPosition.x === event.x && this.pointerDownPosition.y === event.y) {
                    this.selectedTrackHandles.splice(0);

                    const timeInMs = (event.x - this.rulerSize.left - this.dataTracksOffset + this.dataTracksScrollLeft) / this.scale;
                    const roundedTimeInMs = Math.round(timeInMs / 50) * 50;
                    this.$emit("timeUpdated", { time: roundedTimeInMs });
                }
                this.pointerAction = null;
            },
            onPointerLeave(event) {
                this.pointerAction = null;
            },
            onWheelCtrlScroll(event) {
                this.zoom(event.deltaY);
            }
        }
    }
</script>

<style lang="scss">
    .timeline {
        display: flex;
        height: 100%;

        .header {
            display: flex;
            height: 28px;
            margin-bottom: 5px;
            justify-content: space-between;
            align-items: center;
            gap: 5px;
        }

        .content {
            position: relative;
            height: calc(100% - 35px);
            padding-top: 28px;
        }

        .tracks {
            height: 100%;
            overflow: auto;

            .track {
                display: flex;
                align-items: center;
                height: 20px;
            }
        }

        .legend {
            width: 200px;
            padding-right: 5px;

            .tracks {
                scrollbar-width: none;

                &::-webkit-scrollbar {
                    display: none;
                }

                .track {
                    justify-content: space-between;

                    .p-button {
                        display: block;
                        height: 16px;
                        line-height: 16px;
                        padding: 0;
                    }

                    div:nth-child(1) {
                        width: 24px;
                        min-width: 24px;

                        .p-button {
                            width: 100%;
                        }
                    }

                    div:nth-child(2) {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-right: 5px;

                        .p-button {
                        }
                    }

                    div:nth-child(3) {
                        display: flex;
                        gap: 5px;
                        margin-left: auto;

                        .p-button {
                            width: 16px;
                            min-width: 16px;
                            font-size: 16px;
                        }
                    }
                }
            }
        }

        .data {
            width: calc(100% - 200px);

            .header {
                margin-left: 10px;
            }

            svg.ruler {
                position: absolute;
                top: 0;
                min-width: calc(100% - 20px);
                height: calc(100% - 20px);
                pointer-events: none;

                text {
                    fill: #D5D5D5;
                    text-anchor: middle;
                    font-size: 11px;
                }

                text.small {
                    opacity: 0.5;
                }

                line {
                    stroke-width: 2px;
                }

                line.top {
                    stroke: #D5D5D5;
                }

                line.top.small {
                    opacity: 0.5;
                }

                line.background {
                    stroke: #808080;
                    opacity: 0.3;
                }

                line.background.small {
                    opacity: 0.1;
                }
            }

            .tracks {
                overflow-x: scroll;

                .track {
                    position: relative;
                    min-width: 100%;
                }

                .bar {
                    position: absolute;
                    height: 16px;
                    border-radius: 2px;
                    line-height: 16px;
                    font-size: 8px;
                    text-align: center;
                    user-select: none;
                    color: var(--blue-200);

                    &.loop {
                        opacity: 0.6;
                    }
                }

                .handle {
                    position: absolute;
                    border-radius: 2px;
                    cursor: pointer;

                    &:after {
                        display: block;
                        content: "";
                        border-radius: 2px;
                        background-color: #ffffff;
                        opacity: 0.5;
                        height: 100%;
                    }

                    &.selected:after {
                        opacity: 0.8;
                    }
                }

                svg.indicator {
                    position: absolute;
                    top: 0;
                    width: 5px;
                    height: calc(100% - 20px);

                    &:hover {
                        cursor: ew-resize;
                    }

                    polygon {
                        fill: #eab308;
                    }

                    line {
                        stroke: #eab308;
                        stroke-width: 1.5px;
                    }
                }
            }
        }
    }
</style>
