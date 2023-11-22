import React, { useRef } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { AiBlockEditor } from './ai-block-editor'

const AiBlockView = ( props ) => {
  const $container = useRef()
  console.log(props)

  return (
    <NodeViewWrapper className={'shadow'} ref={$container}>
      <AiBlockEditor content={''} cancel={() => {
        props?.deleteNode()
      }}/>
    </NodeViewWrapper>
  )
}

export default AiBlockView
