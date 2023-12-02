import { Commands, Dispatch, Extension } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { Transaction } from "prosemirror-state";
import {
	ChangeForm,
	DefinedVariable,
	FacetType, OutputForm,
	PromptAction,
} from "@/types/custom-action.type";
import { PromptsManager } from "@/components/editor/prompts/prompts-manager";
import { ActionExecutor } from "@/components/editor/action/ActionExecutor";
import { ARTICLE_TYPE_OPTIONS, ArticleTypeOption } from "@/components/editor/data/ArticleTypeOption";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		getSelectedText: {
			getSelectedText: () => string;
		};
		callLlm: {
			callLlm: (action: PromptAction) => string | undefined;
		};
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
		getArticleType: {
			getArticleType: () => ArticleTypeOption,
		}
		setArticleType: {
			setArticleType: (articleType: ArticleTypeOption) => ReturnType
		},
	}
}

let articleType = ARTICLE_TYPE_OPTIONS[0];

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
			getArticleType:
				() =>
					({ tr }: { tr: Transaction }) => {
						return articleType
					},
			setArticleType:
				(type: ArticleTypeOption) =>
					({ editor, tr, dispatch }: { editor: Editor, tr: Transaction, dispatch: any }) => {
						articleType = type;
					},

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

						if (action.changeForm == ChangeForm.DIFF) {
							// @ts-ignore
							editor.commands?.setTrackChangeStatus(true)
						}

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
								if (action.changeForm == ChangeForm.DIFF) {
									// @ts-ignore
									editor.commands?.setTrackChangeStatus(false)
								}

								return undefined;

							case OutputForm.DIFF:
							case OutputForm.TEXT:
								const text = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: prompt }),
								}).then(it => it.text());

								editor.setEditable(true);
								if (action.changeForm == ChangeForm.DIFF) {
									// @ts-ignore
									editor.commands?.setTrackChangeStatus(false)
								}

								return text;

							default:
								const msg = await fetch("/api/completion/yiyan", {
									method: "POST",
									body: JSON.stringify({ prompt: prompt }),
								}).then(it => it.text());

								const posInfo = actionExecutor.position(editor.state.selection);
								editor.chain().focus().insertContentAt(posInfo, msg).run();

								editor.setEditable(true);
								if (action.changeForm == ChangeForm.DIFF) {
									// @ts-ignore
									editor.commands?.setTrackChangeStatus(false)
								}

								return undefined;
						}
					},
			getAiActions:
				(facet: FacetType) =>
					({ editor }: { editor: Editor }) => {
						let articleType = editor.commands.getArticleType();
						return PromptsManager.getInstance().getPrompt(facet, articleType);
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
