/**
 * based on:
 * https://github.com/ueberdosis/tiptap/issues/1508
 * MIT License https://github.com/fantasticit/think/blob/main/packages/client/src/tiptap/core/extensions/slash.ts#L11
 * https://github.com/fantasticit/magic-editor/blob/main/src/extensions/slash/slash-menu-view.tsx#L68
 */

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'

export const SlashMenuContainer = forwardRef((props, ref) => {
  const $container = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = index => {
    const command = props.items[index]

    if (command) {
      props.command(command)
    }
  }

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    )
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useEffect(() => {
    if (Number.isNaN(selectedIndex + 1)) return
    const el = $container?.current?.querySelector(
      `.slash-menu-item:nth-of-type(${selectedIndex + 1})`
    )
    el && scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' })
  }, [selectedIndex])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    }
  }))

  return (
    <div ref={$container}>
      {props.items.length ? (
        props.items.map((item, index) => {
          return 'divider' in item ? (
            <div className="slash-menu-item">{item.title}</div>
          ) : (
            <div
              className="slash-menu-item"
              active={selectedIndex === index}
              onClick={() => selectItem(index)}>
              <div>
                {item.icon}
                <p>{item.text}</p>
              </div>
              <div>
                <p>{item.slash}</p>
              </div>
            </div>
          )
        })
      ) : (
        <p>Not Found</p>
      )}
    </div>
  )
})
SlashMenuContainer.displayName = "SlashMenuContainer"