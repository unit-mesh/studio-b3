import { Commands, Extension } from '@tiptap/react'
import { Editor } from "@tiptap/core";
import { Transaction } from "prosemirror-state";
import { PromptAction } from "@/types/custom-action.type";

export const CommandFunctions = Extension.create({
	name: 'commandFunctions',
  // @ts-ignore
	addCommands: () => {
		return {
			// for examples: $selection, $beforeCursor
			variable: (variableName: string, variableValue: string) => () => {
				console.log('variable', variableName, variableValue)
			},
			getSelectedText: () => ({ editor }: { editor: Editor }) => {
				if (!editor.state) return null

				const { from, to, empty } = editor.state.selection

				if (empty) return null

				return editor.state.doc.textBetween(from, to, ' ')
			},
			callLlm: (action: PromptAction) => ({ tr, commands }: { tr: Transaction, commands: Commands }) => {
				// TODO: @phodal convert action to request
				// TODO: @genffy add LLM request type
				// do execute action
			}
		}
	},
})