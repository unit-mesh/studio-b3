import { Commands, Extension } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { Transaction } from "prosemirror-state";
import {
	FacetType, OutputForm,
	PromptAction,
} from "@/types/custom-action.type";
import { PromptsManager } from "@/prompts/prompts-manager";
import { ActionExecutor } from "@/components/editor/action/ActionExecutor";

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

		callQuickAction: {
			callQuickAction: (text: string) => ReturnType;
		}

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
					({ editor }: { editor: Editor }) => {
						if (!editor.state) return null;

						const { from, to, empty } = editor.state.selection;

						if (empty) return null;

						return editor.state.doc.textBetween(from, to, " ");
					},
			callLlm:
				(action: PromptAction) =>
					async ({ tr, commands, editor }: { tr: Transaction; commands: Commands, editor: Editor }) => {
						// do execute action
						const actionExecutor = new ActionExecutor(action, editor);
						actionExecutor.compile();
						if (action.compiledTemplate == null) {
							throw Error("template is not been compiled yet! compile it first");
						}
						console.info("compiledTemplate: \n\n", action.compiledTemplate);

						switch (action.outputForm) {
							case OutputForm.STREAMING:
								const content = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: action.compiledTemplate }),
								}).then(it => it.text());

								const pos = actionExecutor.position(editor.state.selection);
								editor.chain().focus().insertContentAt(pos, content).run();
								break;
							case OutputForm.NORMAL:
								const msg = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: action.compiledTemplate }),
								}).then(it => it.text());

								const posInfo = actionExecutor.position(editor.state.selection);
								editor.chain().focus().insertContentAt(posInfo, msg).run();
								break;
						}
					},
			getAiActions:
				(facet: FacetType) =>
					({ editor }: { editor: Editor }) => {
						return PromptsManager.getInstance().get(facet);
					},
			runAiAction:
				(action: PromptAction) =>
					({ editor }: { editor: Editor }) => {
						editor.commands.callLlm(action);
					},
			callQuickAction:
				(text: string) =>
					({ editor }: { editor: Editor }) => {
						editor.commands.callLlm(<PromptAction>{
							name: text,
							template: text,
							facetType: FacetType.QUICK_INSERT,
							outputForm: OutputForm.STREAMING,
						});
					},
			setBackgroundContext:
				(context: string) =>
					({ editor }: { editor: Editor }) => {
						PromptsManager.getInstance().saveBackgroundContext(context);
					},
		};
	},
});
