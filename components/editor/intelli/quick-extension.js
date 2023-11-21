import { Node, ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { Plugin, PluginKey } from '@tiptap/pm/state'

import { QuickView } from './quick-view'
import { Suggestion } from '@tiptap/suggestion'

const extensionName = 'quick-command'

export const createQuickExtension = () => {
  const pluginKey = new PluginKey(extensionName)

  return Node.create({
    name: extensionName,
    // addKeyboardShortcuts () {
    //   return {
    //     'Mod-/': () => {
    //       this.editor.commands.command(({ tr, state, dispatch }) => {
    //         dispatch(tr.setMeta(pluginKey, false))
    //         return true
    //       })
    //     },
    //   }
    // },
    addProseMirrorPlugins () {
      let plugin = Suggestion({
        editor: this.editor,
        pluginKey: pluginKey,

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
          return [{}]
        },

        render: () => {
          let component
          let popup
          let isEditable

          return {
            onStart: (props) => {
              console.log(props)
              isEditable = props.editor.isEditable
              if (!isEditable) return

              component = new ReactRenderer(QuickView, {
                props,
                editor: props.editor,
              })

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
        }
      })

      return [plugin]
    }
  })
}