import {Commands, Extension} from "@tiptap/react";
import {Editor} from "@tiptap/core";
import {Transaction} from "prosemirror-state";
import {
    ChangeForm,
    FacetType,
    PromptAction,
} from "@/types/custom-action.type";
import {PromptsManager} from "@/prompts/prompts-manager";
import {Range} from "@tiptap/core";
import {ActionExecutor} from "@/components/editor/action/ActionExecutor";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        variable: {
            variable: () => ReturnType;
        };

        getSelectedText: {
            getSelectedText: () => string;
        };

        callLlm: {
            callLlm: (action: PromptAction) => void;
        }

        getAiActions: {
            getAiActions: (facet: FacetType) => PromptAction[];
        };

        runAiAction: {
            runAiAction: (action: PromptAction) => ReturnType;
        };
        setBackgroundContext: () => ReturnType,
    }
}

export const CommandFunctions = Extension.create({
    name: "commandFunctions",
    // @ts-ignore
    addCommands: () => {
        return {
            // for examples: $selection, $beforeCursor
            variable: (variableName: string, variableValue: string) => () => {
                console.log("variable", variableName, variableValue);
            },
            getSelectedText:
                () =>
                    ({editor}: { editor: Editor }) => {
                        if (!editor.state) return null;

                        const {from, to, empty} = editor.state.selection;

                        if (empty) return null;

                        return editor.state.doc.textBetween(from, to, " ");
                    },
            callLlm:
                (action: PromptAction) =>
                    async ({tr, commands, editor}: { tr: Transaction; commands: Commands, editor: Editor }) => {
                        // do execute action
                        const actionExecutor = new ActionExecutor(action, editor);
                        actionExecutor.compile();
                        if (action.compiledTemplate == null) {
                            throw Error("template is not been compiled yet! compile it first");
                        }

                        const msg = await fetch("/api/completion", {
                            method: "POST",
                            body: JSON.stringify({prompt: action.compiledTemplate}),
                        }).then(it => it.text());

                        const posInfo = actionExecutor.position(editor.state.selection);
                        editor.chain().focus().insertContentAt(posInfo, msg).run();

                    },
            getAiActions:
                (facet: FacetType) =>
                    ({editor}: { editor: Editor }) => {
                        return PromptsManager.getInstance().get(facet);
                    },
            runAiAction:
                (action: PromptAction) =>
                    ({editor}: { editor: Editor }) => {
                        // call LLM
                        console.log("executeAction", action);
                    },
            setBackgroundContext:
                (context: string) =>
                    ({editor}: { editor: Editor }) => {
                        PromptsManager.getInstance().saveBackgroundContext(context);
                    },
        };
    },
});
