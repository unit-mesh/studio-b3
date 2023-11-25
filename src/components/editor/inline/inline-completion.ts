import { Node } from "@tiptap/react";

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
					// @ts-ignore
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
				}
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
