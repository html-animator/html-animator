import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class UpdateAnimationsCommand extends AnimationChangeCommand {
    constructor(updatedAnimations, deletedAnimationKeyframeIds) {
        super();
        this.updatedAnimations = JSON.parse(JSON.stringify(updatedAnimations));
        this.deletedAnimationKeyframeIds = JSON.parse(JSON.stringify(deletedAnimationKeyframeIds));
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.animations.forEach(animation => {
            const updatedAnimation = JSON.parse(JSON.stringify(this.updatedAnimations)).find(x => x.id === animation.id);
            if (updatedAnimation) {
                animation.targets = updatedAnimation.targets;
                animation.defaults.easing = updatedAnimation.defaults.easing;

                animation.properties.forEach(property => {
                    const updatedProperty = updatedAnimation.properties.find(x => x.id === property.id);
                    if (updatedProperty) {
                        property.name = updatedProperty.name;

                        property.keyframes.forEach(keyframe => {
                            updatedProperty.keyframes.forEach(updatedKeyframe => {
                                if (keyframe.id == updatedKeyframe.id) {
                                    keyframe.type = updatedKeyframe.type;
                                    keyframe.pathSelector = updatedKeyframe.pathSelector;
                                    keyframe.pathProperty = updatedKeyframe.pathProperty;
                                    keyframe.time = updatedKeyframe.time;
                                    keyframe.value = updatedKeyframe.value;
                                    keyframe.easing = updatedKeyframe.easing;
                                    keyframe.groupId = updatedKeyframe.groupId;
                                }
                            });
                        });

                        let addedAnimationKeyframes = updatedProperty.keyframes.filter(x => !property.keyframes.some(y => y.id == x.id));
                        addedAnimationKeyframes.forEach(keyframe => {
                            property.keyframes.push(keyframe);
                        });

                        this.deletedAnimationKeyframeIds.forEach(deleteAnimationKeyframeId => {
                            const keyframeIndex = property.keyframes.findIndex(keyframe => keyframe.id == deleteAnimationKeyframeId);
                            if (keyframeIndex !== -1) {
                                property.keyframes.splice(keyframeIndex, 1);
                            }
                        });

                        property.keyframes.sort((a, b) => a.time - b.time);

                        property.keyframeGroups = updatedProperty.keyframeGroups;
                    }
                });
            }
        });
    }
}
