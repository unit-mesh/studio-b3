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
	parse(text: string): string {
		return "paragraph";
	}
}