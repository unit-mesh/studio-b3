import { Extension } from "@tiptap/core";

const EXTENSION_NAME = "advice";

// https://dev.to/sereneinserenade/how-i-implemented-google-docs-like-commenting-in-tiptap-k2k
export const AdviceExtension = Extension.create({
	name: EXTENSION_NAME,
});