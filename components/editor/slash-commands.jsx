import { ReactRenderer } from '@tiptap/react'
import { Node } from '@tiptap/core'
import { Suggestion } from '@tiptap/suggestion'
import tippy from 'tippy.js'
import SlashMenuContainer from './intelli/slash-menu-view'

// or try SlashCommands: https://github.com/ueberdosis/tiptap/issues/1508
const extensionName = `ai-insert`

export const createSlash = (name, options) => {
  return Node.create({
    name: 'slash-command',
    addOptions () {
      return {
        char: '/',
        pluginKey: 'slash-/',
      }
    },
    addProseMirrorPlugins () {
      return [
        Suggestion({
          editor: this.editor,
          char: this.options.char,


          command: ({ editor, props }) => {
            const { state, dispatch } = editor.view
            const { $head, $from } = state.selection

            const end = $from.pos
            const from = $head?.nodeBefore?.text
              ? end -
              $head.nodeBefore.text.substring(
                $head.nodeBefore.text.indexOf('/')
              ).length
              : $from.start()

            const tr = state.tr.deleteRange(from, end)
            dispatch(tr)
            props?.action?.(editor, props.user)
            editor?.view?.focus()
          },
          items: ({ query }) => {
            // todo: match fo query
            return options.items
          },
          render: () => {
            let component
            let popup
            let isEditable

            return {
              onStart: (props) => {
                isEditable = props.editor.isEditable
                if (!isEditable) return

                component = new ReactRenderer(SlashMenuContainer, {
                  props,
                  editor: props.editor,
                })

                console.log(component.element)

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect || (() => props.editor.storage[extensionName].rect),
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                })
              },

              onUpdate (props) {
                if (!isEditable) return

                component.updateProps(props)
                props.editor.storage[extensionName].rect = props.clientRect()
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                })
              },

              onKeyDown (props) {
                if (!isEditable) return

                if (props.event.key === 'Escape') {
                  popup[0].hide()
                  return true
                }
                return component.ref?.onKeyDown(props)
              },

              onExit () {
                if (!isEditable) return
                popup && popup[0].destroy()
                component.destroy()
              },
            }
          },
        }),
      ]
    },
  })
}
