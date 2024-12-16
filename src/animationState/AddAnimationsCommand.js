import AnimationChangeCommand from "./AnimationChangeCommand.js";
import AnimationHelper from "../AnimationHelper.js";

export default class AddAnimationsCommand extends AnimationChangeCommand {
    constructor(newAnimations) {
        super();
        this.newAnimations = JSON.parse(JSON.stringify(newAnimations));
    }

    apply(animationScript) {
        this.previousState = JSON.parse(JSON.stringify(animationScript));

        JSON.parse(JSON.stringify(this.newAnimations)).forEach(newAnimation => {
            let isNewAnimation = false;
            let animation = animationScript.animations.find(animation => animation.targets === newAnimation.targets);
            if (!animation) {
                isNewAnimation = true;
                animation = {
                    id: newAnimation.id,
                    targets: newAnimation.targets,
                    defaults: newAnimation.defaults,
                    properties: []
                };
            }
            newAnimation.properties.forEach(newProperty => {
                let isNewProperty = false;
                let property = animation.properties.find(property => property.name === newProperty.name);
                if (!property) {
                    isNewProperty = true;
                    property = {
                        id: newProperty.id,
                        metadata: newProperty.metadata,
                        name: newProperty.name,
                        keyframes: [],
                        keyframeGroups: {}
                    };
                }
                newProperty.keyframes.forEach(newKeyframe => {
                    property.keyframes.push({
                        id: newKeyframe.id,
                        type: newKeyframe.type,
                        pathSelector: newKeyframe.pathSelector,
                        pathProperty: newKeyframe.pathProperty,
                        value: newKeyframe.value,
                        time: newKeyframe.time,
                        easing: newKeyframe.easing,
                        groupId: newKeyframe.groupId
                    });
                });
                AnimationHelper.updateKeyframeGroups(property.keyframes, property.keyframeGroups);

                if (isNewProperty) {
                    animation.properties.push(property);
                }
            });
            animation.properties.forEach(property => { 
                property.metadata.isExpanded = true;
            });
            if (isNewAnimation) {
                animationScript.animations.push(animation);
            }
        });
    }
}
