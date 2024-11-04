# Studio B3 Editor


## Installation

```bash
npm install -g @studio-b3/web-core
```

## Usage

### Normal

```typescript jsx
import { ArticlePrompts, setupExtensions, PromptsManager, MenuBubble, AiActionExecutor, ToolbarMenu, AdviceView, OutputForm, ChangeForm, FacetType, } from "@studio-b3/web-core";

// /...
<div className={"editor-main p-4 bg-white"}>
  {editor && showToolbar && <ToolbarMenu className={"toolbar-menu"} editor={editor} />}

  <EditorContent editor={editor} />
  <div>{editor && <MenuBubble editor={editor} customActions={getCustomActions()} />}</div>
</div>
```

### Our Example

```typescript jsx
"use client";

import React, { useCallback, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { ArticlePrompts, setupExtensions, PromptsManager, MenuBubble, AiActionExecutor, ToolbarMenu, AdviceView, OutputForm, ChangeForm, FacetType, } from "@studio-b3/web-core";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import MarkdownIt from "markdown-it";
import { useDebounce } from "use-debounce";
import { Theme } from "@radix-ui/themes";
import { DOMSerializer } from "prosemirror-model";
import TurndownService from "turndown";
import { Markdown } from "tiptap-markdown";

const md = new MarkdownIt();

export interface EditorWrapperProps {
  value: string;
  onChange?: (e: any) => void;
  placeholder?: string;
  showToolbar?: boolean;
  customBubbleActions?: FeanorEditorAction[];
  customSlashActions?: FeanorEditorAction[];
}

export interface FeanorEditorAction {
  name: string;
  action?: (editor: Editor) => Promise<void>;
}

export default function B3EditorWrapper({
                                          value,
                                          onChange,
                                          placeholder,
                                          showToolbar,
                                          customBubbleActions,
                                          customSlashActions
                                        }: EditorWrapperProps) {
  const actionExecutor: AiActionExecutor = new AiActionExecutor();
  actionExecutor.setEndpointUrl("/api/chat");

  const instance = PromptsManager.getInstance();
  const map = customSlashActions?.map((action) => {
    return {
      name: action.name,
      i18Name: false,
      template: `123125`,
      facetType: FacetType.SLASH_COMMAND,
      outputForm: OutputForm.STREAMING,
      action: async (editor: Editor) => {
        if (action.action) {
          await action.action(editor);
        }
      },
    };
  }) || [];

  instance.updateActionsMap("article", ArticlePrompts.concat(map));

  const editor = useEditor({
    extensions: setupExtensions(instance, actionExecutor).concat([
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: false,
      }),
    ]),
    content: md.render(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose lg:prose-xl bb-editor-inner",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        const schema = editor.state.schema;
        try {
          const serializer = DOMSerializer.fromSchema(schema);
          const serialized: HTMLElement | DocumentFragment = serializer.serializeFragment(editor.state.doc.content);

          const html: string = Array.from(serialized.childNodes)
            .map((node: ChildNode) => (node as HTMLElement).outerHTML)
            .join("");

          const turndownService = new TurndownService();
          const markdown = turndownService.turndown(html);
          onChange(markdown);
        } catch (e) {
          console.error(e);
        }
      }
    },
  });

  const [debouncedEditor] = useDebounce(editor?.state.doc.content, 5000);
  useEffect(() => {
    if (debouncedEditor) {
      try {
        localStorage.setItem("editor", JSON.stringify(editor?.getJSON()));
        console.info("Saved to localStorage");
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  }, [debouncedEditor, editor]);

  useEffect(() => {
    if (value !== "") {
      editor?.commands?.setContent(md.render(value));
      return;
    }

    const content = localStorage.getItem("editor");
    if (content) {
      try {
        const parsed = JSON.parse(content);
        parsed?.content?.forEach((item: any) => {
          if (item.content) {
            item.content.forEach((subItem: any) => {
              if (subItem.marks) {
                subItem.marks = subItem.marks.filter((mark: any) => mark.type !== "advice");
              }
            });
          }
        });

        editor?.commands?.setContent(parsed);
        if (parsed.content.length === 1) {
          if (!parsed.content[0].content) {
            editor?.commands?.setContent(md.render(value));
          }
        }
      } catch (e) {
        editor?.commands?.setContent(md.render(value));
        console.error(e);
      }
    }

    if (!!editor) {
      actionExecutor.setEditor(editor);
    }
  }, [editor]);

  const getCustomActions = useCallback(() => (customBubbleActions || []).map((action) => {
    return {
      name: action.name,
      template: "",
      facetType: FacetType.BUBBLE_MENU,
      changeForm: ChangeForm.DIFF,
      outputForm: OutputForm.TEXT,
      action: async () => {
        if (action.action) {
          await action.action(editor!);
        }
      },
    };
  }), [customBubbleActions, editor]);

  return (
    <div>
      <Theme className={"w-full flex editor-block"}>
        <div className={"w-full editor-section"}>
          <div className={"editor-main p-4 bg-white"}>
            {editor && showToolbar && <ToolbarMenu className={"toolbar-menu"} editor={editor} />}

            <EditorContent editor={editor} />
            <div>{editor && <MenuBubble editor={editor} customActions={getCustomActions()} />}</div>
          </div>
        </div>

        {editor && <AdviceView style={{ height: "auto" }} editor={editor} />}
      </Theme>
    </div>
  );
}
```

### Custom Menu examples

```typescript
const BubbleMenu: PromptAction[] = [
	{
		name: 'Polish',
		i18Name: true,
		template: `You are an assistant helping to polish sentence. Output in markdown format. \n ###${DefinedVariable.SELECTION}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Similar Chunk',
		i18Name: true,
		template: `You are an assistant helping to find similar content. Output in markdown format. \n ###${DefinedVariable.SELECTION}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Simplify Content',
		i18Name: true,
		template: `You are an assistant helping to simplify content. Output in markdown format. \n ###${DefinedVariable.SELECTION}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
		changeForm: ChangeForm.DIFF,
	},
];
```

Custom Smamples:


```tsx
const actionExecutor: AiActionExecutor = new AiActionExecutor();
actionExecutor.setEndpointUrl("/api/chat");

const instance = PromptsManager.getInstance();
const map = customSlashActions?.map((action) => {
  return {
    name: action.name,
    i18Name: false,
    template: `123125`,
    facetType: FacetType.SLASH_COMMAND,
    outputForm: OutputForm.STREAMING,
    action: async (editor: Editor) => {
      if (action.action) {
        await action.action(editor);
      }
    },
  };
}) || [];

instance.updateActionsMap("article", ArticlePrompts.concat(map));

const editor = useEditor({
  extensions: setupExtensions(instance, actionExecutor).concat([
    Markdown.configure({
      transformPastedText: true,
      transformCopiedText: false,
    }),
  ]),
  content: md.render(value),
  immediatelyRender: false,
  editorProps: {
    attributes: {
      class: "prose lg:prose-xl bb-editor-inner",
    },
  },
  onUpdate: ({ editor }) => {
    if (onChange) {
      const schema = editor.state.schema;
      try {
        const serializer = DOMSerializer.fromSchema(schema);
        const serialized: HTMLElement | DocumentFragment = serializer.serializeFragment(editor.state.doc.content);

        const html: string = Array.from(serialized.childNodes)
                .map((node: ChildNode) => (node as HTMLElement).outerHTML)
                .join("");

        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(html);
        onChange(markdown);
      } catch (e) {
        console.error(e);
      }
    }
  },
});
```
