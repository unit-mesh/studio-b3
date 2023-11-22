import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'

export class QuickView extends React.Component {
  constructor (props) {
    super(props)
    this.$container = React.createRef()
  }

  render () {
    return (
      <NodeViewWrapper>
        <div>Hello, world</div>
      </NodeViewWrapper>
    )
  }
}