import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'

export class AiBlockView extends React.Component {
  constructor (props) {
    super(props)
    this.$container = React.createRef()
  }

  render () {
    return (
      <NodeViewWrapper className={'shadow'}>
        <textarea>Hello, world</textarea>
      </NodeViewWrapper>
    )
  }
}