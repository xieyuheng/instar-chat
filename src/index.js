let express = require ("express")
let app = express ()
let http = require ("http") .createServer (app)
let io = require ("socket.io") (http)

app.get ("/", (req, res) => {
  res.sendFile (__dirname + "/index.html")
})

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

http.listen (3000, () => {
  console.log ("[info] listen on port 3000")
})
