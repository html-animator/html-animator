import AnimationChangeCommand from "./AnimationChangeCommand.js";
import AnimationHelper from "../AnimationHelper.js";
import RandomIds from "../shared/RandomIds.js";

export default class UpdateAnimationTimingsCommand extends AnimationChangeCommand {
    constructor(pasteTime, pastedAnimationKeyframes) {
        super();
        this.pasteTime = pasteTime;
        this.pastedAnimationKeyframes = pastedAnimationKeyframes;
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        const minTime = this.pastedAnimationKeyframes.reduce((acc, keyframe) => { return acc === null || keyframe.time < acc ? keyframe.time : acc; }, null);
        let deltaTime = this.pasteTime - minTime;
        this.pastedAnimationKeyframes.forEach(pastedAnimationKeyframe => {
            animationScript.animations.forEach(animation => {
                const property = animation.properties.find(property => property.keyframes.some(keyframe => keyframe.id == pastedAnimationKeyframe.id));
                if (property) {
                    const copiedKeyframe = property.keyframes.find(keyframe => keyframe.id === pastedAnimationKeyframe.id);
                    if (copiedKeyframe) {
                        const newKeyframe = {
                            id: RandomIds.generateId(),
                            type: copiedKeyframe.type,
                            pathSelector: copiedKeyframe.pathSelector ? copiedKeyframe.pathSelector : null,
                            pathProperty: copiedKeyframe.pathProperty ? copiedKeyframe.pathProperty : null,
                            value: copiedKeyframe.value,
                            time: copiedKeyframe.time + deltaTime,
                            easing: copiedKeyframe.easing ? copiedKeyframe.easing : null,
                            groupId: RandomIds.generateId()
                        };
                        property.keyframes.push(newKeyframe);
                        AnimationHelper.updateKeyframeGroups(property.keyframes, property.keyframeGroups);
                    }
                }
            });
        });
    }
}
