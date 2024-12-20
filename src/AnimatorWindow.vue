<template>
    <div class="navigation">
        <Menubar :model="menuItems" breakpoint="320px">
            <template #item="{ item, props, root }">
                <a v-if="item.url" :href="item.url" :target="item.target" v-bind="props.action" class="flex align-items-center gap-2">
                    <span v-if="!root" :class="`icon ${item.icon}`" />
                    <span>{{ item.label }}</span>
                    <span v-if="item.shortcut" class="shortcut ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
                </a>
                <a v-else v-bind="props.action" class="flex align-items-center gap-2">
                    <span v-if="!root" :class="`icon ${item.icon}`" />
                    <span>{{ item.label }}</span>
                    <span v-if="item.shortcut" class="shortcut ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
                </a>
            </template>
        </Menubar>
    </div>
    <Splitter class="editor" layout="vertical" state-key="layout-1" state-storage="local">
        <SplitterPanel :size="60">
            <Splitter class="main" state-key="layout-2" state-storage="local" @resizestart="onSplitterResizeStart" @resizeend="onSplitterResizeEnd">
                <SplitterPanel class="nodes-panel" :size="20">
                    <SceneNodeTree ref="sceneNodeTree" v-model="selectedSceneNode" />
                </SplitterPanel>
                <SplitterPanel class="scene-panel" :size="60">
                    <component :is="sceneViewer" ref="sceneViewer" v-model="selectedSceneNode" :scroll-event-options="sceneViewerOptions" @scroll-progress="onHtmlScrollProgress" />
                </SplitterPanel>
                <SplitterPanel class="properties-panel" :size="20">
                    <div class="properties">
                        <SceneNodeProperties :scene-node="selectedSceneNode" @add-keyframe-animation-click="onAddKeyframeAnimationClick($event, 'regular')" @add-path-animation-click="onAddKeyframeAnimationClick($event, 'path')" />
                        <AnimationEditor ref="animationEditor" @added="onAnimationsAdded" @updated="onAnimationsUpdated" @canceled="onAnimationEditorCanceled" />
                    </div>
                </SplitterPanel>
            </Splitter>
        </SplitterPanel>
        <SplitterPanel class="timeline-panel" :size="40">
            <TimelineEditor
                ref="timelineEditor"
                :tracks="timelineTracks"
                :selected-track-handles="selectedTimelineTrackHandles"
                :time="timelineTime"
                @keyframe-animation-added="onTimelineKeyframeAnimationAdded"
                @path-animation-added="onTimelinePathAnimationAdded"
                @track-group-deleted="onTimelineTrackGroupDeleted"
                @tracks-updated="onTimelineTracksUpdated"
                @tracks-deleted="onTimelineTracksDeleted"
                @track-moved-up="onTimelineTrackMovedUp"
                @track-moved-down="onTimelineTrackMovedDown"
                @track-group-moved-up="onTimelineTrackGroupMovedUp"
                @track-group-moved-down="onTimelineTrackGroupMovedDown"
                @track-handles-updated="onTimelineTrackHandlesUpdated"
                @track-handles-pasted="onTimelineTrackHandlesPasted"
                @duration-adjusted="onTimelineDurationAdjusted"
                @time-updated="onTimelineTimeUpdated"
            >
                <template #timelineLegendHeaderItems>
                    <Button :disabled="timelineTime === 0" class="icon-button" severity="secondary" title="Set time to 0" @click="onResetTimeClick">
                        <span class="icon-skip-previous" />
                    </Button>
                    <Button class="icon-button" severity="secondary" :title="isAnimationPlaying ? 'Pause' : 'Play'" @click="onPlayPauseClick">
                        <span v-if="isAnimationPlaying" class="icon-pause" />
                        <span v-else class="icon-play" />
                    </Button>
                    <Button class="icon-button" severity="secondary" :title="isAnimationRepeating ? 'Switch repeat off' : 'Switch repeat on'" @click="onRepeatClick">
                        <span v-if="isAnimationRepeating" class="icon-repeat-on" />
                        <span v-else class="icon-repeat-off" />
                    </Button>
                </template>
            </TimelineEditor>
        </SplitterPanel>
    </Splitter>
    <AnimationExportDialog ref="animationExportDialog" />
    <AnimationScriptMetadataDialog ref="animationScriptMetadataDialog" @primary-button-clicked="onSaveAnimationScriptMetadata" />
</template>

<script>
    import { markRaw } from "vue";
    import AddAnimationsCommand from "./animationState/AddAnimationsCommand.js";
    import AnimationEditor from "./editors/AnimationEditor.vue";
    import animationEngine from "./AnimationEngine.js";
    import AnimationExportDialog from "./dialogs/AnimationExportDialog.vue";
    import AnimationScript from "./AnimationScript.js";
    import AnimationScriptMetadataDialog from "./dialogs/AnimationScriptMetadataDialog.vue";
    import AnimationState from "./animationState/AnimationState.js";
    import DeleteAnimationCommand from "./animationState/DeleteAnimationCommand.js";
    import DeleteAnimationPropertyCommand from "./animationState/DeleteAnimationPropertyCommand.js";
    import EasingSelector from "./editors/EasingSelector.vue";
    import HtmlHelper from "./shared/HtmlHelper.js";
    import LoadAnimationScriptCommand from "./animationState/LoadAnimationScriptCommand.js";
    import MoveAnimationDownCommand from "./animationState/MoveAnimationDownCommand.js";
    import MoveAnimationPropertyDownCommand from "./animationState/MoveAnimationPropertyDownCommand.js";
    import MoveAnimationPropertyUpCommand from "./animationState/MoveAnimationPropertyUpCommand.js";
    import MoveAnimationUpCommand from "./animationState/MoveAnimationUpCommand.js";
    import PasteAnimationKeyframesCommand from "./animationState/PasteAnimationKeyframesCommand.js";
    import RandomIds from "./shared/RandomIds.js";
    import Scene from "./Scene.js";
    import SceneHtmlViewer from "./SceneHtmlViewer.vue";
    import SceneNodeProperties from "./SceneNodeProperties.vue";
    import SceneNodeTree from "./SceneNodeTree.vue";
    import SceneSvgViewer from "./SceneSvgViewer.vue";
    import TimelineEditor from "./editors/TimelineEditor.vue";
    import UpdateAnimationDurationCommand from "./animationState/UpdateAnimationDurationCommand.js";
    import UpdateAnimationPropertyMetadataCommand from "./animationState/UpdateAnimationPropertyMetadataCommand.js";
    import UpdateAnimationsCommand from "./animationState/UpdateAnimationsCommand.js";
    import UpdateAnimationScriptMetadataCommand from "./animationState/UpdateAnimationScriptMetadataCommand.js";
    import UpdateAnimationTimingsCommand from "./animationState/UpdateAnimationTimingsCommand.js";

    export default {
        components: {
            AnimationEditor,
            AnimationExportDialog,
            AnimationScriptMetadataDialog,
            EasingSelector,
            SceneHtmlViewer,
            SceneNodeProperties,
            SceneNodeTree,
            SceneSvgViewer,
            TimelineEditor
        },
        data() {
            return {
                menuItems: [{
                    label: "File",
                    items: [{
                        label: "Load scene...",
                        command: async () => {
                            try {
                                const [fileHandle] = await window.showOpenFilePicker({
                                    types: [{
                                        accept: {
                                            "text/html": [".html"],
                                            "image/svg+xml": [".svg"]
                                        }
                                    }
                                    ]
                                });
                                const file = await fileHandle.getFile();
                                const fileContent = await file.text()
                                this.onSceneFileOpened({ data: fileContent, name: file.name });
                            } catch(error) {
                                if(error.name !== "AbortError") {
                                    this.$toast.add({ severity: "error", summary: "Scene loading error", detail: "There was an error while loading the scene.", life: 3000 });
                                }
                            }
                        }
                    }, {
                        separator: true
                    }, {
                        label: "New script",
                        command: () => {
                            localStorage.removeItem("animationScript");
                            localStorage.removeItem("animationScriptFilename");
                            AnimationState.reset();
                        }
                    }, {
                        label: "Load script...",
                        command: async () => {
                            try {
                                const [fileHandle] = await window.showOpenFilePicker({
                                    types: [{
                                        accept: {
                                            "application/json": [".htani"]
                                        }
                                    }
                                    ]
                                });
                                const file = await fileHandle.getFile();
                                const fileContent = await file.text()
                                this.onAnimationScriptFileOpened({ data: fileContent, name: file.name });
                            } catch(error) {
                                if(error.name !== "AbortError") {
                                    this.$toast.add({ severity: "error", summary: "Script loading error", detail: "There was an error while loading the script.", life: 3000 });
                                }
                            }
                        }
                    }, {
                        label: "Save script...",
                        command: async () => {
                            const blob = new Blob([localStorage.getItem("animationScript")], { type: "text/plain;charset=utf-8" });
                            try {
                                const fileHandle = await window.showSaveFilePicker({
                                    suggestedName: localStorage.getItem("animationScriptFilename") ? localStorage.getItem("animationScriptFilename") : "unnamed.htani"
                                });
                                const writableStream = await fileHandle.createWritable();
                                await writableStream.write(blob);
                                await writableStream.close();
                            } catch { }
                        }
                    }, {
                        label: "Copy script to clipboard",
                        command: async () => {
                            await navigator.clipboard.writeText(localStorage.getItem("animationScript"));
                            this.$toast.add({ severity: "info", summary: "Script copied", detail: "Script copied to clipboard", life: 3000 });
                        }
                    }, {
                        separator: true
                    }, {
                        label: "Export animation...",
                        command: () => {
                            const sceneType = localStorage.getItem("sceneType");
                            const sceneMarkup = localStorage.getItem("sceneMarkup");
                            if (!sceneType || !sceneMarkup) {
                                this.$toast.add({ severity: "error", summary: "Animation export error", detail: "Load a scene first", life: 3000 });
                                return;
                            }
                            let animationScriptFilename = localStorage.getItem("animationScriptFilename");
                            if (!animationScriptFilename) {
                                animationScriptFilename = "unnamed.htani";
                            }
                            const animationName = animationScriptFilename.replace(/\.[^/.]+$/, "");
                            this.$refs.animationExportDialog.show(sceneType, sceneMarkup, this.animationScript, animationName);
                        }
                    }]
                }, {
                    label: "Edit",
                    items: [{
                        label: "Undo",
                        icon: "icon-undo",
                        shortcut: "CTRL+Z",
                        command: () => { AnimationState.undo(); }
                    }, {
                        label: "Redo",
                        icon: "icon-redo",
                        shortcut: "CTRL+Y",
                        command: () => { AnimationState.redo(); }
                    }]
                }, {
                    label: "Animation",
                    items: [{
                        label: "Add keyframe animation",
                        icon: "icon-keyframe",
                        command: () => { this.addAnimation(null, null, "regular"); }
                    }, {
                        label: "Add path animation",
                        icon: "icon-path",
                        command: () => { this.addAnimation(null, null, "path"); }
                    }, {
                        separator: true
                    }, {
                        label: "Properties...",
                        command: () => {
                            const sceneType = localStorage.getItem("sceneType");
                            this.$refs.animationScriptMetadataDialog.show(sceneType, this.animationScript.metadata);
                        }
                    }]
                }, {
                    label: "Help",
                    items: [{
                        label: "Getting started",
                        url: "https://github.com/html-animator/web-app/blob/main/GETTING-STARTED.md",
                        target: "_blank"
                    }, {
                        label: "Examples",
                        url: "https://github.com/html-animator/web-app/blob/main/EXAMPLES.md",
                        target: "_blank"
                    }, {
                        label: "About",
                        url: "https://github.com/html-animator/web-app",
                        target: "_blank"
                    }]
                }],
                selectedSceneNode: null,
                sceneViewer: null,
                sceneViewerOptions: {},
                animationScript: {
                    metadata: {
                        timeline: {}
                    },
                    animations: []
                },
                animationsWatcherSkipSceneReload: false,
                animationsWatcherSkipTimelineUpdate: false,
                timelineTracks: [],
                selectedTimelineTrackHandles: [],
                timelineTime: 0,
                isAnimationPlaying: false,
                isAnimationRepeating: false,
            }
        },
        watch: {
            selectedSceneNode(element) {
                if (element) {
                    this.selectedTimelineTrackHandles.splice(0);
                }
            },
            animationScript: {
                async handler(animationScript) {
                    if (this.animationsWatcherSkipSceneReload) {
                        this.animationsWatcherSkipSceneReload = false;
                    } else {
                        const sceneType = localStorage.getItem("sceneType");
                        const sceneMarkup = localStorage.getItem("sceneMarkup");
                        if (sceneType && sceneMarkup) {
                            await this.$refs.sceneViewer.loadScene(sceneMarkup);
                            this.$refs.sceneNodeTree.loadNodes(sceneType);
                        }
                    }

                    const nonReactiveAnimationScript = JSON.parse(JSON.stringify(animationScript));
                    const animationScriptJson = AnimationScript.serializeAnimationScript(nonReactiveAnimationScript);
                    localStorage.setItem("animationScript", animationScriptJson);

                    this.sceneViewerOptions = {
                        raiseScrollProgressEvents: nonReactiveAnimationScript.metadata.timeline.type === "ScrollProgressTimeline",
                        raiseViewProgressEvents: nonReactiveAnimationScript.metadata.timeline.type === "ViewProgressTimeline",
                        scrollerElementSelector: nonReactiveAnimationScript.metadata.timeline.scrollerElementSelector,
                        subjectElementSelector: nonReactiveAnimationScript.metadata.timeline.subjectElementSelector
                    };

                    animationEngine.loadAnimations(nonReactiveAnimationScript.animations);
                    animationEngine.seek(this.timelineTime);

                    if (this.animationsWatcherSkipTimelineUpdate) {
                        this.animationsWatcherSkipTimelineUpdate = false;
                    } else {
                        let tracks = [];
                        nonReactiveAnimationScript.animations.forEach(animation => {
                            animation.properties.forEach(property => {
                                let track = {
                                    groupName: animation.targets,
                                    title: animation.targets,
                                    description: property.name,
                                    isDisabled: property.metadata.isDisabled,
                                    isExpanded: property.metadata.isExpanded,
                                    color: property.metadata.color ? property.metadata.color : "rgb(51, 153, 255)",
                                    metadata: {
                                        propertyId: property.id
                                    },
                                    bars: [],
                                    handles: [],
                                    groups: []
                                };

                                property.keyframes.forEach(keyframe => {
                                    track.handles.push({ time: keyframe.time, id: keyframe.id, groupId: keyframe.groupId });
                                });

                                for (const [groupId, groupOptions] of Object.entries(property.keyframeGroups)) {
                                    track.groups.push({ id: groupId, options: groupOptions });
                                }

                                tracks.push(track);
                            });
                        });
                        this.timelineTracks = tracks;
                    }
                },
                deep: true
            },
            selectedTimelineTrackHandles: {
                handler(value) {
                    if (value.length > 0) {
                        this.selectedSceneNode = null;
                    }

                    let animations = JSON.parse(JSON.stringify(this.animationScript.animations));
                    let unselectedAnimationIds = [];
                    animations.forEach(animation => {
                        let unselectedPropertyIds = [];
                        animation.properties.forEach(property => {
                            const groupIds = property.keyframes.filter(keyframe => value.some(x => x.id == keyframe.id)).map(keyframe => keyframe.groupId);
                            property.keyframes = property.keyframes.filter(keyframe => groupIds.some(x => x === keyframe.groupId));
                            if (property.keyframes.length === 0) {
                                unselectedPropertyIds.push(property.id);
                            }
                        });
                        animation.properties = animation.properties.filter(property => !unselectedPropertyIds.includes(property.id));
                        if (animation.properties.length === 0) {
                            unselectedAnimationIds.push(animation.id);
                        }
                    });
                    animations = animations.filter(animation => !unselectedAnimationIds.includes(animation.id));
                    this.$refs.animationEditor.showUpdate(animations, value.map(x => x.id));
                },
                deep: true
            }
        },
        async mounted() {
            let urlParams = new URLSearchParams(window.location.search);
            const sceneUrl = urlParams.get("sceneUrl");
            const scriptUrl = urlParams.get("scriptUrl");
            if (sceneUrl) {
                const response = await fetch(`${window.location.protocol}//${window.location.host}${sceneUrl}`);
                let responseContent = await response.text();
                responseContent = HtmlHelper.injectBaseUrl(responseContent, `${window.location.protocol}//${window.location.host}${sceneUrl}`);
                const scene = Scene.loadScene(responseContent);
                localStorage.setItem("sceneType", scene.type);
                localStorage.setItem("sceneMarkup", scene.markup);
            }
            if (scriptUrl) {
                const response = await fetch(`${window.location.protocol}//${window.location.host}${scriptUrl}`);
                const responseContent = await response.text();
                localStorage.setItem("animationScriptFilename", "animation.htani");
                localStorage.setItem("animationScript", responseContent);
            }

            const sceneType = localStorage.getItem("sceneType");
            const sceneMarkup = localStorage.getItem("sceneMarkup");
            await this.loadScene(sceneType, sceneMarkup);

            animationEngine.setSceneType(sceneType);
            animationEngine.setUpdateCallback((timeline) => {
                if (this.isAnimationPlaying) {
                    const timeInMs = Math.round(timeline.duration * timeline.progress / 100);
                    this.timelineTime = timeInMs;
                }
            });
            animationEngine.setCompleteCallback((timeline) => {
                if (this.isAnimationRepeating && this.isAnimationPlaying) {
                    animationEngine.play();
                } else {
                    this.isAnimationPlaying = false;
                }
            });

            AnimationState.init(this.animationScript);
            document.onkeydown = function (event) {
                if (!(event.target instanceof HTMLInputElement)) {
                    if (event.ctrlKey && !event.repeat) {
                        if (event.code === "KeyY") {
                            AnimationState.undo();
                        } else if (event.code === "KeyZ") {
                            AnimationState.redo();
                        }
                    }
                }
            };
            const animationScriptJson = localStorage.getItem("animationScript");
            if (animationScriptJson) {
                this.animationsWatcherSkipSceneReload = true;
                const animationScript = AnimationScript.deserializeAnimationScript(animationScriptJson);
                AnimationState.applyCommand(new LoadAnimationScriptCommand(animationScript));
                this.$nextTick(() => {
                    this.$refs.timelineEditor.zoomToFit();
                });
            }
        },
        methods: {
            async loadScene(sceneType, sceneMarkup) {
                if (sceneType === "svg") {
                    this.sceneViewer = markRaw(SceneSvgViewer);
                } else if (sceneType === "html") {
                    this.sceneViewer = markRaw(SceneHtmlViewer);
                }
                const promise = new Promise((resolve) => {
                    this.$nextTick(async () => {
                        if (sceneType && sceneMarkup) {
                            await this.$refs.sceneViewer.loadScene(sceneMarkup);
                            this.$refs.sceneNodeTree.loadNodes(sceneType);
                        }
                        resolve();
                    });
                });
                return promise;
            },
            addAnimation(animationTargets, propertyName, keyframeType) {
                this.selectedSceneNode = null;

                const groupId = RandomIds.generateId();
                const animation = {
                    id: RandomIds.generateId(),
                    targets: animationTargets,
                    defaults: {
                        easing: "linear"
                    },
                    properties: [{
                        id: RandomIds.generateId(),
                        metadata: {
                            isDisabled: false,
                            isExpanded: true,
                            color: null
                        },
                        name: propertyName,
                        keyframes: [{
                            id: RandomIds.generateId(),
                            type: keyframeType,
                            pathSelector: null,
                            pathProperty: null,
                            value: keyframeType === "path" ? "0" : null,
                            time: 0,
                            easing: null,
                            groupId: groupId
                        }, {
                            id: RandomIds.generateId(),
                            type: keyframeType,
                            pathSelector: null,
                            pathProperty: null,
                            value: keyframeType === "path" ? "100" : null,
                            time: 1000,
                            easing: null,
                            groupId: groupId
                        }],
                        keyframeGroups: {}
                    }]
                };
                this.$refs.animationEditor.showAdd([animation]);
            },
            async onSceneFileOpened(file) {
                try {
                    const scene = Scene.loadScene(file.data);
                    localStorage.setItem("sceneType", scene.type);
                    localStorage.setItem("sceneMarkup", scene.markup);
                    await this.loadScene(scene.type, scene.markup);

                    animationEngine.setSceneType(scene.type);
                    animationEngine.loadAnimations(JSON.parse(JSON.stringify(this.animationScript.animations)));
                } catch (error) {
                    this.$toast.add({ severity: "error", summary: "Scene loading error", detail: `Unable to load the scene file: ${error}`, life: 3000 });
                }
            },
            onAnimationScriptFileOpened(file) {
                try {
                    const animationScript = AnimationScript.deserializeAnimationScript(file.data);
                    AnimationState.applyCommand(new LoadAnimationScriptCommand(animationScript));
                    localStorage.setItem("animationScriptFilename", file.name);
                    this.timelineTime = 0;
                    this.$nextTick(() => {
                        this.$refs.timelineEditor.zoomToFit();
                    });
                } catch (error) {
                    this.$toast.add({ severity: "error", summary: "Script loading error", detail: `Unable to load the animation script: ${error}`, life: 3000 });
                }
            },
            onSaveAnimationScriptMetadata(event) {
                AnimationState.applyCommand(new UpdateAnimationScriptMetadataCommand(event));
            },
            onResetTimeClick(evnet) {
                this.timelineTime = 0;
                animationEngine.seek(0);
            },
            onPlayPauseClick(event) {
                if (this.isAnimationPlaying) {
                    animationEngine.pause();
                } else {
                    animationEngine.play();
                }
                this.isAnimationPlaying = !this.isAnimationPlaying;
            },
            onRepeatClick(event) {
                this.isAnimationRepeating = !this.isAnimationRepeating;
            },
            onTimelineKeyframeAnimationAdded(event) {
                this.animationsWatcherSkipSceneReload = true;
                this.addAnimation(event.trackGroupName, null, "regular");
            },
            onTimelinePathAnimationAdded(event) {
                this.animationsWatcherSkipSceneReload = true;
                this.addAnimation(event.trackGroupName, null, "path");
            },
            onTimelineTrackGroupDeleted(event) {
                this.animationsWatcherSkipTimelineUpdate = true;
                AnimationState.applyCommand(new DeleteAnimationCommand(event.trackGroupNames));
            },
            onTimelineTracksUpdated(event) {
                this.animationsWatcherSkipTimelineUpdate = true;
                AnimationState.applyCommand(new UpdateAnimationPropertyMetadataCommand(event.tracks.map(track => ({ propertyId: track.metadata.propertyId, isDisabled: track.isDisabled, isExpanded: track.isExpanded, color: track.color }))));
            },
            onTimelineTracksDeleted(event) {
                this.animationsWatcherSkipTimelineUpdate = true;
                AnimationState.applyCommand(new DeleteAnimationPropertyCommand(event.tracks.map(track => track.metadata.propertyId)));
            },
            onTimelineTrackMovedUp(event) {
                AnimationState.applyCommand(new MoveAnimationPropertyUpCommand(event.track.metadata.propertyId));
            },
            onTimelineTrackMovedDown(event) {
                AnimationState.applyCommand(new MoveAnimationPropertyDownCommand(event.track.metadata.propertyId));
            },
            onTimelineTrackGroupMovedUp(event) {
                this.animationsWatcherSkipSceneReload = true;
                AnimationState.applyCommand(new MoveAnimationUpCommand(event.trackGroupName));
            },
            onTimelineTrackGroupMovedDown(event) {
                this.animationsWatcherSkipSceneReload = true;
                AnimationState.applyCommand(new MoveAnimationDownCommand(event.trackGroupName));
            },
            onTimelineTrackHandlesUpdated(event) {
                this.animationsWatcherSkipSceneReload = true;
                this.animationsWatcherSkipTimelineUpdate = true;
                AnimationState.applyCommand(new UpdateAnimationTimingsCommand(event.handles));
            },
            onTimelineTrackHandlesPasted(event) {
                this.animationsWatcherSkipSceneReload = true;
                AnimationState.applyCommand(new PasteAnimationKeyframesCommand(this.timelineTime, event.handles));
            },
            onTimelineDurationAdjusted(event) {
                this.animationsWatcherSkipSceneReload = true;
                AnimationState.applyCommand(new UpdateAnimationDurationCommand(event.newDuration / event.currentDuration));
            },
            onTimelineTimeUpdated(event) {
                if (!this.isAnimationPlaying) {
                    this.timelineTime = event.time;
                    animationEngine.seek(event.time);
                }
            },
            onAddKeyframeAnimationClick(event, keyframeType) {
                this.addAnimation(event.animationTargets, event.propertyName, keyframeType)
            },
            onAnimationsAdded(event) {
                AnimationState.applyCommand(new AddAnimationsCommand(event.newAnimations));
                this.selectedTimelineTrackHandles.splice(0);
            },
            onAnimationsUpdated(event) {
                AnimationState.applyCommand(new UpdateAnimationsCommand(event.updatedAnimations, event.deletedAnimationKeyframeIds));
                this.selectedTimelineTrackHandles.splice(0);
            },
            onAnimationEditorCanceled(event) {
                this.selectedTimelineTrackHandles.splice(0);
            },
            onSplitterResizeStart(event) {
                if (this.$refs.sceneViewer) {
                    this.$refs.sceneViewer.startResize();
                }
            },
            onSplitterResizeEnd(event) {
                if (this.$refs.sceneViewer) {
                    this.$refs.sceneViewer.endResize();
                }
            },
            onHtmlScrollProgress(event) {
                if (!this.isAnimationPlaying && true) {
                    const timeInMs = Math.round(event.percentage / 100 * animationEngine.getDuration());
                    this.timelineTime = timeInMs;
                    animationEngine.seek(timeInMs);
                }
            }
        }
    }
</script>
