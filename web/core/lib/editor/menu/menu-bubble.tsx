import { BubbleMenu } from '@tiptap/react';
import React, { useEffect } from 'react';
import { Editor } from '@tiptap/core';
import { BookmarkIcon, CookieIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import {
  ChangeForm,
  DefinedVariable,
  FacetType,
  OutputForm,
  PromptAction
} from '@/editor/defs/custom-action.type';
import { newAdvice } from '@/editor/extensions/advice/advice';
import { ToolbarMenu } from '@/editor/menu/toolbar-menu';
import { BounceLoader } from 'react-spinners';

function innerSmartActions() : PromptAction[] {
  const innerSmartMenus: PromptAction[] = [];

  innerSmartMenus.push({
    name: '扩写',
    template: `根据如下的内容扩写，只返回三句，限 100 字以内。###\${${DefinedVariable.SELECTION}}###。`,
    facetType: FacetType.BUBBLE_MENU,
    changeForm: ChangeForm.DIFF,
    outputForm: OutputForm.TEXT
  });

  innerSmartMenus.push({
    name: '润色',
    template: `请润色并重写如下的内容：###\${${DefinedVariable.SELECTION}}###`,
    facetType: FacetType.BUBBLE_MENU,
    changeForm: ChangeForm.DIFF,
    outputForm: OutputForm.TEXT
  });

  return innerSmartMenus;
}

export const MenuBubble = ({ editor, customActions } : {
  editor: Editor,
  customActions?: PromptAction[]
}) => {
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const [smartMenus, setSmartMenus] = React.useState<PromptAction[]>(customActions ? innerSmartActions().concat(customActions) : innerSmartActions);
  const [menus, setMenus] = React.useState<any[]>([]);

  useEffect(() => {
    setMenus(editor?.commands?.getAiActions(FacetType.BUBBLE_MENU) || []);
  }, [editor, isOpen]);

  const handleToggle = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return <BubbleMenu className={`bubble-menu-group w-64`} editor={editor} updateDelay={800}>
    <div className={'bubble-menu-tier1'}>
      <div className="bubble-dropdown">
        {loading && <BounceLoader color={'#8A4FFF'} size={38} />}
        {!loading && <Button variant="soft" onClick={handleToggle} className={'b3-color-bg-red text-white'}>
          Ask AI
          <CookieIcon />
        </Button>
        }
      </div>
      <div className="smart-menu">
        <ToolbarMenu editor={editor} isBubbleMenu={true} />
      </div>
    </div>
    <div className={'ask-ai-dropdown'}>
      {isOpen && (<ul>
          {smartMenus?.map((menu, index) => {
            return <li key={index}>
              <Button
                className="dropdown-item w-full"
                onClick={async () => {
                  setIsOpen(false);
                  setLoading(true);

                  const text = await editor.commands?.callLlm(menu)
                  setLoading(false);

                  const newComment = newAdvice(text || '');
                  editor.commands?.setAdvice(newComment.id);
                  editor.commands?.setAdviceCommand(newComment);
                  menu.action?.(editor);
                  editor.view?.focus();
                }}
              >
                {menu.name} <BookmarkIcon />
              </Button>
            </li>;
          })}

          {menus?.map((menu, index) => {
            return <li key={index}>
              <Button
                className="dropdown-item w-full"
                onClick={async (event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  await editor.chain().callLlm(menu);
                  editor.view?.focus();
                }}
              >
                {menu.name}
              </Button>
            </li>;
          })}
        </ul>
      )}
    </div>
  </BubbleMenu>;
};
