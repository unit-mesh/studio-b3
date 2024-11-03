# Studio B3 Editor


## Usage

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
