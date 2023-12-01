import { Commands, Dispatch, Extension } from "@tiptap/react";
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
		getSelectedText: {
			getSelectedText: () => string;
		};

		callLlm: {
			callLlm: (action: PromptAction) => string | undefined;
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
		replaceRange: {
			replaceRange: (text: string) => ReturnType;
		}
		setBackgroundContext: () => ReturnType,
	}
}

export const CommandFunctions = Extension.create({
	name: "commandFunctions",
	// @ts-ignore
	addCommands: () => {
		return {
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
						let prompt = action.compiledTemplate;
						if (prompt == null) {
							throw Error("template is not been compiled yet! compile it first");
						}
						console.info("compiledTemplate: \n\n", prompt);

						switch (action.outputForm) {
							case OutputForm.STREAMING:
								const response = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: prompt }),
								})

								await response.body?.pipeThrough(new TextDecoderStream()).pipeTo(new WritableStream({
									write: (chunk) => {
										const pos = actionExecutor.position(editor.state.selection);
										editor.chain().focus().insertContentAt(pos, chunk).run();
									}
								}));

								return undefined;

							case OutputForm.TEXT:
								const text = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: prompt }),
								}).then(it => it.text());
								return text;

							default:
								const msg = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: prompt }),
								}).then(it => it.text());

								const posInfo = actionExecutor.position(editor.state.selection);
								editor.chain().focus().insertContentAt(posInfo, msg).run();
								return undefined;
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
			replaceRange:
				(text: string) =>
					({ editor, tr, dispatch }: { editor: Editor, tr: Transaction, dispatch: any }) => {
						const { from, to } = editor.state.selection;
						tr.replaceRangeWith(from, to, editor.state.schema.text(text));
						dispatch(tr);
					},
			setBackgroundContext:
				(context: string) =>
					({ editor }: { editor: Editor }) => {
						PromptsManager.getInstance().saveBackgroundContext(context);
					},
		};
	},
});
