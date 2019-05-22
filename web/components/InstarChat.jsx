import * as React from "react"
import * as ReactDOM from "react-dom"

import { MessageBoard } from "./MessageBoard"
import { ChannelBoard } from "./ChannelBoard"
import { InputForm } from "./InputForm"

export class InstarChat extends React.Component {
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
    this.props.socket.on ("login", (the) => {
      for (let channelname of the.channelname_array) {
        /** NOTE
         * We can use an init `appendTextTo`
         *   to support channel history.
         * History can be pulled from independent API.
         */
        this.appendTextTo ("", channelname)
      }
      this.setState ({
        username: the.username,
      })
    })

    this.props.socket.on ("info", (info) => {
      this.appendText ("[info] " + info + "\n")
    })

    this.props.socket.on ("join", (channelname) => {
      this.joinChannel (channelname)
    })

    this.props.socket.on ("leave", (channelname) => {
      this.appendTextTo (`[left ${channelname}]`, channelname)
      this.state.text_map.delete (channelname)
      this.setState ((state) => ({
        text_map: state.text_map
      }))
    })

    this.props.socket.on ("message", (the) => {
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
    /** NOTE
     * The following empty appending
     *   is for refreshing `MessageBoard` after `/join`.
     */
    this.appendTextTo ("", channelname)
  }

  render () {
    let className = "";
    if (this.state.username !== null) {
      className += " login";
    }
    return <span id="instar-chat"
                 className={className}>
      <ChannelBoard
        username={this.state.username}
        text_map={this.state.text_map}
        channelname={this.state.current_channelname}
        onClick={(event) => {
          if (event.target.value) {
            this.joinChannel (event.target.value)
          }
        }}
      />
      <MessageBoard
        text={this.getText ()} />
      <InputForm
        socket={this.props.socket}
        username={this.state.username}
        channelname={this.state.current_channelname} />
    </span>
  }
}
