import { DefinedVariable, FacetType, OutputForm, PromptAction } from "@/types/custom-action.type";

const ToolbarMenu: PromptAction[] = [
	{
		name: '{{Continue writing}}',
		i18Name: true,
		template: `You are an assistant helping a user write a document. Output how the document continues, no more than 3 sentences. ###${DefinedVariable.BEFORE_CURSOR}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	},
	{
		name: '{{Help Me Write}}',
		i18Name: true,
		template: ` You are an assistant helping a user write more content in a document based on a prompt. Output in markdown format. ###${DefinedVariable.BEFORE_CURSOR}###`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	}
];

const BubbleMenu: PromptAction[] = [
	{
		name: '{{Polish Content}}',
		i18Name: true,
		template: `You are an assistant helping to polish sentence. Output in markdown format. \n ###${DefinedVariable.SELECTION}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
	}
];

const SlashCommands: PromptAction[] = []


const PrebuildPrompts: PromptAction[] = [
	ToolbarMenu,
	BubbleMenu,
	SlashCommands
].flat();

export default PrebuildPrompts;