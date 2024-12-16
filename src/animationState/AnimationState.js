export default class AnimationState {
    static init(animationScript) {
        Animation.animationScript = animationScript;
        Animation.undoStack = [];
        Animation.redoStack = [];
    }

    static reset() {
        Animation.animationScript.metadata = { timeline: {} };
        Animation.animationScript.animations.splice(0);
        Animation.undoStack.splice(0);
        Animation.redoStack.splice(0);
    }

    static applyCommand(animationChangeCommand) {
        animationChangeCommand.apply(Animation.animationScript);
        Animation.redoStack.splice(0);
        Animation.undoStack.push(animationChangeCommand);
    }

    static undo() {
        if (Animation.undoStack.length > 0) {
            const animationChangeCommand = Animation.undoStack.pop();
            animationChangeCommand.undo(Animation.animationScript);
            Animation.redoStack.push(animationChangeCommand);
        }
    }

    static redo() {
        if (Animation.redoStack.length > 0) {
            const animationChangeCommand = Animation.redoStack.pop();
            animationChangeCommand.apply(Animation.animationScript);
            Animation.undoStack.push(animationChangeCommand);
        }
    }
}
