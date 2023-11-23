# 3b

[![Deploy](https://github.com/unit-mesh/3b/actions/workflows/deploy.yml/badge.svg)](https://github.com/unit-mesh/3b/actions/workflows/deploy.yml)

> 3b is a sophisticated editor designed for content creation, catering to various formats such as blogs, articles, user
> stories, and more.

In the documentary "10 Years with Hayao Miyazaki"  the esteemed artist (宫崎骏, 宮﨑駿／みやざきはやお) chooses a 3B
pencil,
deeming conventional ones too inflexible for his creative process. Let us pay homage to his lofty ideals.

Todos

- [ ] Migrate javascript to typescript
- [ ] Spike editor for edit user requirements/feature.
    - [x] ProseMirror
        - [x] Menu Bar. Click in menu bar, show menu.
        - [x] Slash Command. Type `/` to show menu.
        - [x] Bubble Menu. Select text, show menu by condition.
            - [ ] BubbleMenu by BlockType,
              like: [Code Block Bubble Menu](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/content_editor/components/bubble_menus/code_block_bubble_menu.vue)
        - [x] Quick Insert. Type `Command` + `/` or `Ctrl` + `/` to show menu.
        - [ ] Context Menu. Right click to show menu.
    - [ ] Diff
        - [ ] GPT JSON Schema: like lines, $from, $to
        - [ ] Diff algorithm
        - [ ] Change accept/reject
        - [ ] Libs
            - [x] Tiptap: [track-change-extension](https://github.com/chenyuncai/tiptap-track-change-extension)
            - [ ] ProseMirror Change: [Changeset](https://github.com/ProseMirror/prosemirror-changeset)
            - [ ] [@remirror/extension-diff](https://github.com/remirror/remirror/tree/main/packages/remirror__extension-diff)
- [ ] More plugins for Intelli: [https://github.com/ueberdosis/tiptap/issues/819](https://github.com/ueberdosis/tiptap/issues/819)
    - [ ] Sidebar Intellij [Microsoft 365](https://techcommunity.microsoft.com/t5/microsoft-365-blog/introducing-new-ai-enhancements-in-microsoft-365-new-features/ba-p/3643499)
- [ ] Local LLM Spike
    - [ ] Correction text, [MacBERT](https://github.com/ymcui/MacBERT) 
        - [ ] [shibing624/macbert4csc-base-chinese](https://huggingface.co/shibing624/macbert4csc-base-chinese) 
    - [ ] Grammarly
    - [ ] Text Prediction
        - [GPT2-Chinese](https://github.com/Morizeyao/GPT2-Chinese)
        - [uer/gpt2-distil-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-distil-chinese-cluecorpussmall)
    - [ ] Similarity / Sentence Transformer
        -  [ ] [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [ ] LLM Connection
    - [ ] OpenAI
    - [ ] Others ?
- [ ] Customize prompt
    - [ ] Variable: `$beforeCursor`, `$afterCursor`, `$selection`, `$similarChunk`, `$relatedChunk`
- [ ] Content search
    - [ ] Similar chunk in browser.
    - [ ] Code search
- [ ] DSL for units
    - [ ] Backend
    - [ ] Frontend
    - [ ] Test code
    - [ ] Test cases
- [ ] Online Runtime
    - [ ] Unit Runtime

## Design Principle

- [Facets as Composable Extension Points](https://marijnhaverbeke.nl/blog/facets.html)

* Composition: Multiple extensions attaching to a given extension point must have their effects combined in a
  predictable way.
* Precedence: In cases where combining effects is order-sensitive, it must be easy to reason about and control the order
  of the extensions.
* Grouping: Many extensions will need to attach to a number of extension points, or even pull in other extensions that
  they depend on.
* Change: The effect produced by extensions may depend on other aspects of the system state, or be explicitly
  reconfigured.

## Refs:

### Tiptap Editor extensions

App:

- [Gitlab](https://gitlab.com/gitlab-org/gitlab/-/tree/master/app/assets/javascripts/content_editor/extensions)

Editor:

- [https://github.com/fantasticit/magic-editor](https://github.com/fantasticit/magic-editor)
- [Think Editor's Tiptap extensions](https://github.com/fantasticit/think/tree/main/packages/client/src/tiptap/core/extensions)

## License

TrackChange based on: [TrackChangeExtension](https://github.com/chenyuncai/tiptap-track-change-extension)

This code is distributed under the MIT license. See `LICENSE` in this directory.
