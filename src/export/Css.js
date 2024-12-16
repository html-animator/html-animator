import RandomIds from "../shared/RandomIds.js";

export default class Css {
    static getUnit(val) {
        const split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
        if (split) return split[1];
    }

    static getTransformUnit(propName) {
        if (propName.includes("translate") || propName === "perspective") return "px";
        if (propName.includes("rotate") || propName.includes("skew")) return "deg";
    }

    static getCssEasing(easing) {
        switch (easing) {
            case "easeInQuad":
                return "cubic-bezier(0.55, 0.09, 0.68, 0.53)";
            case "easeInCubic":
                return "cubic-bezier(0.55, 0.06, 0.68, 0.19)";
            case "easeInQuart":
                return "cubic-bezier(0.52, 0, 0.74, 0)";
            case "easeInQuint":
                return "cubic-bezier(0.64, 0, 0.78, 0)";
            case "easeInSine":
                return "cubic-bezier(0.47, 0, 0.75, 0.72)";
            case "easeInExpo":
                return "cubic-bezier(0.66, 0, 0.86, 0)";
            case "easeInCirc":
                return "cubic-bezier(0.54, 0, 1, 0.44)";
            case "easeInBack":
                return "cubic-bezier(0.6, -0.28, 0.74, 0.05)"
            case "easeInBounce":
                throw "easeInBounce not implemented";
            case "easeOutQuad":
                return "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            case "easeOutCubic":
                return "cubic-bezier(0.22, 0.61, 0.36, 1)";
            case "easeOutQuart":
                return "cubic-bezier(0.26, 1, 0.48, 1)";
            case "easeOutQuint":
                return "cubic-bezier(0.22, 1, 0.36, 1)";
            case "easeOutSine":
                return "cubic-bezier(0.39, 0.58, 0.57, 1)";
            case "easeOutExpo":
                return "cubic-bezier(0.14, 1, 0.34, 1)";
            case "easeOutCirc":
                return "cubic-bezier(0, 0.56, 0.46, 1)";
            case "easeOutBack":
                return "cubic-bezier(0.18, 0.89, 0.32, 1.28)";
            case "easeOutBounce":
                return "linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%);";
            case "easeInOutQuad":
                return "cubic-bezier(0.46, 0.03, 0.52, 0.96)";
            case "easeInOutCubic":
                return "cubic-bezier(0.65, 0.05, 0.36, 1)";
            case "easeInOutQuart":
                return "cubic-bezier(0.76, 0, 0.24, 1)";
            case "easeInOutQuint":
                return "cubic-bezier(0.84, 0, 0.16, 1)";
            case "easeInOutSine":
                return "cubic-bezier(0.45, 0.05, 0.55, 0.95)";
            case "easeInOutExpo":
                return "cubic-bezier(0.9, 0, 0.1, 1)";
            case "easeInOutCirc":
                return "cubic-bezier(0.88, 0.14, 0.12, 0.86)";
            case "easeInOutBack":
                return "cubic-bezier(0.68, -0.55, 0.27, 1.55);";
            case "easeInOutBounce":
                throw "easeInOutBounce not implemented";
            case "easeOutInQuad":
                throw "easeOutInQuad not implemented";
            case "easeOutInCubic":
                throw "easeOutInCubic not implemented";
            case "easeOutInQuart":
                throw "easeOutInQuart not implemented";
            case "easeOutInQuint":
                throw "easeOutInQuint not implemented";
            case "easeOutInSine":
                throw "easeOutInSine not implemented";
            case "easeOutInExpo":
                throw "easeOutInExpo not implemented";
            case "easeOutInCirc":
                throw "easeOutInCirc not implemented";
            case "easeOutInBack":
                throw "easeOutInBack not implemented";
            case "easeOutInBounce":
                throw "easeOutInBounce not implemented";
            default:
                if (easing === "linear") {
                    return easing;
                } else if (easing.includes("cubicBezier")) {
                    return easing.replace("cubicBezier", "cubic-bezier");
                } else if (easing.includes("steps")) {
                    return easing.replace(")", ", jump-start)");
                }
                throw `${easing} not implemented`;
        }
    }

    static generate(animations) {
        const validTransforms = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"];

        let css = "";
        /*let start = animations
            .map(animation => animation.properties
                .map(property => property.keyframes
                    .reduce((acc, val) => { return acc.time < val.time ? acc.time : val.time; }))
                .reduce((acc, val) => { return acc < val ? acc : val; }))
            .reduce((acc, val) => { return acc < val ? acc : val; });
        let end = animations
            .map(animation => animation.properties
                .map(property => property.keyframes
                    .reduce((acc, val) => { return acc.time > val.time ? acc.time : val.time; }))
                .reduce((acc, val) => { return acc > val ? acc : val; }))
            .reduce((acc, val) => { return acc > val ? acc : val; });*/

        animations.forEach(animation => {
            animation.properties.filter(property => !property.metadata.isDisabled).forEach((property, propertyIndex) => {
                if (property.keyframes.length > 1) {
                    const start = property.keyframes[0].time;
                    const length = property.keyframes[property.keyframes.length - 1].time - property.keyframes[0].time;
                    const animationName = RandomIds.generateId();

                    css += `${animation.targets} {\r\n`;
                    css += `    animation-name: ${animationName};\r\n`;
                    css += `    animation-delay: ${start / 1000}s;\r\n`;
                    css += `    animation-duration: ${length / 1000}s;\r\n`;
                    css += `    animation-iteration-count: infinite;\r\n`;
                    css += `    animation-timing-function: ${Css.getCssEasing(animation.defaults.easing)};\r\n`;
                    css += `}\r\n\r\n`;

                    css += `@keyframes ${animationName} {\r\n`;
                    for (let i = 0; i < property.keyframes.length; i++) {
                        const keyframeStart = property.keyframes[i].time - start;
                        css += `    ${(keyframeStart / length) * 100}% {\r\n`;
                        if (validTransforms.includes(property.name)) {
                            let value = property.keyframes[i].value;
                            let unit = Css.getUnit(value);
                            if (!unit) {
                                unit = Css.getTransformUnit(property.name);
                                value += unit;
                            }
                            css += `        transform: ${property.name}(${value});\r\n`;
                        } else {
                            css += `        ${property.name}: ${property.keyframes[i].value};\r\n`;
                        }
                        if (property.keyframes[i].easing) {
                            css += `        animation-timing-function: ${Css.getCssEasing(property.keyframes[i].easing)};\r\n`;
                        }
                        css += `    }\r\n`;
                    }
                    css += `}\r\n\r\n`;
                }
            });
        });

        return css.trim();
    }
}
