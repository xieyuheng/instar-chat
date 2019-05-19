import * as React from "react"
import * as ReactDOM from "react-dom"

import io from "socket.io-client"

import "./index.css"

let socket = io ("http://localhost:3000/")

class MessageBoard extends React.Component {
  constructor (props) {
    super (props)
  }

  render () {
    return <>
      <textarea
        id="message-board"
        spellCheck="false"
        readOnly={true}
        value={this.props.text}>
      </textarea>
    </>
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
    this.executeInput (this.state.value)
    this.setState ({
      value: ""
    })
  }

  executeInput = (value) => {
    let words = value.split (" ") .filter (word => word.length > 0)
    if (words.length > 0) {
      if (words [0] .startsWith ("/")) {
        socket.emit ("command", {
          command: words [0],
          args: words.slice (1),
        })
      } else {
        if (this.props.channelname !== null) {
          socket.emit ("message", {
            username: this.props.username,
            channelname: this.props.channelname,
            message: value,
          })
        }
      }
    }
  }

  render () {
    return <form id="input-form"
                 onSubmit={this.submitInput}>
      <input type="text"
             autoComplete="off"
             value={this.state.value}
             onChange={this.inputChange} />
      <button>^</button>
    </form>
  }
}

class ChannelBoard extends React.Component {
  constructor (props) {
    super (props)
  }

  render () {
    let channelButtons = Array.from (
      this.props.text_map.keys ()
    ) .map (channelname => {
      return <p key={channelname}>
        <button
          value={channelname}
          onClick={this.props.onClick}>
          {channelname}
        </button>
      </p>
    })

    return <div id="channel-board">
      {this.props.username !== null &&
       <p>{this.props.username}</p>}
      {channelButtons}
    </div>
  }
}

class InstarChat extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      username: null,
      main_text: "",
      current_channelname: null,
      text_map: new Map (),
    }
  }

  componentDidMount () {
    socket.on ("login", (the) => {
      for (let channelname of the.channelname_array) {
        // TODO
        // use an init `appendTextTo` tp support channel history
        this.appendTextTo ("", channelname)
      }
      this.setState ({
        username: the.username,
      })
    })

    socket.on ("info", (info) => {
      this.appendText ("[info] " + info + "\n")
    })

    socket.on ("join", (channelname) => {
      this.joinChannel (channelname)
    })

    socket.on ("leave", (channelname) => {
      this.appendTextTo ("[leave]", channelname)
      this.state.text_map.delete (channelname)
      this.setState ((state) => ({
        text_map: state.text_map
      }))
    })

    socket.on ("message", (the) => {
      let text = `<${the.username}> ${the.message}\n`
      this.appendTextTo (text, the.channelname)
    })
  }

  appendText = (text) => {
    if (this.state.current_channelname === null) {
      this.setState ((state) => ({
        main_text: state.main_text + text
      }))
    } else {
      this.appendTextTo (text, this.state.current_channelname)
    }
  }

  appendTextTo = (text, channelname) => {
    let old_text = this.state.text_map.get (channelname)
    this.setState ((state) => ({
      text_map: state.text_map.set (
        channelname,
        old_text === undefined ? text : old_text + text,
      )
    }))
  }

  getText = () => {
    if (this.state.current_channelname === null) {
      return this.state.main_text
    } else {
      return this.state.text_map.get (
        this.state.current_channelname
      )
    }
  }

  joinChannel = (channelname) => {
    this.setState ({
      current_channelname: channelname
    })
    // NOTE
    // the following empty appending
    //   is for refreshing `MessageBoard` after `/join`
    this.appendTextTo ("", channelname)
  }

  render () {
    let className = "";
    if (this.state.username !== null) {
      className += " login";
    }
    return <div id="instar-chat"
                className={className}>
      <ChannelBoard
        username={this.state.username}
        text_map={this.state.text_map}
        channelname={this.state.current_channelname}
        onClick={(event) => this.joinChannel (event.target.value)}
      />
      <MessageBoard
        text={this.getText ()} />
      <InputForm
        username={this.state.username}
        channelname={this.state.current_channelname} />
    </div>
  }
}

ReactDOM.render (
  <InstarChat />,
  document.getElementById ("root"),
)
