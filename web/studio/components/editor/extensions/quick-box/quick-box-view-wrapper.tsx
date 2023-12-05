import React, { useRef } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { QuickBoxView } from "./quick-box-view";
import { Editor } from "@tiptap/core";

const QuickBoxViewWrapper = (props?: { editor: Editor }) => {
	const $container = useRef();

	return (
		<NodeViewWrapper className={"shadow"} ref={$container}>
			<QuickBoxView
				content={""}
				cancel={() => {
					props?.editor?.commands.toggleAiBlock({});
					props?.editor?.commands.enableEnter();
				}}
				go={(content: string) => {
					props?.editor?.commands.enableEnter();
					props?.editor?.commands.toggleAiBlock({});
					props?.editor?.commands.callQuickAction(content);
				}}/>
		</NodeViewWrapper>
	);
};

export default QuickBoxViewWrapper;
