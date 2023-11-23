import { Extension } from '@tiptap/react'

export const CommandFunctions = Extension.create({
  addCommands: () => {
    return {
      // for examples: $selection, $beforeCursor
      variable: (variableName, variableValue) => ({ tr, commands }) => {
        console.log('variable', variableName, variableValue)
      },
      getSelectedText: () => ({ editor }) => {
        if (!editor.state) return null

        const { from, to, empty } = editor.state.selection

        if (empty) return null

        return editor.state.doc.textBetween(from, to, ' ')
      },
    }
  },
})