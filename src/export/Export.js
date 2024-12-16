import AnimeJs from "./AnimeJs.js";

export default class Export {
    static getCleanedUpScene(sceneMarkup) {
        const scene = document.createElement("div");
        scene.innerHTML = sceneMarkup;
        const helpersElement = scene.querySelector("#htmlanimator-helpers");
        helpersElement.parentNode.removeChild(helpersElement);
        return scene;
    }

    static export(sceneType, sceneMarkup, animationScript, type) {
        const scene = Export.getCleanedUpScene(sceneMarkup);
        const javascript = AnimeJs.generate(sceneType, animationScript);
        switch (type) {
            case "html":
                return Export.exportHtml(scene, javascript);
            case "svg":
                return Export.exportSvg(scene, javascript);
        }
    }

    static exportHtml(scene, javascript) {
        return `<html>
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js">
<\/script>
</head>
<body>
${scene.innerHTML.trim()}
<script>
${javascript}
<\/script>
</body>
</html>`;
    }

    static exportSvg(scene, javascript) {
        let svg = scene.querySelector("svg");
        let script = document.createElement("script");
        script.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js");
        svg.appendChild(script);
        script = document.createElement("script");
        script.text = javascript;
        svg.appendChild(script);
        return scene.innerHTML;
    }
}
