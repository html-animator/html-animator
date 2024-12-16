import AnimationHelper from "../AnimationHelper.js";

export default class AnimeJs {
    static generate(sceneType, animationScript) {
        let animationPaths = {};

        let script = `const timeline = anime.timeline({
    autoplay: ${(animationScript.metadata.timeline.type === undefined || animationScript.metadata.timeline.type === "RegularTimeline") && (animationScript.metadata.timeline.play === undefined || animationScript.metadata.timeline.play === "OnLoad") ? "true" : "false"},
    loop: ${animationScript.metadata.iterationCount === 0 ? true : false}
});

`;

        animationScript.animations.forEach(animation => {
            let animeScript = `{
    targets: "${animation.targets}",
    easing: "${animation.defaults.easing}",
`;

            animation.properties.filter(property => !property.metadata.isDisabled).forEach((property, propertyIndex) => {
                if (property.name.includes("-")) {
                    animeScript += `    "${property.name}": `;
                } else {
                    animeScript += `    ${property.name}: `;
                }

                if (property.keyframes.length > 1) {
                    let keyframeScripts = [];
                    let keyframeStart = property.keyframes[0].time;
                    for (let i = 0; i < property.keyframes.length - 1; i++) {
                        if (property.keyframes[i].type === property.keyframes[i + 1].type && property.keyframes[i].value !== property.keyframes[i + 1].value) {
                            if (property.keyframes[i].type === "regular") {
                                let keyframeScript = `{\r\n`;
                                if (property.name === "strokeDashoffset") {
                                    keyframeScript += `        value: [anime.setDashoffset, 0],\r\n`;
                                } else {
                                    keyframeScript += `        value: [${property.keyframes[i].value.toString().isNumber() ? property.keyframes[i].value : `"${property.keyframes[i].value}"`}, ${property.keyframes[i + 1].value.toString().isNumber() ? property.keyframes[i + 1].value : `"${property.keyframes[i + 1].value}"`}],\r\n`;
                                }
                                keyframeScript += `        duration: ${property.keyframes[i + 1].time - property.keyframes[i].time},\r\n`;
                                keyframeScript += `        delay: ${keyframeStart},\r\n`;
                                if (property.keyframes[i].easing) {
                                    keyframeScript += `        easing: "${property.keyframes[i].easing}"\r\n`;
                                }
                                keyframeScript += `    }`;
                                keyframeScripts.push(keyframeScript);
                            } else if (property.keyframes[i].type === "path") {
                                const animationPathKey = `path-${property.keyframes[i].pathSelector}-${property.keyframes[i].value}-${property.keyframes[i + 1].value}`;
                                let animationPath = animationPaths[animationPathKey];
                                if (!animationPath) {
                                    animationPath = {
                                        selector: property.keyframes[i].pathSelector,
                                        from: property.keyframes[i].value,
                                        to: property.keyframes[i + 1].value
                                    };
                                    animationPaths[animationPathKey] = animationPath;
                                }

                                let keyframeScript = `{\r\n`;
                                keyframeScript += `        value: animationPaths["${animationPathKey}"]("${property.keyframes[i].pathProperty}"),\r\n`;
                                keyframeScript += `        duration: ${property.keyframes[i + 1].time - property.keyframes[i].time},\r\n`;
                                keyframeScript += `        delay: ${keyframeStart},\r\n`;
                                if (property.keyframes[i].easing) {
                                    keyframeScript += `        easing: "${property.keyframes[i].easing}"\r\n`;
                                }
                                keyframeScript += `    }`;
                                keyframeScripts.push(keyframeScript);
                            }
                            keyframeStart = 0;
                        } else {
                            keyframeStart = property.keyframes[i + 1].time - property.keyframes[i].time;
                        }
                    }
                    const groupIds = [...new Set(property.keyframes.map(keyframe => keyframe.groupId))];
                    groupIds.forEach(groupId => {
                        const keyframeGroup = property.keyframeGroups[groupId];
                        if (keyframeGroup) {
                            if (keyframeGroup.iterations > 0) {
                                const keyframes = property.keyframes.filter(keyframe => keyframe.groupId === groupId);
                                for (var i = 2; i <= keyframeGroup.iterations; i++) {
                                    for (let i = 0; i < keyframes.length - 1; i++) {
                                        if (keyframes[i].type === keyframes[i + 1].type && keyframes[i].value !== keyframes[i + 1].value) {
                                            if (property.keyframes[i].type === "regular") {
                                                let keyframeScript = `{\r\n`;
                                                keyframeScript += `        value: [${property.keyframes[i].value.toString().isNumber() ? property.keyframes[i].value : `"${property.keyframes[i].value}"`}, ${property.keyframes[i + 1].value.toString().isNumber() ? property.keyframes[i + 1].value : `"${property.keyframes[i + 1].value}"`}],\r\n`;
                                                keyframeScript += `        duration: ${property.keyframes[i + 1].time - property.keyframes[i].time},\r\n`;
                                                keyframeScript += `        delay: ${keyframeStart},\r\n`;
                                                if (property.keyframes[i].easing) {
                                                    keyframeScript += `        easing: "${property.keyframes[i].easing}"\r\n`;
                                                }
                                                keyframeScript += `    }`;
                                                keyframeScripts.push(keyframeScript);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    if (keyframeScripts.length > 1) {
                        animeScript += "[" + keyframeScripts.join(", ") + "]";
                    } else {
                        animeScript += keyframeScripts;
                    }
                    if (propertyIndex < animation.properties.length - 1) {
                        animeScript += `,\r\n`;
                    }
                }
            });
            animeScript += `\r\n}`;
            if (animeScript.includes("value")) {
                script += `timeline.add(${animeScript}, 0);

`;
            }
        });

        let animationPathsInitializations = "let animationPaths = {};\r\n";
        animationPathsInitializations += "let pathSegment = null;\r\n";
        for (const [key, value] of Object.entries(animationPaths)) {
            const animationDocument = sceneType === "html" ? document.querySelector("iframe").contentWindow.document : document;
            const pathSegmentD = AnimationHelper.getPathSegmentD(animationDocument.querySelector(value.selector), parseFloat(value.from), parseFloat(value.to), 0.5);
            animationPathsInitializations += `pathSegment = document.createElementNS("http://www.w3.org/2000/svg", "path");\r\n`;
            animationPathsInitializations += `pathSegment.setAttribute("d", "${pathSegmentD}");\r\n`;
            animationPathsInitializations += `pathSegment.setAttribute("style", "display: none;");\r\n`;
            animationPathsInitializations += `document.querySelector("svg").appendChild(pathSegment);\r\n`;
            animationPathsInitializations += `animationPaths["${key}"] = anime.path(pathSegment);\r\n`;
        }

        script = animationPathsInitializations + "\r\n" + script;

        if (animationScript.metadata.timeline.type === "RegularTimeline") {
            if (animationScript.metadata.timeline.play === "OnClick" || animationScript.metadata.timeline.play === "OnHover") {
                script += `const playElement = document.querySelector("${animationScript.metadata.timeline.playElementSelector}");\r\n`;
                script += `if (playElement) {\r\n`;
                script += `    playElement.addEventListener("${animationScript.metadata.timeline.play === "OnClick" ? "click" : "pointerover"}", () => {\r\n`;
                script += `        timeline.play();\r\n`;
                script += `    });\r\n`;
                script += `}\r\n\r\n`;
            }
        } else if (animationScript.metadata.timeline.type === "ScrollProgressTimeline") {
            script += `window.addEventListener("scroll", (event) => {\r\n`;
            script += `  const scroller = document.querySelector("${animationScript.metadata.timeline.scrollerElementSelector}");\r\n`;
            script += `  const scrollerHeight = scroller.clientHeight;\r\n`;
            script += `  const scrollerScrollTop = scroller.scrollTop;\r\n`;
            script += `  const scrollerContentHeight = scroller.scrollHeight;\r\n`;
            script += `      let verticalScrollPercentage = Math.min(Math.max(scrollerScrollTop / (scrollerContentHeight - scrollerHeight) * 100, 0), 100);\r\n`;
            script += `      if (verticalScrollPercentage > 99.75) {\r\n`;
            script += `          verticalScrollPercentage = 100;\r\n`;
            script += `  }\r\n`;
            script += `  const timeInMs = Math.round(verticalScrollPercentage / 100 * timeline.duration);\r\n`;
            script += `  timeline.seek(timeInMs);\r\n`;
            script += `}, { passive: true });\r\n\r\n`;
        } else if (animationScript.metadata.timeline.type === "ViewProgressTimeline") {
            script += `window.addEventListener("scroll", (event) => {\r\n`;
            script += `  const scroller = document.querySelector("${animationScript.metadata.timeline.scrollerElementSelector}");\r\n`;
            script += `  const scrollerHeight = scroller.clientHeight;\r\n`;
            script += `  const scrollerScrollTop = scroller.scrollTop;\r\n`;
            script += `  const subject = document.querySelector("${animationScript.metadata.timeline.subjectElementSelector}");\r\n`;
            script += `  const offset = 0;\r\n`;
            script += `  const subjectOffsetTop = subject.offsetTop - offset;\r\n`;
            script += `  const subjectHeight = subject.getBoundingClientRect().height + 2 * offset;\r\n`;
            script += `  if (scrollerHeight + scrollerScrollTop > subjectOffsetTop && scrollerScrollTop < subjectOffsetTop + subjectHeight) {\r\n`;
            script += `      const visibleHeight = scrollerHeight + scrollerScrollTop - subjectOffsetTop;\r\n`;
            script += `      const totalVisibleHeight = scrollerHeight + subjectHeight;\r\n`;
            script += `      const verticalScrollPercentage = visibleHeight / totalVisibleHeight * 100;\r\n`;
            script += `      const timeInMs = Math.round(verticalScrollPercentage / 100 * timeline.duration);\r\n`;
            script += `      timeline.seek(timeInMs);\r\n`;
            script += `  }\r\n`;
            script += `}, { passive: true });\r\n\r\n`;
        }

        return script.trim();
    }
}
