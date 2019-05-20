# A simple relay chat app

IRC-like architecture:
- relay only -- not central database for chat history
- chat history can be achieved by independent channel-log bots

![instar-chat-1](https://github.com/xieyuheng/image-link/raw/master/instar-chat/instar-chat-1.png)

## Community

![niconiconi](https://github.com/xieyuheng/image-link/raw/master/niconiconi/niconiconi.gif)

- We enforce C4 as collaboration protocol -- [The C4 RFC](https://rfc.zeromq.org/spec:42/C4)
- [Style Guide](STYLE-GUIDE.md) -- observe the style of existing code and respect it
- [Code of Conduct](CODE-OF-CONDUCT.md)
- A demo instar-chat sever at https://instar-chat.herokuapp.com
- A demo instar-chat clint at https://instar-chat.cicada-lang.now.sh
  - I am sometimes on channel `cicada`, my username is `xieyuheng`

## Contributing

Prepare:
- `npm install; npm run build`

Server:
- code at `/src` (nodejs, expressjs, socket.io, typescript)
- `npm run server`

Web client:
- code at `/web` (react, jsx, parcel-bundler)
- `npm run web`

## License

- [GPLv3](LICENSE)
