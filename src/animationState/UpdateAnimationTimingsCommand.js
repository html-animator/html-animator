import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class UpdateAnimationTimingsCommand extends AnimationChangeCommand {
    constructor(animationKeyframeIdsAndTimes) {
        super();
        this.animationKeyframeIdsAndTimes = JSON.parse(JSON.stringify(animationKeyframeIdsAndTimes));
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.animations.forEach(animation => {
            animation.properties.forEach(property => {
                this.animationKeyframeIdsAndTimes.forEach(x => {
                    let keyframe = property.keyframes.find(keyframe => keyframe.id == x.id);
                    if (keyframe) {
                        keyframe.time = x.time;
                    }
                });
            });
        });
    }
}
