export enum FacetType {
	TOOLBAR_MENU = 0,
	BUBBLE_MENU = 1,
	CONTEXT_MENU = 2,
	SLASH_COMMAND = 3,
	QUICK_INSERT = 4,
}

export enum OutputForm {
	STREAMING = 0,
	NORMAL = 1,
	CHAT = 2,
	INSIDE_BOX = 3,
	NOTIFICATION = 4,
}

export enum DefinedVariable {
	TEMP_CONTEXT = "{{TEMP_CONTEXT}}",
	BEFORE_CURSOR = "{{BEFORE_CURSOR}}",
	AFTER_CURSOR = "{{AFTER_CURSOR}}",
	SELECTION = "{{SELECTION}}",
	ALL = "{{ALL}}",
	SIMILAR_CHUNKS = "{{SIMILAR_CHUNKS}}",
	RELATED_CHUNKS = "{{RELATED_CHUNKS}}",
}

export interface PromptAction {
	/**
	 * Name of the action, will be displayed in the menu.
	 */
	name: string;
	/**
	 * Template is a handlebars template, for example:
	 *
	 * ```handlebars
	 * You are in {{TEMP_CONTEXT}} and your selection is {{SELECTION}}
	 * ```
	 */
	template: string;
	/**
	 * The type of the facet, like toolbar menu, bubble menu, context menu, slash command, quick insert
	 */
	facetType: FacetType;
	/**
	 * the output form of the prompt, like streaming, normal, chat, inside box, notification
	 */
	outputForm: OutputForm;
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
	useMode?: string;
	/**
	 * Condition to show the prompt
	 */
	condition?: string; // maybe use a function instead ?
}

