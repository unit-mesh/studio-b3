import { ReactRenderer } from "@tiptap/react";
import { Node } from "@tiptap/core";
import { Suggestion } from "@tiptap/suggestion";
import tippy, { Instance, Props } from "tippy.js";
import SlashView from "./slash-view";
import { PluginKey } from "@tiptap/pm/state";
import { FacetType } from "@/components/editor/defs/custom-action.type";
import { PromptsManager } from "@/components/editor/prompts/prompts-manager";

export const createSlashExtension = (name: string) => {
	const extensionName = `ai-insert`;

	return Node.create({
		name: "slash-command",
		addOptions() {
			return {
				char: "/",
				pluginKey: "slash",
			};
		},
		addProseMirrorPlugins() {
			return [
				Suggestion({
					editor: this.editor,
					char: this.options.char,
					pluginKey: new PluginKey(this.options.pluginKey),

					command: ({ editor, props }) => {
						const { state, dispatch } = editor.view;
						const { $head, $from } = state.selection;

						const end = $from.pos;
						const from = $head?.nodeBefore?.text
							? end -
							$head.nodeBefore.text.substring(
								$head.nodeBefore.text.indexOf("/"),
							).length
							: $from.start();

						const tr = state.tr.deleteRange(from, end);
						dispatch(tr);
						editor.commands.runAiAction(props);
						editor?.view?.focus();
					},
					items: ({ query }) => {
						let articleType = this.editor.commands.getArticleType();
						console.log(articleType)
						const promptActions = (PromptsManager.getInstance().getActions(FacetType.SLASH_COMMAND, articleType) || []);
						console.log(promptActions)
						return promptActions;
					},
					render: () => {
						let component: ReactRenderer<unknown, {}>;
						let popup: Instance<Props>[];
						let isEditable: boolean;

						return {
							onStart: (props) => {
								isEditable = props.editor.isEditable;
								if (!isEditable) return;

								component = new ReactRenderer(SlashView, {
									props,
									editor: props.editor,
								});

								popup = tippy("body", {
									getReferenceClientRect:
										props.clientRect ||
										(() => props.editor.storage[extensionName].rect),
									appendTo: () => document.body,
									content: component.element,
									showOnCreate: true,
									interactive: true,
									trigger: "manual",
									placement: "bottom-start",
								});
							},

							onUpdate(props) {
								if (!isEditable) return;

								component.updateProps(props);
								props.editor.storage[extensionName].rect = props.clientRect!();
								popup[0].setProps({
									getReferenceClientRect: props.clientRect as any,
								});
							},

							onKeyDown(props) {
								if (!isEditable) return;

								if (props.event.key === "Escape") {
									popup[0].hide();
									return true;
								}
								return (component.ref as any).onKeyDown(props);
							},

							onExit() {
								if (!isEditable) return;
								popup && popup[0].destroy();
								component.destroy();
							},
						};
					},
				}),
			];
		},
	});
};
