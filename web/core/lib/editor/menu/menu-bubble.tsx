import { BubbleMenu } from '@tiptap/react';
import React, { useEffect, useRef } from 'react';
import { Editor, isTextSelection } from '@tiptap/core';
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

export const MenuBubble = ({ editor }: {
  editor: Editor
}) => {
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const [smartMenus, setSmartMenus] = React.useState<PromptAction[]>([]);
  const [menus, setMenus] = React.useState<any[]>([]);
  const [isShowAccept, setIsShowAccept] = React.useState(false);

  useEffect(() => {
    const innerSmartMenus: PromptAction[] = [];

    innerSmartMenus.push({
      name: '扩写',
      template: `根据如下的内容扩写，只返回三句，限 100 字以内。###{{${DefinedVariable.SELECTION}}}###。`,
      facetType: FacetType.BUBBLE_MENU,
      changeForm: ChangeForm.DIFF,
      outputForm: OutputForm.TEXT
    });

    innerSmartMenus.push({
      name: '润色',
      template: `优化表达：###{{${DefinedVariable.SELECTION}}}###`,
      facetType: FacetType.BUBBLE_MENU,
      changeForm: ChangeForm.DIFF,
      outputForm: OutputForm.TEXT
    });

    setSmartMenus(innerSmartMenus);
    setMenus(editor?.commands?.getAiActions(FacetType.BUBBLE_MENU) || []);
  }, [editor, isOpen]);

  const element = useRef();

  const handleToggle = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  // const shouldShow = React.useCallback(({ view, state, from, to }) => {
  //     const { doc, selection } = state;
  //     const { empty } = selection;
  //
  //     // Sometime check for `empty` is not enough.
  //     // Doubleclick an empty paragraph returns a node size of 2.
  //     // So we check also for an empty text size.
  //     const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection);
  //
  //     // When clicking on a element inside the bubble menu the editor "blur" event
  //     // is called and the bubble menu item is focussed. In this case we should
  //     // consider the menu as part of the editor and keep showing the menu
  //     const isChildOfMenu = element.current!!.contains(document.activeElement);
  //
  //     const hasEditorFocus = view.hasFocus() || isChildOfMenu;
  //
  //     if (!hasEditorFocus || empty || isEmptyTextBlock || !editor.isEditable) {
  //       return false;
  //     }
  //
  //     return true;
  //   }
  //   , [editor]);

  return <BubbleMenu className={`bubble-menu-group w-64`} editor={editor} updateDelay={800}>
    {isShowAccept && <div className={'change-buttons'}>
      <button
        className="rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
        onClick={() => {
          editor?.commands?.acceptChange();
        }}
      >Accept
      </button>
      <button
        className="rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
        onClick={() => {
          editor?.commands?.rejectChange();
        }}
      >Reject
      </button>
    </div>
    }
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

                  const text = await editor.commands?.callLlm(menu);
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
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  editor.chain().callLlm(menu);
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