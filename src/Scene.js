export default class Scene {
    static loadScene(sceneMarkup) {
        let sceneType;
        if (sceneMarkup.includes("<html")) {
            sceneType = "html";
            sceneMarkup = sceneMarkup.replace("</html>", `<div id='htmlanimator-helpers'>
    <div id='htmlanimator-selection-bounding-box' style='display: none;'>
    </div>
</div>
</html>`);
            /*sceneMarkup = sceneMarkup.replace("</svg>", `<g id="htmlanimator-helpers">
    <rect id="htmlanimator-selection-bounding-box" x="0" y="0" width="0" height="0" style="display: none;">
    </rect>
</g>
</svg>`);*/
        } else if (sceneMarkup.includes("<svg")) {
            sceneType = "svg";
            sceneMarkup = sceneMarkup.replace("</svg>", `<g id="htmlanimator-helpers">
    <rect id="htmlanimator-selection-bounding-box" x="0" y="0" width="0" height="0" style="display: none;">
    </rect>
</g>
</svg>`);
        } else {
            throw "The scene file requires an SVG or HTML element as root element.";
        }
        return {
            markup: sceneMarkup, type: sceneType
        };
    }
}
