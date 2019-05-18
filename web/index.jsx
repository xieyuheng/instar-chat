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
        if (this.props.groupname !== null) {
          socket.emit ("message", {
            username: this.props.username,
            groupname: this.props.groupname,
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

class GroupBoard extends React.Component {
  constructor (props) {
    super (props)
  }

  render () {
    let groupButtons = Array.from (
      this.props.text_map.keys ()
    ) .map (groupname => {
      return <p key={groupname}>
        <button
          value={groupname}
          onClick={this.props.onClick}>
          {groupname}
        </button>
      </p>
    })

    return <div id="group-board">
      {this.props.username !== null &&
       <p>{this.props.username}</p>}
      {groupButtons}
    </div>
  }
}

class InstarChat extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      username: null,
      main_text: "",
      current_groupname: null,
      text_map: new Map (),
    }
  }

  componentDidMount () {
    socket.on ("login", (the) => {
      for (let groupname of the.groupname_array) {
        // TODO
        // use an init `appendTextTo` tp support group history
        this.appendTextTo ("", groupname)
      }
      this.setState ({
        username: the.username,
      })
    })

    socket.on ("info", (info) => {
      this.appendText ("[info] " + info + "\n")
    })

    socket.on ("join", (groupname) => {
      this.joinGroup (groupname)
    })

    socket.on ("leave", (groupname) => {
      this.appendTextTo ("[leave]", groupname)
      this.state.text_map.delete (groupname)
      this.setState ((state) => ({
        text_map: state.text_map
      }))
    })

    socket.on ("message", (the) => {
      let text = `${the.username}: ${the.message}\n`
      this.appendTextTo (text, the.groupname)
    })
  }

  appendText = (text) => {
    if (this.state.current_groupname === null) {
      this.setState ((state) => ({
        main_text: state.main_text + text
      }))
    } else {
      this.appendTextTo (text, this.state.current_groupname)
    }
  }

  appendTextTo = (text, groupname) => {
    let old_text = this.state.text_map.get (groupname)
    this.setState ((state) => ({
      text_map: state.text_map.set (
        groupname,
        old_text === undefined ? text : old_text + text,
      )
    }))
  }

  getText = () => {
    if (this.state.current_groupname === null) {
      return this.state.main_text
    } else {
      return this.state.text_map.get (
        this.state.current_groupname
      )
    }
  }

  joinGroup = (groupname) => {
    console.log ("joinGroup:", groupname)
    this.setState ({
      current_groupname: groupname
    })
    // the following empty appending
    //   is for refreshing `MessageBoard` after `/join`
    this.appendTextTo ("", groupname)
  }

  render () {
    let className = "";
    if (this.state.username !== null) {
      className += " login";
    }
    return <div id="instar-chat"
                className={className}>
      <GroupBoard
        username={this.state.username}
        text_map={this.state.text_map}
        groupname={this.state.current_groupname}
        onClick={(event) => {
          console.log ("kkk:", event.target.value)
          this.joinGroup (event.target.value)
        }} />
      <MessageBoard
        text={this.getText ()} />
      <InputForm
        username={this.state.username}
        groupname={this.state.current_groupname} />
    </div>
  }
}

ReactDOM.render (
  <InstarChat />,
  document.getElementById ("root"),
)
