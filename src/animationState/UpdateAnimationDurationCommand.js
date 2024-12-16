import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class UpdateAnimationTimingsCommand extends AnimationChangeCommand {
    constructor(animationDurationScaleFactor) {
        super();
        this.animationDurationScaleFactor = animationDurationScaleFactor;
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.animations.forEach(animation => {
            animation.properties.forEach(property => {
                property.keyframes.forEach(keyframe => {
                    keyframe.time = Math.round(keyframe.time * this.animationDurationScaleFactor);
                });
            });
        });
    }
}
