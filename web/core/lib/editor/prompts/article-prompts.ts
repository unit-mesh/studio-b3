import {
	DefinedVariable,
	FacetType,
	OutputForm,
	PromptAction,
} from "@/editor/defs/custom-action.type";

export const ToolbarMenuPrompts: PromptAction[] = [
	{
		name: 'Generate Outline',
		i18Name: true,
		template: `You are an assistant helping a user to generate an outline. Output in markdown format. ###\${${DefinedVariable.BEFORE_CURSOR}}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Continue writing',
		i18Name: true,
		template: `You are an assistant helping a user write a document. Output how the document continues, no more than 3 sentences. ###\${${DefinedVariable.BEFORE_CURSOR}}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Help Me Write',
		i18Name: true,
		template: ` You are an assistant helping a user write more content in a document based on a prompt. Output in markdown format. ###\${${DefinedVariable.BEFORE_CURSOR}}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: 'Spelling and Grammar',
		i18Name: true,
		template: `You are an assistant helping a user to check spelling and grammar. Output in markdown format. ###\${${DefinedVariable.BEFORE_CURSOR}}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
];

export const BubbleMenuPrompts: PromptAction[] = [];

export const SlashCommandsPrompts: PromptAction[] = [
	{
		name: 'Summarize',
		i18Name: true,
		template: `You are an assistant helping to summarize a article. Output in markdown format. \n ###\${${DefinedVariable.BEFORE_CURSOR}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING
	},
	{
		name: 'Continue writing',
		i18Name: true,
		template: `You are an assistant helping a user write a document. Output how the document continues, no more than 3 sentences. ###\${${DefinedVariable.BEFORE_CURSOR}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING,
	}
]

const ArticlePrompts: PromptAction[] = [
	ToolbarMenuPrompts,
	BubbleMenuPrompts,
	SlashCommandsPrompts
].flat();

export default ArticlePrompts;
