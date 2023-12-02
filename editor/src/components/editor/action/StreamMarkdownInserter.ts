import { Node } from "@tiptap/core";

export class StreamMarkdownInserter {
	// singleton
	private constructor() {
	}

	private static instance: StreamMarkdownInserter;

	public static getInstance(): StreamMarkdownInserter {
		if (!StreamMarkdownInserter.instance) {
			StreamMarkdownInserter.instance = new StreamMarkdownInserter();
		}

		return StreamMarkdownInserter.instance;
	}

	// parse text and return block type
	parse(text: string): any {
		// start end with # will be a title, count level, and return { type: 'heading', attrs: { level: //count # } }
		if (text.startsWith("#")) {
			let level = 0;
			while (text[level] === "#") {
				level++;
			}
			return {
				type: "heading",
				content: "inline*",
				text: text.substring(level),
				attrs: {
					level: level,
				},
			};
		}

		// start with - or * will be a bullet list, return { type: 'bullet_list' }
		if (text.startsWith("-") || text.startsWith("*")) {
			return {
				type: "bullet_list",
				content: "list_item+",
				text: text.substring(1),
			};
		}

		// start with {number}., like 1. will be a ordered list, return { type: 'ordered_list' }
		if (text.match(/^\d+\./)) {
			return {
				type: "ordered_list",
				content: "list_item+",
				text: text.substring(1),
			};
		}


		// start with > will be a blockquote, return { type: 'blockquote' }
		if (text.startsWith(">")) {
			return {
				type: "blockquote",
				content: "paragraph+",
				text: text.substring(1),
			};
		}

		// start with --- will be a horizontal_rule, return { type: 'horizontal_rule' }
		if (text.startsWith("---")) {
			return {
				type: "horizontal_rule",
				text: text.substring(3),
			};
		}

		// start with ``` will be a code_block, return { type: 'code_block' }, todo: support for ending with ```
		if (text.startsWith("```")) {
			return {
				type: "code_block",
				text: text.substring(3),
			};
		}

		// start with [text](url) will be a link, return { type: 'link', attrs: { href: url } }
		if (text.startsWith("[")) {
			const end = text.indexOf("]");
			if (end > 0) {
				const linkText = text.substring(1, end);
				const linkUrl = text.substring(end + 2);
				return {
					type: "link",
					text: linkText,
					attrs: {
						href: linkUrl,
					},
				};
			}
		}

		// start with ![text](url) will be a image, return { type: 'image', attrs: { src: url } }
		if (text.startsWith("![")) {
			const end = text.indexOf("]");
			if (end > 0) {
				const linkText = text.substring(2, end);
				const linkUrl = text.substring(end + 2);
				return {
					type: "image",
					text: linkText,
					attrs: {
						src: linkUrl,
					},
				};
			}
		}

		
	}
}