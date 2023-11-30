import { useEffect } from "react";
import { Editor } from "@tiptap/core";

export function useEditorContentChange(editor: Editor, callback: () => void) {
	useEffect(() => {
		editor.on("update", callback);

		return () => {
			editor.off("update", callback);
		};
	}, [callback, editor]);
}