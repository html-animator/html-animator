import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class UpdateAnimationPropertyMetadataCommand extends AnimationChangeCommand {
    constructor(animationScriptMetadata) {
        super();
        this.animationScriptMetadata = JSON.parse(JSON.stringify(animationScriptMetadata));
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.metadata = this.animationScriptMetadata;
    }
}
