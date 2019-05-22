import * as React from "react"
import * as ReactDOM from "react-dom"

export class MessageBoard extends React.Component {
  constructor (props) {
    super (props)
    this.textarea = React.createRef ()
  }

  componentDidUpdate () {
    let textarea = this.textarea.current
    textarea.scrollTop = textarea.scrollHeight
  }

  render () {
    return <>
      <textarea
        ref={this.textarea}
        id="message-board"
        spellCheck="false"
        readOnly={true}
        value={this.props.text}>
      </textarea>
    </>
  }
}
