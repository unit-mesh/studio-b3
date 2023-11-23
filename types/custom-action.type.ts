enum FacetType {
	TOOLBAR_MENU = 0,
	BUBBLE_MENU = 1,
	CONTEXT_MENU = 2,
	SLASH_COMMAND = 3,
	QUICK_INSERT = 4,
}

enum OutputForm {
	STREAMING = 0,
	NORMAL = 1,
	CHAT = 2,
	INSIDE_BOX = 3,
	NOTIFICATION = 4,
}

enum VariableType {
	BEFORE_CURSOR,
	AFTER_CURSOR,
	SELECTION,
	ALL,
	SIMILAR_CHUNKS,
	RELATED_CHUNKS,
}

interface CustomAction {
	facetType: FacetType;
	outputForm: OutputForm;
	content?: any;
}

