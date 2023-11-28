import {ChangeForm, DefinedVariable, PromptAction, SourceType} from "@/types/custom-action.type";
import {Editor, Range} from "@tiptap/core";
import {Selection} from "prosemirror-state";
import {PromptsManager} from "@/prompts/prompts-manager";

export class ActionExecutor {
    private action: PromptAction;
    private editor: Editor;

    constructor(action: PromptAction, editor: Editor) {
        this.action = action;
        this.editor = editor;
    }

    compile() {
        const promptManager = PromptsManager.getInstance();

        switch (this.action.sourceType) {
            case SourceType.SELECTION: {
                const selection = this.position(this.editor.state.selection);
                const value = this.editor.state.doc.textBetween(selection.from, selection.to);
                this.action.compiledTemplate = promptManager.compile(this.action.template, {[DefinedVariable.SELECTION]: value});
                break;
            }

            case SourceType.BEFORE_CURSOR: {
                const value = this.editor.state.doc.textBetween(0, this.editor.state.selection.to);
                this.action.compiledTemplate = promptManager.compile(this.action.template, {[DefinedVariable.BEFORE_CURSOR]: value});
                break;
            }

        }
    }

    position(selection: Selection): Range {
        let posInfo: Range;
        switch (this.action.changeForm) {
            case ChangeForm.INSERT:
                posInfo = {
                    from: selection.to,
                    to: selection.to
                };
                break;
            case ChangeForm.REPLACE:
                posInfo = {
                    from: selection.from,
                    to: selection.to
                };
                break;
            case ChangeForm.DIFF:
                posInfo = {
                    from: selection.from,
                    to: selection.to
                };
                break;
            default:
                posInfo = {
                    from: selection.to,
                    to: selection.to
                };
        }

        return posInfo;
    }
}