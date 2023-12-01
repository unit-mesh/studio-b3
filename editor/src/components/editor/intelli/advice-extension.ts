// This code based on https://github.com/sereneinserenade/tiptap-comment-extension which is licensed under MIT License
import { Mark, mergeAttributes, Range } from "@tiptap/core";
import { Mark as PMMark } from "@tiptap/pm/model";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		advice: {
			setAdvice: (commentId: string) => ReturnType;
			unsetAdvice: (commentId: string) => ReturnType;
		};
	}
}

export interface MarkWithRange {
	mark: PMMark;
	range: Range;
}

export interface CommentOptions {
	HTMLAttributes: Record<string, any>;
	onAdviceActivated: (commentId: string | null) => void;
}

export interface CommentStorage {
	activeAdviceId: string | null;
}

const EXTENSION_NAME = "advice";

// https://dev.to/sereneinserenade/how-i-implemented-google-docs-like-commenting-in-tiptap-k2k
export const AdviceExtension = Mark.create<CommentOptions, CommentStorage>({
	name: EXTENSION_NAME,

	addOptions() {
		return {
			HTMLAttributes: {},
			onAdviceActivated: () => {
			},
		};
	},

	addAttributes() {
		return {
			commentId: {
				default: null,
				parseHTML: (el: HTMLElement) => (el as HTMLSpanElement).getAttribute("data-advice-id"),
				renderHTML: (attrs) => ({ "data-advice-id": attrs.commentId }),
			},
		};
	},

	// @ts-ignore
	parseHTML() {
		return [
			{
				tag: "span[data-advice-id]",
				getAttrs: (el: HTMLElement) =>
					!!(el as HTMLSpanElement).getAttribute("data-advice-id")?.trim() &&
					null,
			},
		];
	},

	renderHTML({ HTMLAttributes }: {
		HTMLAttributes: Record<string, any>
	}) {
		return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0,];
	},

	onSelectionUpdate() {
		const { $from } = this.editor.state.selection;
		const marks = $from.marks();

		if (!marks.length) {
			this.storage.activeAdviceId = null;
			this.options.onAdviceActivated(this.storage.activeAdviceId);
			return;
		}

		const commentMark = this.editor.schema.marks.comment;
		const activeCommentMark = marks.find((mark) => mark.type === commentMark);
		this.storage.activeAdviceId = activeCommentMark?.attrs.commentId || null;
		this.options.onAdviceActivated(this.storage.activeAdviceId);
	},

	addStorage() {
		return {
			activeAdviceId: null,
		};
	},

	addCommands() {
		return {
			setAdvice: (commentId) => ({ commands }) => {
				if (!commentId) return false;

				commands.setMark("comment", { commentId });
				return true;
			},
			unsetAdvice: (commentId) => ({ tr, dispatch }) => {
				if (!commentId) return false;

				const commentMarksWithRange: MarkWithRange[] = [];

				tr.doc.descendants((node, pos) => {
					const commentMark = node.marks.find(
						(mark) =>
							mark.type.name === "comment" &&
							mark.attrs.commentId === commentId
					);

					if (!commentMark) return;

					commentMarksWithRange.push({
						mark: commentMark,
						range: {
							from: pos,
							to: pos + node.nodeSize,
						},
					});
				});

				commentMarksWithRange.forEach(({ mark, range }) => {
					tr.removeMark(range.from, range.to, mark);
				});

				return dispatch?.(tr);
			},
		};
	},
});
