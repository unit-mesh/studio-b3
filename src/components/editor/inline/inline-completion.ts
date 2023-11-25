import { Node } from "@tiptap/react";

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
					text: "text",
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
					// complete inline completion
					return false
				},
				"`": (): boolean => {
					// complete inline completion
					return false
				},
				"Escape": (): boolean => {
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
						value: "some auto complete text from API",
						attrs: options,
					})
				},
				// complete inline completion
				completeInlineCompletion: () => () => {
					console.log("completeInlineCompletion")
				},
				cancelInlineCompletion: () => () => {
					console.log("cancelInlineCompletion")
				}
			}
		},
		parseHTML() {
			return [
				{
					tag: 'pre',
					preserveWhitespace: 'full',
				},
			]
		},

		renderHTML({ HTMLAttributes }) {
			return ['pre', ['p', HTMLAttributes, 0]]
		},
	})
}
