import { Extension } from '@tiptap/react'

export const AiQuickCommand = Extension.create({
  name: 'quick-command',

  addKeyboardShortcuts () {
    return {
      'Mod-/': () => {
        console.log('Mod-/ pressed')
      },
    }
  }
})