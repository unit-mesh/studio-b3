import Handlebars from 'handlebars'
import i18next from "i18next";
import { DefinedVariable, FacetType, PromptAction } from "@/components/editor/defs/custom-action.type";
import ArticlePrompts from "@/components/editor/prompts/article-prompts";
import { TypeOptions } from "@/components/editor/defs/type-options.type";
import RequirementsPrompts from "@/components/editor/prompts/requirements-prompts";

export class PromptsManager {
	private backgroundContext: string = "";

	private constructor() {
	}

	private static instance: PromptsManager;

	public static getInstance(): PromptsManager {
		if (!PromptsManager.instance) {
			PromptsManager.instance = new PromptsManager();
		}

		return PromptsManager.instance;
	}

	getActions(type: FacetType, articleType: TypeOptions): PromptAction[] {
		let typedPrompts: PromptAction[] = []

		switch (articleType?.value) {
			case "requirements":
				typedPrompts = RequirementsPrompts;
				break;
			default:
				typedPrompts = ArticlePrompts;
		}

		let actions = typedPrompts.filter(prompt => prompt.facetType === type);
		return actions.map(prompt => {
			if (prompt.i18Name) {
				prompt.name = i18next.t(prompt.name)
			}

			return prompt
		})
	}

	save(prompt: PromptAction[]) {
		// todo: implement this
	}

	variableList(): string[] {
		return Object.values(DefinedVariable);
	}


	compile(string: string, data: object) {
		const template = Handlebars.compile(string)
		return template(data)
	}

	saveBackgroundContext(context: string) {
		this.backgroundContext = context
	}
}