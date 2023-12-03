import { Editor } from "@tiptap/core";
import { BuiltInFunc, PromptAction } from "@/components/editor/defs/custom-action.type";

export class BuiltinFunctionExecutor {
	private editor: Editor;

	constructor(editor: Editor) {
		this.editor = editor;
	}

	async execute(action: PromptAction) {
		switch (action.builtinFunction) {
			case BuiltInFunc.GRAMMAR_CHECK:
				break;
			case BuiltInFunc.SIMILAR_CHUNKS:
				return this.searchSimilarChunks(action);
			case BuiltInFunc.SPELLING_CHECK:
				break;
			case BuiltInFunc.WIKI_SUMMARY:
				break;
			case BuiltInFunc.RELATED_CHUNKS:
				break;
		}
	}

	private searchSimilarChunks(action: PromptAction) {
		return new Promise<string>((resolve, reject) => {
			const selection = this.editor.state.selection;
			const query = this.editor.state.doc.textBetween(selection.from, selection.to);

			const response = fetch(`http://127.0.0.1:8080/api/embedding-document/search?q=${query}`, {
				method: "GET",
			})
				.then(res => res.json())
				.then(data => {
					console.log(data);
				})

			return undefined;
		});
	}
}