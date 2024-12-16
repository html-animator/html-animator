import AnimationChangeCommand from "./AnimationChangeCommand.js";

export default class UpdateAnimationPropertyMetadataCommand extends AnimationChangeCommand {
    constructor(propertyMetadata) {
        super();
        this.propertyMetadata = JSON.parse(JSON.stringify(propertyMetadata));
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        animationScript.animations.forEach(animation => {
            animation.properties.forEach(property => {
                this.propertyMetadata.forEach(propertyMetadata => {
                    if (property.id == propertyMetadata.propertyId) {
                        property.metadata.isDisabled = propertyMetadata.isDisabled;
                        property.metadata.isExpanded = propertyMetadata.isExpanded;
                        property.metadata.color = propertyMetadata.color;
                    }
                });
            });
        });
    }
}
