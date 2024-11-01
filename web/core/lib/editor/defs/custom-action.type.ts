import { Editor } from '@tiptap/core';

export enum FacetType {
	TOOLBAR_MENU = 0,
	BUBBLE_MENU = 1,
	SLASH_COMMAND = 2,
	/**
	 * the <AiBlockView />
	 */
	QUICK_INSERT = 3,
}

export enum OutputForm {
	/**
	 * Append the output to the document, not streaming
	 */
	NORMAL = 0,
	/**
	 * Streaming the output to the document
	 */
	STREAMING = 1,
	/**
	 * Show the difference between the selected text and the output
	 */
	DIFF = 2,
	/**
	 * Show the output in <Notification /> which is a popup
	 */
	NOTIFICATION = 3,
	/**
	 * Side suggestion box
	 */
	SIDE_BOX = 4,
	/**
	 * Await all
	 */
	TEXT = 5,
}

export enum ChangeForm {
	/**
	 * Insert the output to the document
	 */
	INSERT = 0,
	/**
	 * Replace the selected text with the output
	 */
	REPLACE = 1,
	/**
	 * Show the difference between the selected text and the output
	 */
	DIFF = 2,
}

export enum BuiltInFunc {
	SIMILAR_CHUNKS = "SIMILAR_CHUNKS",
	RELATED_CHUNKS = "RELATED_CHUNKS",
	GRAMMAR_CHECK = "GRAMMAR_CHECK",
	SPELLING_CHECK = "SPELLING_CHECK",
	WIKI_SUMMARY = "WIKI_SUMMARY",
}

export enum DefinedVariable {
	/**
	 * The base context, i.e. the document
	 * 基础上下文，即文档的富余背景
	 */
	BASE_CONTEXT = "base_context",
	/**
	 * Temporary context, i.e. the background in sidebar
	 * 临时上下文，即 sidebar 中的背景
	 */
	TEMP_CONTEXT = "temp_context",
	/**
	 * All the text content before the cursor
	 * 光标前的所有文本内容
	 */
	BEFORE_CURSOR = "before_cursor",
	/**
	 * All the text content after the cursor
	 * 光标后的所有文本内容
	 */
	AFTER_CURSOR = "after_cursor",
	/**
	 * The selected text
	 * 选中的文本
	 */
	SELECTION = "selection",
	/**
	 * All text in the document
	 * 文档中的所有文本
	 */
	ALL = "all",
	/**
	 * Similar chunks of the selected text
	 * 选中文本的相似块
	 */
	SIMILAR_CHUNKS = "similar_chunks",
	/**
	 * Related chunks of the selected text
	 * 选中文本的相关块
	 */
	RELATED_CHUNKS = "related_chunks",
	/**
	 * Title of the document
	 */
	TITLE = "title",
}

export enum SourceType {
	BEFORE_CURSOR = "BEFORE_CURSOR",
	SELECTION = "SELECTION",
}

export interface PromptAction {
	/**
	 * Name of the action, will be displayed in the menu.
	 * If i18Name is true, then it will be translated by i18n, so we suggest use `{{` and `}}` inside the name.
	 * For example:
	 * ```ts
	 * name: '{{Continue writing}}'
	 * i18Name: true
	 * ```
	 */
	name: string;
	/**
	 * Use i18n to translate the prompt name
	 */
	i18Name?: boolean;
	/**
	 * Template is a handlebars template, for example:
	 *
	 * ```handlebars
	 * You are in {{TEMP_CONTEXT}} and your selection is {{SELECTION}}
	 * ```
	 */
	template: string;

	/**
	 * Final result that compiled using handlebars engine from [template]
	 */
	compiledTemplate?: string;
	/**
	 * Use builtin function to execute the prompt
	 */
	builtinFunction?: BuiltInFunc;
	/**
	 * The type of the facet, like toolbar menu, bubble menu, context menu, slash command, quick insert
	 */
	facetType: FacetType;
	/**
	 * the output form of the prompt, like streaming, normal, chat, inside box, notification
	 */
	outputForm: OutputForm;
	/**
	 * The change form of the prompt, like insert, replace, diff
	 */
	changeForm?: ChangeForm;
	/**
	 * The higher the number, the higher the priority, will be placed higher in the menu
	 */
	priority?: number;
	/**
	 * The icon of the prompt, will be displayed in the menu
	 */
	icon?: never;
	/**
	 * The description of the prompt, will be displayed in the menu
	 */
	description?: string;
	/**
	 * Used LLM model, like openai, gpt3, gpt2, etc.
	 */
	useModel?: string;
	/**
	 * Condition to show the prompt
	 */
	condition?: string; // maybe use a function instead ?
	/**
	 * Menu Action
	 */
	action?: (editor: Editor) => Promise<void>;
}

