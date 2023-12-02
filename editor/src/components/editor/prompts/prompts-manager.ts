import Handlebars from 'handlebars'
import i18next from "i18next";
import { DefinedVariable, FacetType, PromptAction } from "@/types/custom-action.type";
import ArticlePrompts from "@/components/editor/prompts/article-prompts";
import { ArticleTypeOption } from "@/components/editor/data/ArticleTypeOption";

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

	getPrompt(type: FacetType, articleType: ArticleTypeOption): PromptAction[] {
		let actions = ArticlePrompts.filter(prompt => prompt.facetType === type);
		const filterActions = actions.map(prompt => {
			if (prompt.i18Name) {
				prompt.name = i18next.t(prompt.name)
			}

			return prompt
		})

		return filterActions
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