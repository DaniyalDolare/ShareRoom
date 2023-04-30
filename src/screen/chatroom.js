import React, { useEffect, useRef, useState } from 'react';
import {
  MdContentCopy,
  MdAttachFile,
  MdSend,
  MdDownload,
} from 'react-icons/md';
import { sendMessage, getMessages, deleteRoom } from '../services/firebase';
import { Timer } from '../components/timer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ShareDialog from '../components/shareDialog';
import UploadFileDialog from '../components/uploadFIle';

export default function Chatroom(props) {
  const [roomId, setRoomId] = useState(props.roomId);
  const editable = useRef('');
  const chatInput = useRef('');
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const [messages, setMessages] = useState([]);
  const [isShareOpen, setShareOpen] = useState(false);
  const [showUploadDialog, setUploadDialog] = useState(false);

  const handleTextareaInput = () => {
    console.log('============input======== ', editable.current.scrollHeight);
    if (editable.current.scrollHeight < 150) {
      editable.current.style.height = 'auto';
      editable.current.style.height = `${editable.current.scrollHeight}px`;
      chatInput.current.style.maxHeight = `calc(${editable.current.scrollHeight}px + 2em)`;
      console.log('ediatble: ', editable.current.style.height);
      console.log('chatInput: ', chatInput.current.style.maxHeight);
    } else {
      editable.current.style.height = `150px`;
      chatInput.current.style.maxHeight = `calc(150px + 2em)`;
    }
  };

  // useEffect(() => {
  //   editable.current.style.height = 'auto';
  //   editable.current.style.height = `${editable.current.scrollHeight}px`;
  //   chatInput.current.style.maxHeight = `calc(${editable.current.scrollHeight}px + 2em)`;
  // });

  useEffect(() => {
    if (roomId !== '') {
      const unsubscribe = getMessages(roomId, setMessages);
      return unsubscribe;
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCloseShareDialog = () => setShareOpen(false);
  const handleShowShareDialog = () => setShareOpen(true);

  const addUploadFileMessage = (fileName, fileUrl) => {
    sendMessage(roomId, 'file', { fileName: fileName, fileUrl: fileUrl }).then(
      () => console.log('file message sent')
    );
  };

  return (
    <div className="chatroom-container">
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
        <button onClick={handleShowShareDialog}>Share</button>
        <ShareDialog
          show={isShareOpen}
          onHide={handleCloseShareDialog}
        ></ShareDialog>
      </nav>
      <div className="chat-section">
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
        <div ref={chatInput} className="chat-input">
          <div className="chat-inputbox">
            <button onClick={() => setUploadDialog(true)} className="icon-btn">
              <MdAttachFile />
            </button>
            <UploadFileDialog
              roomId={roomId}
              show={showUploadDialog}
              onHide={() => setUploadDialog(false)}
              onUpload={addUploadFileMessage}
            ></UploadFileDialog>
            <textarea
              ref={editable}
              rows={1}
              autoFocus="autofocus"
              id="autoresizing"
              className="auto-resizing-textarea"
              placeholder="Type message..."
              onInput={handleTextareaInput}
              style={{ maxHeight: '150px' }}
            />
            <button
              className="icon-btn"
              onClick={() => {
                const val = editable.current.value;
                if (val === '') {
                  return;
                }
                sendMessage(roomId, 'text', val).then(() =>
                  console.log('message sent')
                );
                editable.current.value = '';
                handleTextareaInput();
              }}
            >
              <MdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const text = useRef(null);
  const time = useRef(null);
  const downloadLink = useRef(null);

  useEffect(() => {
    if (message['type'] === 'text') {
      text.current.innerHTML = message['message'];
    } else {
      text.current.innerHTML = message['message']['fileName'];
    }
    if (message.time != null)
      time.current.innerHTML = new Date(
        message.time.seconds * 1000 + message.time.nanoseconds / 1000000
      ).toLocaleString([], {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      });
  }, [message]);

  return message['type'] === 'text' ? (
    <div className="chat-message">
      <CopyToClipboard text={message['message']} onCopy={() => {}}>
        <button className="copy-btn">
          <MdContentCopy />
        </button>
      </CopyToClipboard>
      <div className="chat-text">
        <div
          style={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }}
          ref={text}
        ></div>
        <div ref={time} style={{ fontSize: 12 }}></div>
      </div>
    </div>
  ) : (
    <div className="chat-message">
      <a
        ref={downloadLink}
        download={message['message']['fileName']}
        href={message['message']['fileUrl']}
        className="copy-btn"
      >
        <MdDownload />
      </a>
      <div className="chat-text">
        <div
          onClick={() => {
            downloadLink.current.click();
          }}
          className="chat-file"
          style={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }}
          ref={text}
        ></div>
        <div ref={time} style={{ fontSize: 12 }}></div>
      </div>
    </div>
  );
}
