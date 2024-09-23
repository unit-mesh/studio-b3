import { Editor } from '@tiptap/core';
import { OutputForm, PromptAction } from '@/editor/defs/custom-action.type';
import { actionPosition, PromptCompiler } from '@/editor/action/PromptCompiler';
import { MarkdownParser } from '@/../node_modules/tiptap-markdown/src/parse/MarkdownParser';
import { BuiltinFunctionExecutor } from '@/editor/action/BuiltinFunctionExecutor';

export class AiActionExecutor {
  editor: Editor;
  endpointUrl: string = '/api/completion/mock';

  constructor() {
  }

  setEditor(editor: Editor) {
    if (editor == null) {
      console.error('editor is null, will not set it');
      return;
    }
    this.editor = editor;
  }

  setEndpointUrl(url: string) {
    this.endpointUrl = url;
  }


  /**
   * TODO: will according the {@link PromptAction.useModel} to return the endpoint in future
   * @param action
   */
  endpoint(action: PromptAction) {
    return this.endpointUrl;
  }

  async handleStreaming(action: PromptAction, prompt: string) {
    this.editor.setEditable(false);
    const originalSelection = this.editor.state.selection;

    const response = await fetch(this.endpoint(action), {
      method: 'POST',
      body: JSON.stringify({ prompt: prompt })
    });

    let allText = '';
    let buffer = '';
    await response.body?.pipeThrough(new TextDecoderStream()).pipeTo(
      new WritableStream({
        write: (chunk) => {
          allText += chunk;
          buffer = buffer.concat(chunk);

          if (buffer.includes('\n')) {
            const pos = actionPosition(action, this.editor.state.selection);
            this.editor.chain().focus()?.insertContentAt(pos, buffer).run();

            // insert new line
            const posInfo = actionPosition(action, this.editor.state.selection);
            this.editor.chain().focus()?.insertContentAt(posInfo, '\n').run();

            buffer = '';
          }
        }
      })
    );

    if (buffer.length > 0) {
      const pos = actionPosition(action, this.editor.state.selection);
      this.editor.chain().focus()?.insertContentAt(pos, buffer).run();
    }

    if (this.editor == null) {
      console.error('editor is not, can not insert content');
      return;
    }

    const pos = actionPosition(action, this.editor.state.selection);
    this.editor.chain().focus()?.insertContentAt(pos, buffer).run();

    const markdownParser = new MarkdownParser(this.editor, {});
    const markdownNode = markdownParser.parse(allText);

    this.editor.chain().focus()?.deleteRange({
      from: originalSelection.from,
      to: this.editor.state.selection.to
    }).run();

    this.editor.chain().insertContentAt(this.editor.state.selection, markdownNode).run();

    this.editor.setEditable(true);
  }

  async handleTextOrDiff(action: PromptAction, prompt: string): Promise<string | undefined> {
    this.editor.setEditable(false);

    const response = await fetch(this.endpoint(action), {
      method: 'POST',
      body: JSON.stringify({ prompt: prompt })
    });

    const text = await response.text();
    this.editor.setEditable(true);

    return text;
  }

  async handleDefault(action: PromptAction, prompt: string) {
    this.editor.setEditable(false);
    const response = await fetch(this.endpoint(action), {
      method: 'POST',
      body: JSON.stringify({ prompt: prompt })
    });

    const msg = await response.text();
    const posInfo = actionPosition(action, this.editor.state.selection);
    this.editor.chain().focus()?.insertContentAt(posInfo, msg).run();

    this.editor.setEditable(true);
  }

  async execute(action: PromptAction) {
    console.info('execute action', action);
    if (action.builtinFunction) {
      const executor = new BuiltinFunctionExecutor(this.editor);
      return await executor.execute(action);
    }

    const actionExecutor = new PromptCompiler(action, this.editor);
    actionExecutor.compile();

    const prompt = action.compiledTemplate;

    if (prompt == null) {
      throw Error('template is not been compiled yet! compile it first');
    }

    console.info('compiledTemplate: \n\n', prompt);

    switch (action.outputForm) {
      case OutputForm.STREAMING:
        await this.handleStreaming(action, prompt);
        return undefined;

      case OutputForm.DIFF:
      case OutputForm.TEXT:
        return await this.handleTextOrDiff(action, prompt);

      default:
        await this.handleDefault(action, prompt);
        return undefined;
    }
  }
}
