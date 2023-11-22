# 2b

> 2b is an editor for content generation, like blog, article, user story etc.

Todos

- [ ] Spike editor for edit user requirements/feature.
    - [x] ProseMirror
        - [x] Slash Command
        - [x] Bubble Menu
        - [x] Menu Bar
        - [x] Quick Insert
    - [ ] Diff
        - [ ] JSON Schema, like lines, $from, $to 
        - Viewer for content rewrite,
          like: [https://codesandbox.io/s/prosemirror-diff-nuhiiq](https://codesandbox.io/s/prosemirror-diff-nuhiiq)
        - Change
          Diff [https://github.com/chenyuncai/tiptap-track-change-extension](https://github.com/chenyuncai/tiptap-track-change-extension)
    - [ ] More plugins for
      Intelli: [https://github.com/ueberdosis/tiptap/issues/819](https://github.com/ueberdosis/tiptap/issues/819)
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

## Refs:

### Tiptap Editor extensions

App:

- [Gitlab](https://gitlab.com/gitlab-org/gitlab/-/tree/master/app/assets/javascripts/content_editor/extensions)

Editor:

- [https://github.com/fantasticit/magic-editor](https://github.com/fantasticit/magic-editor)
- [Think Editor's Tiptap extensions](https://github.com/fantasticit/think/tree/main/packages/client/src/tiptap/core/extensions)

## License

This code is distributed under the MIT license. See `LICENSE` in this directory.
