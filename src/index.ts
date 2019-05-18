import express from "express"
import { Request, Response } from "express"
import http from "http"
import sio from "socket.io"
import nanoid from "nanoid"

class group_t {
  name: string

  constructor (the: {
    name: string
  }) {
    this.name = the.name
  }
}

class message_t {
  name: string
  value: string

  constructor (the: {
    name: string,
    value: string,
  }) {
    this.name = the.name
    this.value = the.value
  }
}

let user_db: Map <string, string> = new Map ()
let group_map: Map <string, group_t> = new Map ()

let app = express ()
let server = http.createServer (app)
let io = sio (server)

io.on ("connection", (socket) => {
  console.log ("[info] a user connected")

  socket.emit ("message", "[info] Welcome ^-^/")
  socket.emit ("message", "[info] commands:")
  socket.emit ("message", "[info]   /register <name> <password>")
  socket.emit ("message", "[info]   /login <name> <password>")
  socket.emit ("message", "[info]   /join <group>")
  socket.emit ("message", "[info]   /leave")

  socket.on ("command", (the => executeCommand (socket, the)))

  socket.on ("disconnect", () => {
    console.log ("[info] a user disconnected")
  })
})

type command_t = (
  socket: sio.Socket,
  args: Array <string>,
) => void

let command_map: Map <string, command_t> = new Map ()

function executeCommand (
  socket: sio.Socket,
  the: {
    command: string,
    args: Array <string>,
  },
) {
  let command = command_map.get (the.command)
  if (command) {
    command (socket, the.args)
  } else {
    socket.emit ("message", `[info] unknown command ${the.command}`)
  }
}

server.listen (3000, () => {
  console.log ("[info] listen on port 3000")
})

command_map.set ("/register", (socket, args) => {
  if (args.length !== 2) {
    socket.emit ("message", `[info] number of args must be 2.`)
    return
  }
  register (socket, args [0], args [1])
})

function register (
  socket: sio.Socket,
  name: string,
  password: string,
) {
  if (user_db.has (name)) {
    console.log ("[info] registration fail")
    socket.emit ("message", `[info] The name: ${name} is used. Please try another name.`)
  } else {
    console.log (`[info] registration success, name: ${name}`)
    user_db.set (name, password)
    socket.emit ("message", `[info] Registration finished. Welcome ${name}.`)
    login (socket, name, password)
  }
}

command_map.set ("/login", (socket, args) => {
  if (args.length !== 2) {
    socket.emit ("message", `[info] number of args must be 2.`)
    return
  }
  login (socket, args [0], args [1])
})

function login (
  socket: sio.Socket,
  name: string,
  password: string,
) {
  if (user_db.has (name)) {
    socket.on ("message", (msg) => {
      console.log ("[info] message:", msg)
      io.emit ("message", msg)
    })
  } else {
  
  }
}
