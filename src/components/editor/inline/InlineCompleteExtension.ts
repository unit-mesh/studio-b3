import { Node } from "@tiptap/react";

export const createInlineCompletion = () => {
	const extensionName = "inline-completion";

	return Node.create({
		name: extensionName,
		group: "block",
		defining: true,
		content: "text*",
		addKeyboardShortcuts() {
			return {
				"Mod-\\": (): boolean => {
					// todo trigger inline completion and show inline completion menu
					console.log("Mod-\\")
					return false
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
		}
	})
}
