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
	TEMP_CONTEXT = "${{TEMP_CONTEXT}}",
	BEFORE_CURSOR = "${{BEFORE_CURSOR}}",
	AFTER_CURSOR = "${{AFTER_CURSOR}}",
	SELECTION = "${{SELECTION}}",
	ALL = "${{ALL}}",
	SIMILAR_CHUNKS = "${{SIMILAR_CHUNKS}}",
	RELATED_CHUNKS = "${{RELATED_CHUNKS}}",
}

export interface PromptAction {
	name: string;
	template: string;
	facetType: FacetType;
	outputForm: OutputForm;
}

