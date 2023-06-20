import "./Home.css";
import { Socket, io } from "socket.io-client";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import MessageModel from "../../../Models/MessageModel";

let socket: Socket;

function Home(): JSX.Element {

    const [color, setColor] = useState<string>("#000");
    const [nickname, setNickname] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const inputElement = useRef(null);
    useEffect(() => inputElement.current.focus(), [isConnected]);

    function connect(): void {

        // 2. Connecting to backend:
        socket = io("http://localhost:4000");

        // 5. Listening to server messages: 
        socket.on("msg-from-server", (msg: MessageModel) => { // msg-from-server is an event we've invented.
            setMessages(arr => [...arr, msg]);
        });

        setIsConnected(true);
    }

    function send(): void {

        // 4. Sending message to backend: 
        socket.emit("msg-from-client", new MessageModel(text, color, nickname));

        setText("");
        inputElement.current.focus();
    }

    function disconnect(): void {
        // 8. Disconnect from server:
        socket.disconnect();

        setIsConnected(false);
    }

    function handleText(args: ChangeEvent<HTMLInputElement>): void {
        setText(args.target.value);
    }

    function handleEnter(args: KeyboardEvent<HTMLInputElement>): void {
        if (args.key === "Enter") send();
    }

    function handleColor(args: ChangeEvent<HTMLInputElement>): void {
        setColor(args.target.value);
    }

    function handleNickname(args: ChangeEvent<HTMLInputElement>): void {
        setNickname(args.target.value);
    }

    return (
        <div className="Home">

            <label>Color: </label>
            <input type="color" value={color} onChange={handleColor} disabled={isConnected} />
            <span> | </span>

            <label>Nick Name: </label>
            <input type="text" value={nickname} onChange={handleNickname} disabled={isConnected} />
            <span> | </span>

            <button onClick={connect} disabled={isConnected}>Connect</button>
            <span> | </span>

            <button onClick={disconnect} disabled={!isConnected}>Disconnect</button>

            <br /><br />

            <label>Message: </label>
            <input ref={inputElement} type="text" value={text} onChange={handleText}
                disabled={!isConnected} onKeyUp={handleEnter} />

            <button onClick={send} disabled={!isConnected}>Send</button>

            <div className="messages">
                {messages.map((msg, index) => <p key={index}
                    style={{ color: msg.color }}>{msg.nickname} ➡ {msg.text}</p>)}
            </div>

        </div>
    );
}

export default Home;
