import express from "express"
import { Request, Response } from "express"
import http from "http"
import socket_io from "socket.io"

let app = express ()
let server = http.createServer (app)
let io = socket_io (server)

io.on ("connection", (socket) => {
  console.log ("a user connected")
  socket.on ("disconnect", () => {
    console.log ("a user disconnected")
  })
})

io.on ("connection", (socket) => {
  socket.on ("chat message", (msg) => {
    console.log ("message: " + msg)
    io.emit ("chat message", msg)
  })
})

server.listen (3000, () => {
  console.log ("[info] listen on port 3000")
})
