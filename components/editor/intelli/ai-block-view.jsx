import React, { useRef } from 'react'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { AiBlockEditor } from './ai-block-editor'

const AiBlockView = ({ node: { attrs: { language: defaultLanguage } }, updateAttributes, extension }) => {
  const $container = useRef()
  console.log(updateAttributes)

  return (
    <NodeViewWrapper className={'shadow'} ref={$container}>
      <AiBlockEditor content={''}/>
    </NodeViewWrapper>
  )
}

export default AiBlockView
