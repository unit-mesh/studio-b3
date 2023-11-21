import { Extension, ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { Plugin, PluginKey } from '@tiptap/pm/state'

import { QuickView } from './quick-view'

const extensionName = 'ai-quick-command'
export const createQuickExtension = () => {
  return Extension.create({
    name: extensionName,
    addOptions () {
      return {
        char: 'Mod-/',
        pluginKey: extensionName,
      }
    },
    addProseMirrorPlugins () {
      let plugin = new Plugin({
        editor: this.editor,
        char: 'Mod-/',
        ...this.options,

        render: () => {
          let component
          let popup
          let isEditable

          return {
            onStart: (props) => {
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