import { Extension } from '@tiptap/react'

export const CustomCommands = Extension.create({
  addCommands: () => {
    return {
      // for examples: $selection, $beforeCursor
      variable: (variableName, variableValue) => ({ tr, commands }) => {
        console.log('variable', variableName, variableValue)
      },
      getSelectedText: () => ({ editor }) => {
        const { from, to, empty } = editor.state.selection

        if (empty) {
          return null
        }

        return editor.state.doc.textBetween(from, to, ' ')
      },
    }
  },
})