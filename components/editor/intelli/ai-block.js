/**
 * license: MIT
 * author: Tiptap
 * origin: https://github.com/ueberdosis/tiptap/blob/develop/packages/extension-code-block/src/code-block.ts
 */
import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import { PluginKey } from '@tiptap/pm/state'

import { QuickView } from './quick-view'

const extensionName = 'quick-command'

export const createAiBlock = () => {
  const pluginKey = new PluginKey(extensionName)

  return Node.create({
    name: extensionName,
    group: 'block',
    defining: true,
    content: 'text*',

    addCommands () {
      return {
        setAiBlock:
          attributes => ({ commands }) => {
            return commands.setNode(this.name, attributes)
          },
        toggleAiBlock:
          attributes => ({ commands }) => {
            return commands.toggleNode(this.name, 'paragraph', attributes)
          },
      }
    },
    addNodeView () {
      return ReactNodeViewRenderer(QuickView)
    },
    addKeyboardShortcuts () {
      return {
        'Mod-/': (state, dispatch, view) => {
          this.editor.commands.toggleAiBlock()
        },
      }
    },
  })
}