import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class MoveAnimationPropertyDownCommand extends AnimationChangeCommand {
    constructor(animationTargets) {
        super();
        this.animationTargets = animationTargets;
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        const animation = animationScript.animations.find(animation => animation.targets === this.animationTargets)
        if (animation) {
            animationScript.animations.moveElementDown(animation);
        }
    }
}
