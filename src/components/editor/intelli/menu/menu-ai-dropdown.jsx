import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CookieIcon } from '@radix-ui/react-icons'
import React from 'react'
import { FacetType } from '@/types/custom-action.type'
import { ActionExecutor } from '@/components/editor/action/ActionExecutor'

// spike: https://ai-demo.tiptap.dev/kmLmpqbFJW
export const MenuAiDropdown = ({ editor }) => {
  const menus = editor?.commands?.getAiActions(FacetType.TOOLBAR_MENU)

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
        {menus?.map((menu, index) => {
          return <DropdownMenu.Item
            key={index}
            className="DropdownMenuItem"
            onClick={() => {
              const selection = editor.state.selection
              let posInfo = new ActionExecutor(menu, editor).position(selection);

              editor.chain().focus().insertContentAt(posInfo, "TODO").run()
            }}
          >
            {menu.name}
          </DropdownMenu.Item>
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
}