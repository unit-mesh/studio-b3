import { Commands, Extension } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { Transaction } from "prosemirror-state";
import { DefinedVariable, FacetType, OutputForm, PromptAction, } from "@/components/editor/defs/custom-action.type";
import { PromptsManager } from "@/components/editor/prompts/prompts-manager";
import { ARTICLE_TYPE_OPTIONS, TypeOptions } from "@/components/editor/defs/type-options.type";
import { AiActionHandler } from "@/components/editor/action/AiActionHandler";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
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
			getArticleType: () => TypeOptions,
		}
		setArticleType: {
			setArticleType: (articleType: TypeOptions) => ReturnType
		},
	}
}

let articleType = ARTICLE_TYPE_OPTIONS[0];

export const CustomEditorCommands = Extension.create({
	name: "commandFunctions",

	// @ts-ignore
	addCommands: () => {
		return {
			getArticleType:
				() =>
					({ tr }: { tr: Transaction }) => {
						return articleType
					},
			setArticleType:
				(type: TypeOptions) =>
					({ editor, tr, dispatch }: { editor: Editor, tr: Transaction, dispatch: any }) => {
						articleType = type;
					},

			callLlm:
				(action: PromptAction) =>
					async ({ tr, commands, editor }: { tr: Transaction; commands: Commands, editor: Editor }) => {
						let actionHandler = new AiActionHandler(editor);
						return await actionHandler.execute(action)
					},
			getAiActions:
				(facet: FacetType) =>
					({ editor }: { editor: Editor }) => {
						let articleType = editor.commands.getArticleType();
						return PromptsManager.getInstance().getActions(facet, articleType);
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
