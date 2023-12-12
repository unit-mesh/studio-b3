import { Editor } from '@tiptap/core';
import { ChangeForm, OutputForm, PromptAction } from '@/editor/defs/custom-action.type';
import { actionPosition, PromptCompiler } from '@/editor/action/PromptCompiler';

// @ts-ignore
import { MarkdownParser } from '@/../node_modules/tiptap-markdown/src/parse/MarkdownParser';
import { BuiltinFunctionExecutor } from '@/editor/action/BuiltinFunctionExecutor';

export class AiActionExecutor {
  private readonly editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  /**
   * TODO: will according the {@link PromptAction.useModel} to return the endpoint in future
   * @param action
   */
  endpoint(action: PromptAction) {
    const endpoint = '/api/completion/mock';
    return endpoint;
  }

  private async handleStreaming(action: PromptAction, prompt: string) {
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

    const pos = actionPosition(action, this.editor.state.selection);
    this.editor.chain().focus()?.insertContentAt(pos, buffer).run();

    let markdownParser = new MarkdownParser(this.editor, {});
    let markdownNode = markdownParser.parse(allText);

    this.editor.chain().focus()?.deleteRange({
      from: originalSelection.from,
      to: this.editor.state.selection.to
    }).run();

    this.editor.chain().insertContentAt(this.editor.state.selection, markdownNode).run();

    this.editor.setEditable(true);
  }

  private async handleTextOrDiff(action: PromptAction, prompt: string): Promise<string | undefined> {
    // @ts-ignore
    this.editor.commands?.setTrackChangeStatus(true);

    this.editor.setEditable(false);

    const response = await fetch(this.endpoint(action), {
      method: 'POST',
      body: JSON.stringify({ prompt: prompt })
    });

    const text = await response.text();
    this.editor.setEditable(true);

    // @ts-ignore
    this.editor.commands?.setTrackChangeStatus(false);
    return text;
  }

  private async handleDefault(action: PromptAction, prompt: string) {
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

  public async execute(action: PromptAction) {
    console.log('execute action', action);
    if (action.builtinFunction) {
      let executor = new BuiltinFunctionExecutor(this.editor);
      return await executor.execute(action);
    }

    const actionExecutor = new PromptCompiler(action, this.editor);
    actionExecutor.compile();

    let prompt = action.compiledTemplate;

    if (prompt == null) {
      throw Error('template is not been compiled yet! compile it first');
    }

    console.info('compiledTemplate: \n\n', prompt);

    if (action.changeForm == ChangeForm.DIFF) {
      // @ts-ignore
      this.editor.commands?.setTrackChangeStatus(true);
    }

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
