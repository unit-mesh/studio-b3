import { Editor, Range } from "@tiptap/core";
import { ChangeForm, OutputForm, PromptAction } from "@/types/custom-action.type";
import { ActionExecutor, actionPosition } from "@/components/editor/action/ActionExecutor";
import { Selection } from "prosemirror-state";

export class AiActionHandler {
	private editor: Editor;

	constructor(editor: Editor) {
		this.editor = editor;
	}

	private async handleStreaming(action: PromptAction, prompt: string) {
		this.editor.setEditable(false);

		const response = await fetch("/api/completion/yiyan", {
			method: "POST",
			body: JSON.stringify({ prompt: prompt }),
		});

		await response.body?.pipeThrough(new TextDecoderStream()).pipeTo(
			new WritableStream({
				write: (chunk) => {
					const pos = actionPosition(action, this.editor.state.selection);
					this.editor.chain().focus().insertContentAt(pos, chunk).run();
				},
			})
		);

		this.editor.setEditable(true);
	}

	private async handleTextOrDiff(action: PromptAction, prompt: string): Promise<string | undefined> {
		// @ts-ignore
		this.editor.commands?.setTrackChangeStatus(true);

		this.editor.setEditable(false);

		const response = await fetch("/api/completion/yiyan", {
			method: "POST",
			body: JSON.stringify({ prompt: prompt }),
		});

		const text = await response.text();
		this.editor.setEditable(true);

		// @ts-ignore
		this.editor.commands?.setTrackChangeStatus(false);
		return text;
	}

	private async handleDefault(action: PromptAction, prompt: string) {
		this.editor.setEditable(false);
		const response = await fetch("/api/completion/yiyan", {
			method: "POST",
			body: JSON.stringify({ prompt: prompt }),
		});

		const msg = await response.text();
		const posInfo = actionPosition(action, this.editor.state.selection);
		this.editor.chain().focus().insertContentAt(posInfo, msg).run();

		this.editor.setEditable(true);
	}

	public async execute(action: PromptAction) {
		const actionExecutor = new ActionExecutor(action, this.editor);
		actionExecutor.compile();

		let prompt = action.compiledTemplate;

		if (prompt == null) {
			throw Error("template is not been compiled yet! compile it first");
		}

		console.info("compiledTemplate: \n\n", prompt);

		if (action.changeForm == ChangeForm.DIFF) {
			// @ts-ignore
			this.editor.commands?.setTrackChangeStatus(true);
		}

		switch (action.outputForm) {
			case OutputForm.STREAMING:
				await this.handleStreaming(action, prompt);
				return undefined;

			case OutputForm.DIFF:
			case OutputForm.TEXT:
				return await this.handleTextOrDiff(action, prompt);

			default:
				await this.handleDefault(action, prompt);
				return undefined;
		}
	}
}
