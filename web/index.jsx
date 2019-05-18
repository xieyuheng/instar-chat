import * as React from "react"
import * as ReactDOM from "react-dom"

import io from "socket.io-client"

import "./index.css"

let socket = io ("http://localhost:3000/")

class MessageBoard extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      messages: []
    }
  }

  componentDidMount () {
    socket.on ("info", (msg) => {
      this.setState ((state) => ({
        messages: state.messages.concat ([ "[info] " + msg ])
      }))
    })
    socket.on ("message", (msg) => {
      this.setState ((state) => ({
        messages: state.messages.concat ([ msg ])
      }))
    })
  }

  render () {
    let messageList = this.state.messages.map ((msg, index) => {
      return <p key={index.toString ()}> {msg} </p>
    })

    return <pre id="message-board">{messageList}</pre>
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
    return <form onSubmit={this.submitInput}>
      <input type="text"
             autoComplete="off"
             value={this.state.value}
             onChange={this.inputChange} />
      <button>SEND</button>
    </form>
  }
}

class GroupBoard extends React.Component {
  render () {
    return <div id="group-board">

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
    socket.on ("login", (username) => {
      this.setState ({ username: username })
    })
  }

  render () {
    let className = "";
    if (this.state.username) {
      className += " login";
    }
    return <div id="instar-chat"
                className={className}>
      <GroupBoard />
      <MessageBoard />
      <InputForm />
    </div>
  }
}

ReactDOM.render (
  <InstarChat />,
  document.getElementById ("root"),
)
