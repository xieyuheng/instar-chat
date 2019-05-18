import express from "express"
import { Request, Response } from "express"
import http from "http"
import sio from "socket.io"
import nanoid from "nanoid"

const PORT = 3000

// class group_t {
//   name: string

//   constructor (the: {
//     name: string
//   }) {
//     this.name = the.name
//   }
// }

// class message_t {
//   name: string
//   value: string

//   constructor (the: {
//     name: string,
//     value: string,
//   }) {
//     this.name = the.name
//     this.value = the.value
//   }
// }

let user_map: Map <string, string> = new Map ()
// let group_map: Map <string, group_t> = new Map ()

let app = express ()
let server = http.createServer (app)
let io = sio (server)

io.on ("connection", (socket) => {
  console.log ("[instar-chat] a user connected")

  socket.emit ("info", "welcome ^-^/")
  socket.emit ("info", "commands:")
  socket.emit ("info", "  /register <name> <password>")
  socket.emit ("info", "  /login <name> <password>")
  socket.emit ("info", "  /join <group>")
  socket.emit ("info", "  /leave")

  socket.on ("command", (the => executeCommand (socket, the)))

  socket.on ("disconnect", () => {
    console.log ("[instar-chat] a user disconnected")
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
    socket.emit ("info", `unknown command ${the.command}`)
  }
}

server.listen (PORT, () => {
  console.log ("[instar-chat] listen on port 3000")
})

command_map.set ("/register", (socket, args) => {
  if (args.length !== 2) {
    socket.emit ("info", `number of args must be 2.`)
    return
  }

  register (socket, args [0], args [1])
})

command_map.set ("/login", (socket, args) => {
  if (args.length !== 2) {
    socket.emit ("info", `number of args must be 2.`)
    return
  }
  login (socket, args [0], args [1])
})

function register (
  socket: sio.Socket,
  username: string,
  password: string,
) {
  if (user_map.has (username)) {
    socket.emit ("info", `username: ${username} is used. please try another one.`)
  } else {
    user_map.set (username, password)
    socket.emit ("info", `successful registration, username ${username}.`)
    login (socket, username, password)
  }
}

function login (
  socket: sio.Socket,
  username: string,
  password: string,
) {
  if (user_map.has (username)) {
    if (password === user_map.get (username)) {
      socket.emit ("login", {
        username,
        groups: {
          // TODO
        },
      })
      socket.on ("message", (msg) => {
        io.emit ("message", msg)
      })
    } else {
      socket.emit ("info", "login fail.")
      socket.emit ("info", "  wrong password.")
    }
  } else {
    socket.emit ("info", "login fail.")
    socket.emit ("info", `  username: ${username} does not exist.`)
  }
}
