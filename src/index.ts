import express from "express"
import { Request, Response } from "express"
import http from "http"
import sio from "socket.io"

const PORT = 3000

let user_map: Map <string, {
  password: string,
  channelname_set: Set <string>,
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
  socket.emit ("info", "  /join <channelname>")
  socket.emit ("info", "  /leave <channelname>")
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
    socket.emit ("info", "  /join <channelname>")
  } else {
    join (socket, args [0])
  }
})

command_map.set ("/leave", (socket, args) => {
  if (args.length !== 1) {
    socket.emit ("info", "command /leave takes 1 argument")
    socket.emit ("info", "  /leave <channelname>")
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
      password, channelname_set: new Set (),
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
      /** NOTE
       * `the.channelname_set` is converted to `Array`
       *   because socket.io can not serialize `Set`
       */
      let channelname_array = Array.from (the.channelname_set)
      socket.emit ("login", { username, channelname_array })
      socket.emit ("info", "successful login")
      for (let channelname of channelname_array) {
        join (socket, channelname)
      }
      socket.on ("message", the => {
        io.to (the.channelname) .emit ("message", the)
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
  channelname: string,
) {
  let username = socket_map.get (socket.id)
  if (username === undefined) {
    socket.emit ("info", "join fail")
    socket.emit ("info", "  fail to get username")
  } else {
    let the = user_map.get (username)
    if (the === undefined) {
      socket.emit ("info", "join fail")
      socket.emit ("info", "  fail to get channelname_set")
    } else {
      the.channelname_set.add (channelname)
      socket.join (channelname)
      socket.emit ("join", channelname)
    }
  }
}

function leave (
  socket: sio.Socket,
  channelname: string,
) {
  let username = socket_map.get (socket.id)
  if (username === undefined) {
    socket.emit ("info", "leave fail")
    socket.emit ("info", "  fail to get username")
  } else {
    let the = user_map.get (username)
    if (the === undefined) {
      socket.emit ("info", "leave fail")
      socket.emit ("info", "  fail to get channelname_set")
    } else {
      the.channelname_set.delete (channelname)
      socket.leave (channelname)
      socket.emit ("leave", channelname)
    }
  }
}

function info (
  socket: sio.Socket,
) {
  socket.emit ("info", JSON.stringify ({
    "id": socket.id,
    "handshake": socket.handshake,
  }, null, 2))
}
