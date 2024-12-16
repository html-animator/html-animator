import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class LoadAnimationScriptCommand extends AnimationChangeCommand {
    constructor(animationScript) {
        super();
        this.animationScript = JSON.parse(JSON.stringify(animationScript));
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.metadata = this.animationScript.metadata;
        animationScript.animations.splice(0, animationScript.animations.length, ...JSON.parse(JSON.stringify(this.animationScript.animations)));
    }
}
