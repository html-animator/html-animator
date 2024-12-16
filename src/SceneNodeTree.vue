<template>
    <Tree v-model:expandedKeys="expandedKeys" :value="sceneNodes" selection-mode="single" class="w-full h-full" @node-select="onNodeSelected" @node-unselect="onNodeUnselected">
        <template #default="slotProps">
            <div>
                <span v-if="slotProps.node.label === 'rect'" class="icon-svg-rectangle" />
                <span v-else-if="slotProps.node.label === 'circle'" class="icon-svg-circle" />
                <span v-else-if="slotProps.node.label === 'ellipse'" class="icon-svg-ellipse" />
                <span v-else-if="slotProps.node.label === 'line'" class="icon-svg-line" />
                <span v-else-if="slotProps.node.label === 'polyline'" class="icon-svg-polyline" />
                <span v-else-if="slotProps.node.label === 'polygon'" class="material-icon-svg-polygon" />
                <span v-else-if="slotProps.node.label === 'path'" class="icon-svg-path" />
                <span v-else-if="slotProps.node.label === 'g'" class="icon-svg-group" />
                <span v-else-if="slotProps.node.label === 'lineargradient'" class="icon-svg-linear-gradient" />
                <span v-else-if="slotProps.node.label === 'radialgradient'" class="icon-svg-radial-gradient" />
                <span v-else class="node-tag">{{ slotProps.node.label }}</span>
            </div>
            <div>
                <span>{{ slotProps.node.id ? slotProps.node.id : slotProps.node.label }}</span>
            </div>
            <div>
                <Button text severity="secondary" @click.stop="onToggleSceneNodeVisibility(slotProps.node)">
                    <span v-if="slotProps.node.isElementVisible" class="icon-visibility-on" />
                    <span v-else class="icon-visibility-off" />
                </Button>
            </div>
        </template>
    </Tree>
</template>

<script>
    import RandomIds from "./shared/RandomIds.js";

    export default {
        props: {
            modelValue: {
                type: Object,
                default: null
            }
        },
        emits: ["update:modelValue"],
        data() {
            return {
                sceneNodes: [],
                expandedKeys: {}
            }
        },
        methods: {
            loadNodes(sceneType) {
                let rootElement = null;
                if (sceneType === "svg") {
                    rootElement = document.querySelector(".scene-transform > *");
                } else if (sceneType === "html") {
                    rootElement = document.querySelector("iframe").contentWindow.document.body;
                }
                if (rootElement) {
                    const rootNode = this.createSceneNode(rootElement);
                    this.createSceneNodes(rootNode);
                    this.sceneNodes = [rootNode];
                    this.expandedKeys[rootNode.key] = true;
                }
            },
            createSceneNode(element) {
                return {
                    key: RandomIds.generateId(),
                    label: element.tagName.toLowerCase(),
                    id: element.id,
                    leaf: element.children.length === 0,
                    element: element,
                    isElementVisible: element.getAttribute("visibility") !== "collapse" && element.getAttribute("visibility") !== "hidden",
                    children: []
                };
            },
            createSceneNodes(parentNode) {
                for (const child of parentNode.element.children) {
                    if (!child.id.startsWith("htmlanimator")) {
                        var childNode = this.createSceneNode(child);
                        parentNode.children.push(childNode);
                        this.createSceneNodes(childNode);
                    }
                }
            },
            onNodeSelected(selectedNode) {
                this.$emit("update:modelValue", selectedNode.element);
            },
            onNodeUnselected() {
                this.$emit("update:modelValue", null);
            },
            onToggleSceneNodeVisibility(sceneNode) {
                if (sceneNode.element instanceof SVGElement) {
                    if (sceneNode.isElementVisible) {
                        sceneNode.element.setAttribute("visibility", "hidden");
                    } else {
                        sceneNode.element.removeAttribute("visibility");
                    }
                } else {
                    if (sceneNode.isElementVisible) {
                        sceneNode.element.style.visibility = "hidden";
                    } else {
                        sceneNode.element.style.visibility = null;
                    }
                }
                sceneNode.isElementVisible = !sceneNode.isElementVisible;
            }
        }
    }
</script>
