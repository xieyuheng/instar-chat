import * as React from "react"
import * as ReactDOM from "react-dom"

export class InputForm extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      value: ""
    }
  }

  inputChange = (event) => {
    this.setState ({
      value: event.target.value
    })
  }

  submitInput = (event) => {
    event.preventDefault ()
    this.executeInput (this.state.value)
    this.setState ({
      value: ""
    })
  }

  executeInput = (value) => {
    let words = value.split (" ") .filter (word => word.length > 0)
    if (words.length > 0) {
      if (words [0] .startsWith ("/")) {
        this.props.socket.emit ("command", {
          command: words [0],
          args: words.slice (1),
        })
      } else {
        if (this.props.channelname !== null) {
          this.props.socket.emit ("message", {
            username: this.props.username,
            channelname: this.props.channelname,
            message: value,
          })
        }
      }
    }
  }

  render () {
    return <form id="input-form"
                 onSubmit={this.submitInput}>
      <input type="text"
             autoComplete="off"
             value={this.state.value}
             onChange={this.inputChange} />
      <button>^</button>
    </form>
  }
}
