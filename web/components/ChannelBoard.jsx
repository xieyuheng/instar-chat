import * as React from "react"
import * as ReactDOM from "react-dom"

export class ChannelBoard extends React.Component {
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
          {this.props.channelname === channelname
          ? <b>{channelname}</b>
          : channelname}
        </button>
      </p>
    })

    return <div id="channel-board">
      {this.props.username !== null &&
       <p id="usericon">{"<" + this.props.username + ">"}</p>}
      {channelButtons}
    </div>
  }
}
