export enum FacetType {
	TOOLBAR_MENU = 0,
	BUBBLE_MENU = 1,
	CONTEXT_MENU = 2,
	SLASH_COMMAND = 3,
	QUICK_INSERT = 4,
}

export enum OutputForm {
	NORMAL = 0,
	STREAMING = 1,
	DIFF = 2,
	INSIDE_BOX = 3,
	NOTIFICATION = 4,
}

export enum ChangeForm {
	INSERT = 0,
	REPLACE = 1,
	DIFF = 2,
}

export enum BuiltInFunc {
	SIMILAR_CHUNKS = 0,
	RELATED_CHUNKS = 1,
	GRAMMAR_CHECK = 2,
	SPELLING_CHECK = 3,
	WIKI_SUMMARY = 4,
}

export enum DefinedVariable {
	BASE_CONTEXT = "base_context",
	TEMP_CONTEXT = "temp_context",
	BEFORE_CURSOR = "before_cursor",
	AFTER_CURSOR = "after_cursor",
	SELECTION = "selection",
	ALL = "all",
	SIMILAR_CHUNKS = "similar_chunks",
	RELATED_CHUNKS = "related_chunks",
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
	icon?: any;
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
}

