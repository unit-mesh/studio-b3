import { Editor, Node } from "@tiptap/core";
import { useEffect } from "react";

export const SideBox = ({ editor }: {
	editor: Editor
}) => {
	useEffect(() => {
		editor.state.doc.descendants((node) => {
			// node.type.name === 'heading'
			let isHeadingOne = (node.type as any)['attrs']?.['level']?.default === 1;
			console.log(isHeadingOne)
		});
	}, []);

	// todo: add in right side.

	return <div className={'flex flex-row justify-between'}>
	</div>
};