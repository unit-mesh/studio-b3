import React from 'react'

export class QuickView extends React.Component {
  constructor (props) {
    super(props)
    this.$container = React.createRef()
  }

  render () {
    return (
      <div>Hello, world</div>
    )
  }
}