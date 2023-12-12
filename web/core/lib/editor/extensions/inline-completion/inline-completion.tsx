import { findChildren, Node, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Editor } from "@tiptap/core";
import React, { useEffect, useRef } from "react";
import { KeyboardIcon } from "@radix-ui/react-icons";

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		commands: {
			triggerInlineCompletion: () => ReturnType,
			completeInlineCompletion: () => ReturnType,
			cancelInlineCompletion: () => ReturnType,
		}
	}
}

const extensionName = "inline-completion";
export const InlineCompletion = Node.create({
	name: extensionName,
	group: "block",
	defining: true,
	isolating: true,
	hasTrigger: false,
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
				// @ts-ignore
				this.hasTrigger = true
				this.editor.commands.triggerInlineCompletion()
				return true
			},
			"Tab": (): boolean => {
				// @ts-ignore
				this.hasTrigger = false
				this.editor.commands.completeInlineCompletion()
				return true
			},
			"`": (): boolean => {
				// @ts-ignore
				if (!this.hasTrigger) {
					return false
				}
				// @ts-ignore
				this.hasTrigger = false
				this.editor.commands.completeInlineCompletion()
				return true
			},
			Escape: (): boolean => {
				// @ts-ignore
				if (!this.hasTrigger) {
					return false
				}
				// @ts-ignore
				this.hasTrigger = false
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
			completeInlineCompletion: (options: any) => ({ commands, tr }: { commands: any, tr: any }) => {
				const pos = this.editor.view.state.selection.$anchor.pos;
				// commands.deleteNode(this.name)
				commands.insertContentAt(pos, "done completion")

				try {
					tr.doc.descendants((node, pos) => {
						if (node.type.name == this.name) {
							commands.deleteRange({ from: pos, to: pos + node.nodeSize })
							return false;
						}
					})
				} catch (e) {
					console.log(e)
				}
			},
			cancelInlineCompletion: (options: any) => ({ commands }: { commands: any }) => {
				commands.deleteNode(this.name)
			}
		}
	},
	addNodeView() {
		return ReactNodeViewRenderer(InlineCompletionView);
	},
});

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
	}, [props?.editor?.commands]);

	return (
		<NodeViewWrapper ref={$container}>
			<span><KeyboardIcon/> type <span className={'inline-completion-tip'}>`</span> to completion</span>
		</NodeViewWrapper>
	);
};

