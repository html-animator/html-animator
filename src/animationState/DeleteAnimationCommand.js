import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class DeleteAnimationCommand extends AnimationChangeCommand {
    constructor(animationTargets) {
        super();
        this.animationTargets = JSON.parse(JSON.stringify(animationTargets));
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.animations.splice(0, animationScript.animations.length, ...animationScript.animations.filter(animation => !this.animationTargets.includes(animation.targets)))
    }
}
