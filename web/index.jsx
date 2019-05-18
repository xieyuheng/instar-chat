import * as React from "react"
import * as ReactDOM from "react-dom"
import { useState } from "react"

import nanoid from "nanoid"

import io from "socket.io-client"

import "./index.css"

let socket = io ("http://localhost:3000/")

class MessageBoard extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      messages: ["welcome ^-^/"]
    }
  }

  componentDidMount () {
    socket.on ("chat message", (msg) => {
      if (msg.length > 0) {
        this.setState ((state) => ({
          messages: state.messages.concat ([ msg ])
        }))
      }
    })
  }

  render () {
    let messageList = this.state.messages.map ((msg, index) => {
      return <li key={index.toString ()}> {msg} </li>
    })

    return <ul id="messages">{messageList}</ul>
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
    socket.emit ("chat message", this.state.value)
    this.setState ({
      value: ""
    })
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

class Root extends React.Component {
  render () {
    return <>
      <MessageBoard />
      <InputForm />
    </>
  }
}

ReactDOM.render (
  <Root />,
  document.getElementById ("root"),
)
