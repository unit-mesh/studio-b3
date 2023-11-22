/**
 * license: MIT
 * author: Tiptap
 * origin: https://github.com/ueberdosis/tiptap/blob/develop/packages/extension-code-block/src/code-block.ts
 */
import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import { PluginKey } from '@tiptap/pm/state'

import AiBlockView from './ai-block-view'

const extensionName = 'quick-command'

export const createAiBlock = () => {
  let isEditInChild = false

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
        enableEnter:
          () => ({ commands }) => {
            isEditInChild = false
            commands.focus()
            this.editor.setEditable(true)
          },
      }
    },
    addNodeView () {
      return ReactNodeViewRenderer(AiBlockView)
    },
    addKeyboardShortcuts () {
      return {
        'Mod-/': (state, dispatch, view) => {
          isEditInChild = true
          this.editor.setEditable(false)
          this.editor.commands.toggleAiBlock()
        },
        Backspace: () => {
          const { empty, $anchor } = this.editor.state.selection
          const isAtStart = $anchor.pos === 1

          if (!empty || $anchor.parent.type.name !== this.name) {
            return false
          }

          if (isAtStart || !$anchor.parent.textContent.length) {
            return this.editor.commands.clearNodes()
          }

          return false
        },
        Escape: () => {
          console.log("Escape")
          if (isEditInChild === true) {
            this.editor.setEditable(true)
            this.editor.commands.focus()
          }
        },

        // exit node on triple enter
        Enter: ({ editor }) => {
          if (isEditInChild) return true

          if (!this.options.exitOnTripleEnter) {
            return false
          }

          const { state } = editor
          const { selection } = state
          const { $from, empty } = selection

          if (!empty || $from.parent.type !== this.type) {
            return false
          }

          const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
          const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')

          if (!isAtEnd || !endsWithDoubleNewline) {
            return false
          }

          return editor
            .chain()
            .command(({ tr }) => {
              tr.delete($from.pos - 2, $from.pos)

              return true
            })
            .exitCode()
            .run()
        },
      }
    },
  })
}