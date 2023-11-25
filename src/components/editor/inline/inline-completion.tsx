import { Node, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Editor, mergeAttributes } from "@tiptap/core";
import AiBlockView from "@/components/editor/intelli/ai-block-view";
import React, { useEffect, useRef } from "react";
import { AiBlockEditor } from "@/components/editor/intelli/ai-block-editor";

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		commands: {
			triggerInlineCompletion: () => ReturnType,
			completeInlineCompletion: () => ReturnType,
			cancelInlineCompletion: () => ReturnType,
		}
	}
}

export const createInlineCompletion = () => {
	const extensionName = "inline-completion";

	return Node.create({
		name: extensionName,
		group: "block",
		defining: true,
		content: "text*",
		addOptions() {
			return {
				HTMLAttributes: {
					class: "inline-completion",
				},
			}
		},
		addKeyboardShortcuts() {
			return {
				"Mod-\\": (): boolean => {
					this.editor.commands.triggerInlineCompletion()
					return true
				},
				"Tab": (): boolean => {
					this.editor.commands.completeInlineCompletion()
					return true
				},
				"`": (): boolean => {
					this.editor.commands.completeInlineCompletion()
					return true
				},
				Escape: (): boolean => {
					this.editor.commands.cancelInlineCompletion();
					return true
				},
			}
		},
		// @ts-ignore
		addCommands() {
			return {
				triggerInlineCompletion: (options: any) => ({ commands }: { commands: any }) => {
					return commands.insertContent({
						type: this.name,
						attrs: options,
					})
				},
				completeInlineCompletion: (options: any) => ({ commands }: { commands: any }) => {
					const pos = this.editor.view.state.selection.$anchor.pos;
					commands.deleteNode(this.name)
					commands.insertContentAt(pos, "done completion")
				},
				cancelInlineCompletion: (options: any) => ({ commands }: { commands: any }) => {
					commands.deleteNode(this.name)
				}
			}
		},
		addNodeView() {
			return ReactNodeViewRenderer(InlineCompletionView);
		},
	})
}

const InlineCompletionView = (props?: { editor: Editor }) => {
	const $container = useRef();

	// handle for esc
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				props?.editor?.commands.cancelInlineCompletion();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<NodeViewWrapper ref={$container}>
			<p>show text for completion <span className={'inline-completion-tip'}>`</span></p>
		</NodeViewWrapper>
	);
};

