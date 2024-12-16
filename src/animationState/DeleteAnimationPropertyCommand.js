import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class DeleteAnimationPropertyCommand extends AnimationChangeCommand {
    constructor(propertyIds) {
        super();
        this.propertyIds = JSON.parse(JSON.stringify(propertyIds));
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.animations.forEach(animation => {
            animation.properties.splice(0, animation.properties.length, ...animation.properties.filter(property => !this.propertyIds.includes(property.id)))
        });
    }
}
