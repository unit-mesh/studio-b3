import { ChangeForm, DefinedVariable, FacetType, OutputForm, PromptAction } from "@/editor/defs/custom-action.type";

const ToolbarMenu: PromptAction[] = [
	{
		name: 'Generate Requirements',
		i18Name: true,
		template: `你是一个产品经理。请编写一个 ###{{${DefinedVariable.TITLE}}}###的需求文档大纲。大纲包含：产品简介、需求流程图、数据项描述、验收条件。`,
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
		name: '你是一个测试专家。生成验收条件',
		i18Name: true,
		template: `使用的表格形式生成验收条件：
1、用例编号：A（产品项目名）—B（用例属性）—C（测试需求标识）—D（编号数字）
2、测试模块：测试用例对应的功能模块
3、测试标题：概括描述测试用例关注点
4、重要级别：高、中、低三个级别，高级别测试用例一般用在冒烟测试阶段
5、预置条件：执行该用例的先决条件
6、测试数据：测试输入
7、操作步骤：需明确给出每一个步骤的详细描述
8、预期结果：（最重要部分）

。需求信息： ###{{${DefinedVariable.BEFORE_CURSOR}}}###`,
		facetType: FacetType.SLASH_COMMAND,
		outputForm: OutputForm.STREAMING
	},
	{
		name: '生成流程图',
		i18Name: true,
		template: `你是一个产品经理。根据业务信息，使用 PlantUML 绘制流程图。\n ###{{${DefinedVariable.ALL}}}###`,
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
