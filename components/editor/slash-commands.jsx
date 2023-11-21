import { Extension, ReactRenderer } from '@tiptap/react'
import React from 'react'
import { Suggestion } from '@tiptap/suggestion'
import tippy from 'tippy.js'

// or try SlashCommands: https://github.com/ueberdosis/tiptap/issues/1508
export const SlashCommands = Extension.create({
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
          console.log('ss')
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
          return [
            {
              title: 'H1',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 1 })
                  .run()
              },
            },
          ].filter(item => item.title)
        },
        render: () => {
          let component
          let popup

          return {
            onStart: props => {
              component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor,
              })

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },

            onUpdate (props) {
              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },

            onKeyDown (props) {
              if (props.event.key === 'Escape') {
                popup[0].hide()

                return true
              }

              return component.ref?.onKeyDown(props)
            },

            onExit () {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})

export function CommandsList (props) {
  const { items, selectedIndex, selectItem } = props

  return (
    <ul>
      {items.map(({ title }, idx) => (
        <li key={idx} onClick={() => selectItem(idx)}>
          {title}
        </li>
      ))}
    </ul>
  )
}
