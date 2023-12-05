import { ChangeForm, DefinedVariable, PromptAction, SourceType } from "@/components/editor/defs/custom-action.type";
import { Editor, Range } from "@tiptap/core";
import { Selection } from "prosemirror-state";
import { PromptsManager } from "@/components/editor/prompts/prompts-manager";

export class PromptCompiler {
	private action: PromptAction;
	private editor: Editor;

	constructor(action: PromptAction, editor: Editor) {
		this.action = action;
		this.editor = editor;
	}

	compile() {
		const promptManager = PromptsManager.getInstance();
		let state = this.editor.state;

		const range = actionPosition(this.action, state.selection);
		const selection = state.doc.textBetween(range.from, range.to);
		const beforeCursor = state.doc.textBetween(0, range.to);
		const afterCursor = state.doc.textBetween(range.to, state.doc.nodeSize - 2);
		const all = this.editor.getText();
		let title = '';

		state.doc.descendants((node, pos) => {
			if (node.type.name === 'heading' && node.attrs.level === 1) {
				title = node.textContent;
			}
		});

		const similarChunks = "";

		let context = {
			[DefinedVariable.BEFORE_CURSOR]: beforeCursor,
			[DefinedVariable.AFTER_CURSOR]: afterCursor,
			[DefinedVariable.SELECTION]: selection,
			[DefinedVariable.ALL]: all,
			[DefinedVariable.SIMILAR_CHUNKS]: similarChunks,
			[DefinedVariable.TITLE]: title,
		};
		console.info("variable context", context);
		this.action.compiledTemplate = promptManager.compile(this.action.template, context);
	}
}

export function actionPosition(action: PromptAction, selection: Selection): Range {
	let posInfo: Range;
	switch (action.changeForm) {
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
				from: selection.from,
				to: selection.to
			};
	}

	return posInfo;
}
