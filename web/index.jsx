import * as React from "react"
import * as ReactDOM from "react-dom"

import io from "socket.io-client"

import "./index.css"

let socket = io ("http://localhost:3000/")

class MessageBoard extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      text: ""
    }
  }

  componentDidMount () {
    socket.on ("info", (msg) => {
      this.setState ((state) => ({
        text: state.text + "[info] " + msg + "\n"
      }))
    })
    socket.on ("message", (msg) => {
      this.setState ((state) => ({
        text: state.text + msg + "\n"
      }))
    })
  }

  render () {
    return <textarea
             id="message-board"
             spellCheck="false"
             readOnly={true}
             value={this.state.text}>
    </textarea>
  }
}

class InputForm extends React.Component {
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
        socket.emit ("command", {
          command: words [0],
          args: words.slice (1),
        })
      } else {
        socket.emit ("message", value)
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

class GroupBoard extends React.Component {
  constructor (props) {
    super (props)
  }

  render () {
    return <div id="group-board">
      {this.props.username !== null &&
       <p>{this.props.username}</p>}
    </div>
  }
}

class InstarChat extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      username: null
    }
  }

  componentDidMount () {
    socket.on ("login", (the) => {
      this.setState ({ username: the.username })
    })
  }

  render () {
    let className = "";
    if (this.state.username !== null) {
      className += " login";
    }
    return <div id="instar-chat"
                className={className}>
      <GroupBoard username={this.state.username} />
      <MessageBoard />
      <InputForm />
    </div>
  }
}

ReactDOM.render (
  <InstarChat />,
  document.getElementById ("root"),
)
