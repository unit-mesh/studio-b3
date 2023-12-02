import { Commands, Dispatch, Extension } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { Transaction } from "prosemirror-state";
import {
	DefinedVariable,
	FacetType, OutputForm,
	PromptAction,
} from "@/types/custom-action.type";
import { PromptsManager } from "@/prompts/prompts-manager";
import { ActionExecutor } from "@/components/editor/action/ActionExecutor";
import { ARTICLE_TYPE_OPTIONS, ArticleTypeOption } from "@/components/editor/data/ArticleTypeOption";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
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
	addStorage: () => ({
		backgroundContext: "",
		articleType: ARTICLE_TYPE_OPTIONS[0],
	}),
	// @ts-ignore
	addCommands: () => {
		return {
			callLlm:
				(action: PromptAction) =>
					async ({ tr, commands, editor }: { tr: Transaction; commands: Commands, editor: Editor }) => {
						// do execute action
						editor.setEditable(false)
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

								editor.setEditable(true);
								return undefined;

							case OutputForm.TEXT:
								const text = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: prompt }),
								}).then(it => it.text());

								editor.setEditable(true);
								return text;

							default:
								const msg = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: prompt }),
								}).then(it => it.text());

								const posInfo = actionExecutor.position(editor.state.selection);
								editor.chain().focus().insertContentAt(posInfo, msg).run();

								editor.setEditable(true);
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
						editor.setEditable(false);
						editor.commands.callLlm(<PromptAction>{
							name: text,
							template: `You are an assistant to help user write article. Here is user command:` + text + `\n Here is some content ###Article title: {{${DefinedVariable.TITLE}}}, Before Content: {{${DefinedVariable.BEFORE_CURSOR}}}###`,
							facetType: FacetType.QUICK_INSERT,
							outputForm: OutputForm.STREAMING,
						});
						editor.setEditable(true);
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
