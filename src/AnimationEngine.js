import anime from "./anime.js";
import AnimationHelper from "./AnimationHelper.js";

export default {
    timeline: anime.timeline({
        autoplay: false
    }),
    cache: {},
    animationDocument: document,
    setSceneType(sceneType) {
        if (sceneType === "html") {
            const iframeDocument = document.querySelector("iframe").contentWindow.document;
            anime.setAnimationDocument(iframeDocument);
            this.animationDocument = iframeDocument;
        } else {
            anime.setAnimationDocument(document);
            this.animationDocument = document;
        }
    },
    setUpdateCallback: function (callback) {
        this.timeline.update = callback;
    },
    setCompleteCallback: function (callback) {
        this.timeline.complete = callback;
    },
    seek: function (positionInMs) {
        this.timeline.seek(positionInMs);
    },
    getDuration: function () {
        return this.timeline.duration;
    },
    play: function () {
        this.timeline.play();
    },
    pause: function () {
        this.timeline.pause();
    },
    loadAnimations: function (animations) {
        this.timeline.children.splice(0);
        this.cache = {};
        AnimationHelper.clearPathSegment(this.animationDocument, "#htmlanimator-helpers");

        animations.forEach(animation => {
            let animeOptions = {
                targets: animation.targets,
                easing: animation.defaults.easing
            };
            let isAnimationValid = true;
            const enabledAnimationProperties = animation.properties.filter(property => !property.metadata.isDisabled);
            enabledAnimationProperties.forEach(property => {
                try {
                    animeOptions[property.name] = [];
                    if (property.keyframes.length > 1) {
                        let keyframeDelay = property.keyframes[0].time;
                        for (let i = 0; i < property.keyframes.length - 1; i++) {
                            if (property.keyframes[i].type === property.keyframes[i + 1].type && property.keyframes[i].value !== property.keyframes[i + 1].value) {
                                if (property.keyframes[i].type === "regular") {
                                    let value = null;
                                    if (property.name === "strokeDashoffset") {
                                        value = [anime.setDashoffset, 0];
                                    } else {
                                        value = [property.keyframes[i].value, property.keyframes[i + 1].value];
                                    }
                                    animeOptions[property.name].push({
                                        value: value,
                                        duration: property.keyframes[i + 1].time - property.keyframes[i].time,
                                        delay: keyframeDelay,
                                        easing: property.keyframes[i].easing ? property.keyframes[i].easing : undefined
                                    });
                                } else if (property.keyframes[i].type === "path") {
                                    const animationPathKey = `path-${property.keyframes[i].pathSelector}-${property.keyframes[i].value}-${property.keyframes[i + 1].value}`;

                                    let animationPath = this.cache[animationPathKey];
                                    if (!animationPath) {
                                        const fromInPercent = parseFloat(property.keyframes[i].value);
                                        const toInPercent = parseFloat(property.keyframes[i + 1].value);
                                        let path = this.animationDocument.querySelector(property.keyframes[i].pathSelector);
                                        if (fromInPercent !== 0 || toInPercent !== 100) {
                                            path = AnimationHelper.getPathSegment(this.animationDocument, path, fromInPercent, toInPercent, 0.5);
                                            AnimationHelper.addPathSegment(this.animationDocument, "#htmlanimator-helpers", path);
                                        }
                                        animationPath = anime.path(path);
                                        this.cache[animationPathKey] = animationPath;
                                    }

                                    animeOptions[property.name].push({
                                        value: animationPath(property.keyframes[i].pathProperty),
                                        duration: property.keyframes[i + 1].time - property.keyframes[i].time,
                                        delay: keyframeDelay,
                                        easing: property.keyframes[i].easing ? property.keyframes[i].easing : undefined
                                    });

                                }
                                keyframeDelay = 0;
                            } else {
                                keyframeDelay = property.keyframes[i + 1].time - property.keyframes[i].time;
                            }
                        }
                        const groupIds = [...new Set(property.keyframes.map(keyframe => keyframe.groupId))];
                        groupIds.forEach(groupId => {
                            const keyframeGroup = property.keyframeGroups[groupId];
                            if (keyframeGroup) {
                                if (keyframeGroup.iterations > 0) {
                                    const keyframes = property.keyframes.filter(keyframe => keyframe.groupId === groupId);
                                    for (var i = 2; i <= keyframeGroup.iterations; i++) {
                                        for (let i = 0; i < keyframes.length - 1; i++) {
                                            if (keyframes[i].type === keyframes[i + 1].type && keyframes[i].value !== keyframes[i + 1].value) {
                                                if (property.keyframes[i].type === "regular") {
                                                    animeOptions[property.name].push({
                                                        value: [keyframes[i].value, keyframes[i + 1].value],
                                                        duration: keyframes[i + 1].time - keyframes[i].time,
                                                        delay: 0,
                                                        easing: keyframes[i].easing ? keyframes[i].easing : undefined
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }

                    if (animeOptions[property.name].length === 0) {
                        delete animeOptions[property.name];
                    }

                } catch (error) {
                    console.log(`AnimationEngine: ${error}`);
                    isAnimationValid = false;
                }
            });
            if (isAnimationValid) {
                this.timeline.add(animeOptions, 0);
            }
        });
    }
};
