# 3B

> 3B 编辑器是一个为内容创作设计的高级编辑器，适用于各种格式，如博客、文章、用户故事等。

在纪录片《宫崎骏：十载同行》中，这位备受尊敬的艺术家宫崎骏选择了一支 3B 铅笔，认为传统的铅笔在他的创作过程中过于僵硬。让我们向他的崇高理念致敬。

待办事项：查看 [路线图](https://github.com/unit-mesh/3b/issues/1)

在线演示：[https://editor.unitmesh.cc/](https://editor.unitmesh.cc/)

## 特点

- 沉浸式生成。提供沉浸式的内容生成体验，支持各种格式，使用户能够全面创作内容。
- 本地AI能力。集成本地AI能力，如语义搜索，以增强编辑器的智能搜索和推荐功能。
- 自定义操作。允许用户定义变量和其他元素，实现更灵活、定制化的内容生成。
- 完整生命周期的AI。包括Bubble菜单、Slash命令、Quick Insert等交互工具，以增强用户在编辑、搜索和导航中的体验。

## 设计原则

- **智能嵌入：** 将人工智能与用户界面深度融合，确保在编辑器的各个界面位置巧妙地引入AI模型，以实现更直观、智能的用户交互体验。
- **本地优化：** 通过引入本地推理模型，追求在用户本地环境下提供高效、流畅的写作体验。这包括语义搜索、本地语法检查、文本预测等本地化增强功能。
- **上下文灵活性：** 引入上下文API，为用户提供自定义提示和预定义上下文等工具，以实现对编辑环境更灵活的塑造。通过灵活的上下文管理，用户能够更好地掌控AI生成的内容。

中文版：[中文版](./README.zh.md)

### [可组合扩展点的外观](https://marijnhaverbeke.nl/blog/facets.html)

* 组合：附加到给定扩展点的多个扩展必须以可预测的方式结合其效果。
* 优先级：在组合效果与顺序敏感的情况下，必须轻松理解和控制扩展的顺序。
* 分组：许多扩展将需要附加到多个扩展点，甚至拉入它们依赖的其他扩展。
* 变更：扩展产生的效果可能取决于系统状态的其他方面，或者被明确地重新配置。

## 用法

### 自定义菜单示例

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

## 引用:

### Tiptap编辑器扩展

App:

- [Gitlab](https://gitlab.com/gitlab-org/gitlab/-/tree/master/app/assets/javascripts/content_editor/extensions)

Editor:

- [https://github.com/fantasticit/magic-editor](https://github.com/fantasticit/magic-editor)
- [Think Editor's Tiptap extensions](https://github.com/fantasticit/think/tree/main/packages/client/src/tiptap/core/extensions)

## 许可证

基于TrackChange：[TrackChangeExtension](https://github.com/chenyuncai/tiptap-track-change-extension)

本代码采用MIT许可证分发。请参阅此目录中的`LICENSE`。