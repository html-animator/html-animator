import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class MoveAnimationPropertyDownCommand extends AnimationChangeCommand {
    constructor(propertyId) {
        super();
        this.propertyId = propertyId;
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.animations.forEach(animation => {
            const property = animation.properties.find(property => property.id === this.propertyId)
            if (property) {
                animation.properties.moveElementDown(property);
            }
        });
    }
}
