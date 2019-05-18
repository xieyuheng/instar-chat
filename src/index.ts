import express from "express"
import { Request, Response } from "express"
import http from "http"
import sio from "socket.io"
import nanoid from "nanoid"

const PORT = 3000

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

let user_map: Map <string, {
  password: string,
  groups: Set <string>,
}> = new Map ()

let socket_map: Map <string, string> = new Map ()

let app = express ()
let server = http.createServer (app)
let io = sio (server)

io.on ("connection", (socket) => {
  console.log (
    `[instar-chat] ` +
      `${socket.id} socket connected`
  )

  socket.emit ("info", "welcome to instar-char ^-^/")
  socket.emit ("info", "commands:")
  socket.emit ("info", "  /register <username> <password>")
  socket.emit ("info", "  /login <username> <password>")
  socket.emit ("info", "  /join <groupname>")
  socket.emit ("info", "  /leave <groupname>")
  socket.emit ("info", "  /info")

  socket.on ("command", (the => executeCommand (socket, the)))

  socket.on ("disconnect", () => {
    socket_map.delete (socket.id)
    console.log (
      `[instar-chat] ` +
        `${socket.id} socket disconnected`
    )
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
  console.log (
    `[instar-chat] ` +
      `listen on port 3000`
  )
})

command_map.set ("/register", (socket, args) => {
  if (args.length !== 2) {
    socket.emit ("info", "command /register takes 2 arguments")
    socket.emit ("info", "  /register <username> <password>")
  } else {
    register (socket, args [0], args [1])
  }
})

command_map.set ("/login", (socket, args) => {
  if (args.length !== 2) {
    socket.emit ("info", "command /login takes 2 arguments")
    socket.emit ("info", "  /login <username> <password>")
  } else {
    login (socket, args [0], args [1])
  }
})

command_map.set ("/join", (socket, args) => {
  if (args.length !== 1) {
    socket.emit ("info", "command /join takes 1 argument")
    socket.emit ("info", "  /join <groupname>")
  } else {
    join (socket, args [0])
  }
})

command_map.set ("/leave", (socket, args) => {
  if (args.length !== 1) {
    socket.emit ("info", "command /leave takes 1 argument")
    socket.emit ("info", "  /leave <groupname>")
  } else {
    leave (socket, args [0])
  }
})

command_map.set ("/info", (socket, args) => {
  if (args.length !== 0) {
    socket.emit ("info", "command /info takes no argument")
  } else {
    info (socket)
  }
})

function register (
  socket: sio.Socket,
  username: string,
  password: string,
) {
  if (user_map.has (username)) {
    socket.emit ("info", `username: ${username} is used. please try another one`)
  } else {
    user_map.set (username, {
      password, groups: new Set (),
    })
    socket.emit ("info", `successful registration, username: ${username}`)
    login (socket, username, password)
  }
}

function login (
  socket: sio.Socket,
  username: string,
  password: string,
) {
  let the = user_map.get (username)
  if (the !== undefined) {
    if (password === the.password) {
      socket_map.set (socket.id, username)
      socket.emit ("login", {
        username,
        groups: the.groups,
      })
      socket.emit ("info", "successful login")
      socket.on ("message", (msg) => {
        io.emit ("message", msg)
      })
    } else {
      socket.emit ("info", "login fail")
      socket.emit ("info", `  wrong password`)
    }
  } else {
    socket.emit ("info", "login fail")
    socket.emit ("info", `  username: ${username} does not exist`)
  }
}

function join (
  socket: sio.Socket,
  groupname: string,
) {
  socket.join (groupname)
  let username = socket_map.get (socket.id) as string
  let the = user_map.get (username) as {
    groups: Set <string>
  }
  the.groups.add (groupname)
}

function leave (
  socket: sio.Socket,
  groupname: string,
) {
  socket.leave (groupname)
  let username = socket_map.get (socket.id) as string
  let the = user_map.get (username) as {
    groups: Set <string>
  }
  the.groups.delete (groupname)
}

function info (
  socket: sio.Socket,
) {
  socket.emit ("info", JSON.stringify ({
    "id": socket.id,
    "handshake": socket.handshake,
  }, null, 2))
}
