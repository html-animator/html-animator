import RandomIds from "./shared/RandomIds.js";

export default class AnimationScript {
    static deserializeAnimationScript(scriptString) {
        const script = JSON.parse(scriptString);
        if (script.metadata.fileFormatVersion !== "htmlanimator.script.v1") {
            throw "The script file is in the wrong format.";
        }
        if (!script.metadata.timeline) {
            script.metadata.timeline = {}
        }
        script.animations.forEach(animation => {
            animation.id = RandomIds.generateId();

            animation.properties.forEach(property => {
                property.id = RandomIds.generateId();

                if (!property.keyframes) {
                    property.keyframes = [];
                }
                if (!property.keyframeGroups) {
                    property.keyframeGroups = {};
                }
            });
        });
        return script;
    }

    static serializeAnimationScript(script) {
        script = JSON.parse(JSON.stringify(script));
        script.metadata.fileFormatVersion = "htmlanimator.script.v1";
        script.animations.forEach(animation => {
            delete animation.id;

            animation.properties.forEach(property => {
                delete property.id;

                property.keyframes.forEach(keyframe => {
                    if (keyframe.type === "regular") {
                        delete keyframe.pathSelector;
                        delete keyframe.pathProperty;
                    }
                });
            });
        });
        return JSON.stringify(script);
    }
}
