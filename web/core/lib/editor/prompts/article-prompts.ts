import {
	BuiltInFunc,
	ChangeForm,
	DefinedVariable,
	FacetType,
	OutputForm,
	PromptAction, 
} from "@/editor/defs/custom-action.type";


const ToolbarMenu: PromptAction[] = [
	// 生成大纲
	{
		name: 'Generate Outline',
		i18Name: true,
		template: `You are an assistant helping a user to generate an outline. Output in markdown format. ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Continue writing',
		i18Name: true,
		template: `You are an assistant helping a user write a document. Output how the document continues, no more than 3 sentences. ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Help Me Write',
		i18Name: true,
		template: ` You are an assistant helping a user write more content in a document based on a prompt. Output in markdown format. ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Spelling and Grammar',
		i18Name: true,
		template: `You are an assistant helping a user to check spelling and grammar. Output in markdown format. ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
];

const BubbleMenu: PromptAction[] = [
	{
		name: 'Polish',
		i18Name: true,
		template: `You are an assistant helping to polish sentence. Output in markdown format. \n ###{{${DefinedVariable.SELECTION}}}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Simplify Content',
		i18Name: true,
		template: `You are an assistant helping to simplify content. Output in markdown format. \n ###{{${DefinedVariable.SELECTION}}}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
		changeForm: ChangeForm.DIFF,
	},
	{
		name: 'Similar Chunk',
		i18Name: true,
		template: `{{${DefinedVariable.SELECTION}}}`,
		builtinFunction: BuiltInFunc.SIMILAR_CHUNKS,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Translate',
		i18Name: true,
		template: `You are an assistant helping to translate a sentence. Output in markdown format. \n ###{{${DefinedVariable.SELECTION}}}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
	}
];

const SlashCommands: PromptAction[] = [
	{
		name: 'Summarize',
		i18Name: true,
		template: `You are an assistant helping to summarize a article. Output in markdown format. \n ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING
	},
	{
		name: 'Continue writing',
		i18Name: true,
		template: `You are an assistant helping a user write a document. Output how the document continues, no more than 3 sentences. ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Look up',
		i18Name: true,
		template: `You are an assistant helping a user look up a word. Output in markdown format. ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING
	}
]

const ArticlePrompts: PromptAction[] = [
	ToolbarMenu,
	BubbleMenu,
	SlashCommands
].flat();

export default ArticlePrompts;