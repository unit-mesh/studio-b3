import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CookieIcon } from '@radix-ui/react-icons'
import React from 'react'
// spike: https://ai-demo.tiptap.dev/kmLmpqbFJW
export const AiMenubar = ({ editor }) => {
  return <DropdownMenu.Root aria-label="Center aligned">
    <DropdownMenu.Trigger asChild>
      <button className={'ToggleGroupItem flex items-center justify-center relative'} value="center"
              aria-label="Update dimensions">
        <div className={'absolute top-0 right-0 transform -translate-x-1 -translate-y-0.5'}>
          <div className={'absolute px-1 text-[0.75rem] bg-pink-500 text-white rounded-md font-semibold'}>AI</div>
        </div>
        <CookieIcon/>
      </button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
        <DropdownMenu.Item className="DropdownMenuItem">
          智能补全
        </DropdownMenu.Item>
        <DropdownMenu.Item className="DropdownMenuItem">
          精炼内容
        </DropdownMenu.Item>
        <DropdownMenu.Item className="DropdownMenuItem">
          总结
        </DropdownMenu.Item>
        <DropdownMenu.Item className="DropdownMenuItem">
          拼写和语法检查
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
}