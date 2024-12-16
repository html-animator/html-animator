export default class AnimationChangeCommand {
    constructor() {
        this.previousState = null;
    }

    undo(animationScript) {
        animationScript.metadata = this.previousState.metadata;
        animationScript.animations.splice(0, animationScript.animations.length, ...JSON.parse(JSON.stringify(this.previousState.animations)));
    }
}
