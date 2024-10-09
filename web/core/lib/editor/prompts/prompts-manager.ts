import i18next from "i18next";
import { DefinedVariable, FacetType, PromptAction } from "@/editor/defs/custom-action.type";
import ArticlePrompts from "@/editor/prompts/article-prompts";
import { TypeOptions } from "@/editor/defs/type-options.type";
import RequirementsPrompts from "@/editor/prompts/requirements-prompts";

export class PromptsManager {
	private constructor() {
	}

	private static instance: PromptsManager;

	public static getInstance(): PromptsManager {
		if (!PromptsManager.instance) {
			PromptsManager.instance = new PromptsManager();
		}

		return PromptsManager.instance;
	}

	actionsMap = {
		"article": ArticlePrompts,
		"requirements": RequirementsPrompts
	}

	getActions(type: FacetType, articleType: TypeOptions): PromptAction[] {
		let typedPrompts: PromptAction[] = []

		if (articleType?.value) {
			typedPrompts = this.actionsMap[articleType.value]
		}

		const actions = typedPrompts.filter(prompt => prompt.facetType === type);
		return actions.map(prompt => {
			if (prompt.i18Name) {
				prompt.name = i18next.t(prompt.name)
			}

			return prompt
		})
	}

	variableList(): string[] {
		return Object.values(DefinedVariable);
	}

	updateActionsMap(articleType: string, prompts: PromptAction[]) {
		this.actionsMap[articleType] = prompts
	}

	compile(string: string, data: object) {
		const template = render(string, data)
		console.log(template)
		return template
	}

	saveBackgroundContext(context: string) {
		(this as any).backgroundContext = context
	}
}

function render(template: string, data: object) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	return template.replace(/\$\{([\s\S]+?)\}/g, (match, p1) => {
		const keys = p1.trim().split('.');
		let value = data;
		for (const key of keys) {
			value = value[key];
			if (value === undefined) {
				return '';
			}
		}
		return value;
	});
}
