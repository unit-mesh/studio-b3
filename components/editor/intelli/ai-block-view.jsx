import React, { useRef } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { AiBlockEditor } from './ai-block-editor'

const AiBlockView = ( props ) => {
  const $container = useRef()

  return (
    <NodeViewWrapper className={'shadow'} ref={$container}>
      <AiBlockEditor content={''} cancel={() => {
        props?.editor?.commands.toggleAiBlock()
        props?.editor?.commands.enableEnter()
      }}/>
    </NodeViewWrapper>
  )
}

export default AiBlockView
