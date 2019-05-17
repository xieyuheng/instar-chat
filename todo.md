- recap the conceptual model of express (and socket.io)
- express -- auth example -- one time demo, no db
- classes
  - user
  - group
- change jquery to react
# Requirements
- Minimal required packages
  - Create-React-App
  - React
  - React Router
  - Redux (or Rematch)
- Suggested packages
  - Bootstrap
  - Reactstrap
  - socket.io
# Introduction
- Develop a very basic chat application which contains groups,
  chat window and users.
  A good design is not required
  but it is recommended to use the Bootstrap framework
  and a flex layout.
# Functional Requirements
- Register a new user and login as such
- You need to build a “real” chat app, which means multiple users can open different tab in browser and chat in real time, which means you need to write backend code too.
- Profile (not shown in mockup)
  - Your own user
- Groups
  - Show list of groups.
  - Groups can be added and removed
  - Name of the group can be changed
- Users
  - Show a list of users
  - Users are contained within a group. So when adding a user to a group it means it doesn’t get automatically added to all other groups. Removing a group removes all the users within the group.
  - Users can be added and removed
  - Username can be changed
- Messages
  - Show the messages which were posted within a group
  - Messages can be added by inputting a message in a input box and clicking “Send”
- Unittest
  - Write a React unittest that verifies that a message is added to the chatroom after inputting a message and clicking “Send”
# note
- Users and Messages are stored within a group
  so when opening a different group
  it will load the messages and users within that group.
  Removing a group will also remove all the users
  and messages stored within that group
