import RandomIds from "./shared/RandomIds.js";

export default class AnimationHelper {
    static updateKeyframeGroups(keyframes, keyframeGroups) {
        if (keyframes.length > 1) {
            keyframes.sort((a, b) => a.time - b.time);

            let groupId = keyframes[0].groupId;
            for (let i = 1; i < keyframes.length; i++) {
                if (keyframes[i].type !== keyframes[i - 1].type || keyframes[i].value === keyframes[i - 1].value) {
                    if (keyframes[i].groupId === keyframes[i - 1].groupId) {
                        groupId = RandomIds.generateId();
                    } else {
                        groupId = keyframes[i].groupId;
                    }
                }
                keyframes[i].groupId = groupId;
            }
        }

        const groupIds = [...new Set(keyframes.map(keyframe => keyframe.groupId))];
        Object.keys(keyframeGroups).filter(x => !groupIds.some(y => y === x)).forEach(x => {
            delete keyframeGroups[x];
        });
    }

    static clearPathSegment(animationDocument, parentSelector) {
        const parent = animationDocument.querySelector(parentSelector);
        if (parent) {
            parent.querySelectorAll(".path-segment").forEach(e => e.remove());
        }
    }

    static addPathSegment(animationDocument, parentSelector, pathSegment) {
        animationDocument.querySelector(parentSelector).appendChild(pathSegment);
    }

    static getPathSegment(animationDocument, path, fromInPercent, toInPercent, accuracy) {
        if (!path) {
            throw "Path is null";
        }

        const d = AnimationHelper.getPathSegmentD(path, fromInPercent, toInPercent, accuracy);
        const pathSegment = animationDocument.createElementNS("http://www.w3.org/2000/svg", "path");
        pathSegment.setAttribute("d", `${d}`);
        pathSegment.setAttribute("id", `${path.id}-${fromInPercent}-${toInPercent}`);
        pathSegment.setAttribute("class", "path-segment");
        pathSegment.setAttribute("style", "display: none; stroke: #FF00FF; stroke-width: 2px;");
        return pathSegment;
    }

    static getPathSegmentD(path, fromInPercent, toInPercent, stepSize) {
        if (!path) {
            throw "Path is null";
        }

        const totalLength = path.getTotalLength();
        stepSize = Math.min(Math.max(stepSize, 0.1), 10);

        let pathSegmentPoints = [];
        if (toInPercent > fromInPercent) {
            for (let i = fromInPercent; i <= toInPercent; i += stepSize) {
                const point = path.getPointAtLength(i / 100 * totalLength);
                pathSegmentPoints.push(point);
            }
        } else {
            for (let i = fromInPercent; i >= toInPercent; i -= stepSize) {
                const point = path.getPointAtLength(i / 100 * totalLength);
                pathSegmentPoints.push(point);
            }
        }
        return `M ${pathSegmentPoints.map(point => `${Math.round(point.x * 1000) / 1000},${Math.round(point.y * 1000) / 1000}`).join(" ")}`;
    }

    static getAnimationPropertyNames() {
        return [
            "backgroundColor",
            "color",
            "fill",
            "opacity",
            "perspective",
            "rotate",
            "rotateX",
            "rotateY",
            "rotateZ",
            "scale",
            "scaleX",
            "scaleY",
            "scaleZ",
            "skew",
            "skewX",
            "skewY",
            "strokeDashoffset",
            "translateX",
            "translateY",
            "translateZ"
        ];
    }
}
