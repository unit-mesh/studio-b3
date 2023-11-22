/**
 * license: MIT
 * author: Tiptap
 * origin: https://github.com/ueberdosis/tiptap/blob/develop/packages/suggestion/src/suggestion.ts
 */
import tippy from 'tippy.js'
import { Extension, ReactRenderer } from '@tiptap/react'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from 'prosemirror-view'

import { QuickView } from './quick-view'

const extensionName = 'quick-command'

export const createQuickExtension = () => {
  const pluginKey = new PluginKey(extensionName)

  return Extension.create({
    name: extensionName,
    addKeyboardShortcuts () {
      return {
        'Mod-/': (state, dispatch, view) => {
          let plugin = this.editor.state.plugins.find(plugin => plugin.key === pluginKey.key)
          // debugger
          console.log(plugin.spec.view())
        },
      }
    },
    addProseMirrorPlugins () {
      let editor = this.editor;
      let props = {}
      let command = () => {}

      let plugin = new Plugin({
        key: pluginKey,
        editor: editor,
        renderer: () => {
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
        },
        view () {
          return {
            update: async (view, prevState) => {
              const prev = this.key?.getState(prevState)
              const next = this.key?.getState(view.state)

              // See how the state changed
              const moved = prev.active && next.active && prev.range.from !== next.range.from
              const started = !prev.active && next.active
              const stopped = prev.active && !next.active
              const changed = !started && !stopped && prev.query !== next.query
              const handleStart = started || moved
              const handleChange = changed && !moved
              const handleExit = stopped || moved

              // Cancel when suggestion isn't active
              if (!handleStart && !handleChange && !handleExit) {
                return
              }

              const state = handleExit && !handleStart ? prev : next
              const decorationNode = view.dom.querySelector(
                `[data-decoration-id="${state.decorationId}"]`,
              )

              props = {
                editor: editor,
                range: state.range,
                query: state.query,
                text: state.text,
                items: [],
                command: commandProps => {
                  command({
                    editor: editor,
                    range: state.range,
                    props: commandProps,
                  })
                },
                decorationNode,
                // virtual node for popper.js or tippy.js
                // this can be used for building popups without a DOM node
                clientRect: decorationNode
                  ? () => {
                    // because of `items` can be asynchrounous we’ll search for the current decoration node
                    const { decorationId } = this.key?.getState(editor.state) // eslint-disable-line
                    const currentDecorationNode = view.dom.querySelector(
                      `[data-decoration-id="${decorationId}"]`,
                    )

                    return currentDecorationNode?.getBoundingClientRect() || null
                  }
                  : null,
              }

              if (handleStart) {
                this.renderer?.onBeforeStart?.(props)
              }

              if (handleChange) {
                this.renderer?.onBeforeUpdate?.(props)
              }

              if (handleChange || handleStart) {
                // props.items = [await items({
                //   editor,
                //   query: state.query,
                // })]
                props.items = []
              }

              if (handleExit) {
                this.renderer?.onExit?.(props)
              }

              if (handleChange) {
                this.renderer?.onUpdate?.(props)
              }

              if (handleStart) {
                this.renderer?.onStart?.(props)
              }
            },

            destroy: () => {
              if (!props) {
                return
              }

              this.renderer?.onExit?.(props)
            },
          }
        },

        state: {
          // Initialize the plugin's internal state.
          init () {
            const state = {
              active: false,
              range: {
                from: 0,
                to: 0,
              },
              query: null,
              text: null,
              composing: false,
            }

            return state
          },

          // Apply changes to the plugin state from a view transaction.
          apply (transaction, prev, oldState, state) {
            const { isEditable } = editor
            const { composing } = editor.view
            const { selection } = transaction
            const { empty, from } = selection
            const next = { ...prev }

            next.composing = composing

            if (isEditable && (empty || this.editor.view.composing)) {
            } else {
              next.active = false
            }

            // Make sure to empty the range if suggestion is inactive
            if (!next.active) {
              next.decorationId = null
              next.range = { from: 0, to: 0 }
              next.query = null
              next.text = null
            }

            return next
          },
        },

        props: {
          // Call the keydown hook if suggestion is active.
          handleKeyDown (view, event) {
            const { active, range } = plugin.getState(view.state)

            if (!active) {
              return false
            }

            return this.renderer?.onKeyDown?.({ view, event, range }) || false
          },

          // Setup decorator on the currently active suggestion.
          decorations (state) {
            const { active, range, decorationId } = plugin.getState(state)

            if (!active) {
              return null
            }

            return DecorationSet.create(state.doc, [
              Decoration.inline(range.from, range.to, {
                nodeName: '',
                class: 'quick-command',
                'data-decoration-id': decorationId,
              }),
            ])
          },
        },
      })

      return [plugin]
    }
  })
}