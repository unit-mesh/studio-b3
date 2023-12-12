# Studio B3

Chinese version: [中文版](./README.zh.md)

[![Deploy](https://github.com/unit-mesh/3b/actions/workflows/deploy.yml/badge.svg)](https://github.com/unit-mesh/3b/actions/workflows/deploy.yml)
[![npm](https://img.shields.io/npm/v/b3-editor)](https://www.npmjs.com/package/b3-editor)
![GitHub release (with filter)](https://img.shields.io/github/v/release/unit-mesh/b3)

> Studio B3 (B-3 Bomber) is a sophisticated editor designed for content creation, catering to various formats such as
> blogs, articles, user stories, and more.

Mission: Our primary goal is to create an editor similar to [AutoDev](https://github.com/unit-mesh/auto-dev).
Additionally, we aim to share insights from the article
titled [Why Chatbots Are Not the Future](https://wattenberger.com/thoughts/boo-chatbots). Our vision includes delivering
a writing experience akin to [Copilot for Docs](https://githubnext.com/projects/copilot-for-docs/) in documentation.

About name: In the documentary "10 Years with Hayao Miyazaki"  the esteemed artist (宫崎骏, 宮﨑駿／みやざきはやお) chooses a 3B
pencil,
deeming conventional ones too inflexible for his creative process. Let us pay homage to his lofty ideals.

Roadmap: see [Roadmap](https://github.com/unit-mesh/3b/issues/1)

Online Demo: [https://editor.unitmesh.cc/](https://editor.unitmesh.cc/)

Demo Videos: [开源 AI 原生编辑器 Studio B3](https://www.bilibili.com/video/BV1E64y1j7hJ/)

## Features

- Immersive generation. Provides an immersive content generation experience, supporting various formats to allow users
  to create content comprehensively.
- Local AI capability. Integration of local AI capabilities, such as semantic search, to enhance the editor's
  intelligent search and recommendation functions.
- Custom action. Allowing users to define variables and other elements for more flexible and tailored content
  generation.
- Full lifecycle AI. Including interactive tools like the Bubble Menu, Slash Command, Quick Insert, to enhance user
  experience in editing, searching, and navigation.

## Design Principle

- **Intelligent Embedding**: Integrate artificial intelligence deeply with the user interface, ensuring that AI models
  are cleverly introduced at various positions in the editor to achieve a more intuitive and intelligent user
  interaction experience.
- **Local Optimization**: Pursue an efficient and smooth writing experience by introducing local inference models, which
  operate within the user's local environment. This includes localized enhancements such as semantic search, local
  syntax checking, text prediction, etc.
- **Context Flexibility**: Introduce a context API, providing users with custom prompts and predefined contexts,
  allowing for more flexible shaping of the editing environment. Through flexible context management, users gain better
  control over AI-generated content.

### [Facets as Composable Extension Points](https://marijnhaverbeke.nl/blog/facets.html)

* Composition: Multiple extensions attaching to a given extension point must have their effects combined in a
  predictable way.
* Precedence: In cases where combining effects is order-sensitive, it must be easy to reason about and control the order
  of the extensions.
* Grouping: Many extensions will need to attach to a number of extension points, or even pull in other extensions that
  they depend on.
* Change: The effect produced by extensions may depend on other aspects of the system state, or be explicitly
  reconfigured.

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

## Refs

### Tiptap Editor extensions

App:

- [Gitlab](https://gitlab.com/gitlab-org/gitlab/-/tree/master/app/assets/javascripts/content_editor/extensions)

Editor:

- [https://github.com/fantasticit/magic-editor](https://github.com/fantasticit/magic-editor)
- [Think Editor's Tiptap extensions](https://github.com/fantasticit/think/tree/main/packages/client/src/tiptap/core/extensions)

Similar project:

- [JetBrains Grazie](https://lp.jetbrains.com/grazie-for-software-teams/)

## License

TrackChange based on: [TrackChangeExtension](https://github.com/chenyuncai/tiptap-track-change-extension)

This code is distributed under the MIT license. See `LICENSE` in this directory.
