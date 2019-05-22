import * as React from "react"
import * as ReactDOM from "react-dom"

import { InstarChat } from "./components/InstarChat"

import io from "socket.io-client"

import "./index.css"

// let socket = io ("http://localhost:3000/")
let socket = io ("https://instar-chat.herokuapp.com/")

ReactDOM.render (
  <InstarChat socket={socket} />,
  document.getElementById ("root"),
)
