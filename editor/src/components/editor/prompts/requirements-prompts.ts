import {
	BuiltInFunc,
	ChangeForm,
	DefinedVariable,
	FacetType,
	OutputForm,
	PromptAction, SourceType
} from "@/types/custom-action.type";


const ToolbarMenu: PromptAction[] = [
	{
		name: 'Generate Requirements',
		i18Name: true,
		template: `你是一个产品经理。请编写一个 ###{{${DefinedVariable.TITLE}}}###的需求文档大纲。`,
		facetType: FacetType.TOOLBAR_MENU,
		outputForm: OutputForm.STREAMING,
	}
];

const BubbleMenu: PromptAction[] = [
	{
		name: '细化需求',
		i18Name: true,
		template: `你是一个产品经理。请细化这些需求 \n ###{{${DefinedVariable.SELECTION}}}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
		changeForm: ChangeForm.DIFF,
	},
	{
		name: 'Polish',
		i18Name: true,
		template: `You are an assistant helping to polish sentence. Output in markdown format. \n ###{{${DefinedVariable.SELECTION}}}###`,
		facetType: FacetType.BUBBLE_MENU,
		outputForm: OutputForm.STREAMING,
	}
];

const SlashCommands: PromptAction[] = [
	{
		name: '需求细化',
		i18Name: true,
		template: `You are an assistant helping to summarize a article. Output in markdown format. \n ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING
	},
	{
		name: '生成验收条件',
		i18Name: true,
		template: `使用 Given-when-Then 的表格形式生成验收条件。\n ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING
	},
	{
		name: '生成流程图',
		i18Name: true,
		template: `根据业务信息，使用 PlantUML 绘制流程图。\n ###{{${DefinedVariable.ALL}}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING
	},
	{
		name: '生成需求大纲',
		i18Name: true,
		template: `你是一个产品经理。请编写一个 ###{{${DefinedVariable.TITLE}}}###的需求文档大纲。大纲包含：产品简介、需求流程图、数据项描述、验收条件`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING,
	}
]

const RequirementsPrompts: PromptAction[] = [
	ToolbarMenu,
	BubbleMenu,
	SlashCommands
].flat();

export default RequirementsPrompts;
