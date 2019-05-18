import * as React from "react"
import * as ReactDOM from "react-dom"
import { useState } from "react"
import io from "socket.io-client"
import "./index.css"

let socket = io ("http://localhost:3000/")

class MessageBoard extends React.Component {
  constructor (props) {
    super (props)
  }

  render () {
    return <ul id="messages">
      {this.props.messages.map (msg => <li> {msg} </li>)}
    </ul>
  }
}

class InputBox extends React.Component {
  constructor (props) {
    super (props)
  }

  render () {
    return <form action="" onSubmit={this.props.onSubmit}>
      <input id="m" autoComplete="off" />
      <button>Send</button>
    </form>
  }
}

class Root extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      messages: ["welcome ^-^/"]
    }
  }

  componentDidMount () {
    socket.on ("chat message", (msg) => {
      this.setState (state => {
        messages: state.messages.concat ([ msg ])
      })
    })
  }

  componentWillUnmount () {
    // TODO
  }

  submitInput = (e) => {
    e.preventDefault ()
    console.log (e.target)
    // socket.emit ('chat message', $('#m') .val ())
    // $('#m') .val ('')
  }

  render () {
    return <>
      <MessageBoard messages={this.state.messages}/>
      <InputBox onSubmit={this.submitInput}/>
    </>
  }
}

ReactDOM.render (
  <Root />,
  document.getElementById ("root"),
)
