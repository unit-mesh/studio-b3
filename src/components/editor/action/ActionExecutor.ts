import { ChangeForm, PromptAction } from "@/types/custom-action.type";
import { Editor, Range } from "@tiptap/core";
import { Selection } from "prosemirror-state";

export class ActionExecutor {
	private action: PromptAction;

	constructor(action: PromptAction, editor: Editor) {
		this.action = action;
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