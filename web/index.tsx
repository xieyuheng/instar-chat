import * as React from "react"
import * as ReactDOM from "react-dom"
import { useState } from "react"
// import io from "socket.io-client/dist/socket.io"
import io from "socket.io-client"
import $ from "jquery"

import "./index.css"

let socket = io ("http://localhost:3000/")

export
class message_t {
  value: string

  constructor (the: {
    value: string
  }) {
    this.value = the.value
  }
}

let MessageBoard = (props: {
  messages: Array <message_t>,
}) => {
  return <ul id="messages">
    {props.messages.map (msg => <li> {msg.value} </li>)}
  </ul>
}

let InputBox = (props: {
  onSubmit: (e: any) => void,
}) => {
  return <>
    <input id="m" autoComplete="off" />
    <button>Send</button>
  </>
}

let Root = () => {
  let [
    messages, setMessages
  ] = useState (new Array <message_t> ())


    socket.on ("chat message", (msg: string) => {
      setMessages (messages.concat ([
        new message_t ({value: msg})
      ]))
    })

    return <>
    <MessageBoard messages={messages} />
    <InputBox onSubmit={(e: any) => {
      e.preventDefault () // prevents page reloading
      console.log (e.target)
      // socket.emit ('chat message', $('#m') .val ())
      // $('#m') .val ('')
    }} />
    </>
}

ReactDOM.render (
  <Root />,
  document.getElementById ("root"),
)
