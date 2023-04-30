import React, { useEffect, useRef, useState } from 'react';
import { MdContentCopy, MdAttachFile, MdSend } from 'react-icons/md';
import { sendMessage, getMessages, deleteRoom } from '../services/firebase';
import { Timer } from '../components/timer';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function Chatroom(props) {
  const [roomId, setRoomId] = useState(props.roomId);
  const editable = useRef('');
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomId !== '') {
      const unsubscribe = getMessages(roomId, setMessages);
      return unsubscribe;
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatroom-container mx-auto">
      <nav className="chatroom-nav p-2 align-items-center">
        <button
          onClick={async () => {
            console.log('on end click');
            await deleteRoom(roomId);
          }}
        >
          End
        </button>
        <Timer
          duration={props.duration}
          onTimerEnd={async () => {
            console.log('time endssss');
            await deleteRoom(roomId);
          }}
        />
        <button>Share</button>
      </nav>
      <div className="chats">
        <div className="d-flex p-2 justify-content-center align-items-center">
          <div className="mx-1">Room code is: {roomId}</div>
          <CopyToClipboard text={roomId} onCopy={() => {}}>
            <button className="copy-btn">
              <MdContentCopy />
            </button>
          </CopyToClipboard>
        </div>
        <p className="px-2 text-center">
          This room will get destroyed after 10 minutes
        </p>
        <div className="chat-list">
          {messages.map((msg, index, _) => {
            console.log(msg);
            return <ChatMessage key={index} message={msg} />;
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="chat-input">
        <div className="chat-inputbox">
          <button className="icon-btn">
            <MdAttachFile />
          </button>
          {/* <textarea
            autofocus="autofocus"
            rows="1"
            placeholder="Type message..."
          /> */}
          <div className="editable" ref={editable} contentEditable="true"></div>
          <button
            className="icon-btn"
            onClick={() => {
              const val = editable.current.innerHTML;
              if (val === '') {
                return;
              }
              sendMessage(roomId, 'text', val).then(() =>
                console.log('message sent')
              );
              editable.current.innerHTML = '';
            }}
          >
            <MdSend />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const text = useRef(null);
  const time = useRef(null);

  useEffect(() => {
    text.current.innerHTML = message['message'];
    if (message.time != null)
      time.current.innerHTML = new Date(
        message.time.seconds * 1000 + message.time.nanoseconds / 1000000
      ).toLocaleString([], {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      });
  }, [message]);

  return (
    <div className="chat-message">
      <CopyToClipboard text={message['message']} onCopy={() => {}}>
        <button className="copy-btn">
          <MdContentCopy />
        </button>
      </CopyToClipboard>
      <div className="chat-text">
        <div ref={text}></div>
        {/* <textarea
          value={message['message']}
          type="text"
          disabled
          style={{
            outline: 'none',
            border: 'none',
            backgroundColor: 'transparent',
          }}
        ></textarea> */}
        <div ref={time} style={{ fontSize: 12 }}></div>
      </div>
    </div>
  );
}
