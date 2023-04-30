import React, { useEffect, useRef, useState } from 'react';
import { MdContentCopy, MdAttachFile, MdSend } from 'react-icons/md';

export default function Temp() {
  const editable = useRef('');
  const chatInput = useRef('');

  const handleTextareaInput = () => {
    if (editable.current.scrollHeight < 150) {
      editable.current.style.height = 'auto';
      editable.current.style.height = `${editable.current.scrollHeight}px`;
      chatInput.current.style.maxHeight = `calc(${editable.current.scrollHeight}px + 2em)`;
      console.log('ediatble: ', editable.current.style.height);
      console.log('chatInput: ', chatInput.current.style.maxHeight);
    }
  };

  useEffect(() => {
    editable.current.style.height = 'auto';
    editable.current.style.height = `${editable.current.scrollHeight}px`;
    chatInput.current.style.maxHeight = `calc(${editable.current.scrollHeight}px + 2em)`;
  });

  return (
    <div
      className="d-flex flex-column"
      style={{ width: '100%', height: '100%', overflow: 'none' }}
    >
      <div style={{ width: '100%', height: '50px', backgroundColor: 'blue' }}>
        Navbar
      </div>
      <div
        className="d-flex flex-column"
        style={{
          flex: '1 1 1px',
          overflow: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '50px',
            backgroundColor: 'yellow',
            flex: '1 1 1px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: 'orange',
              height: '200px',
              margin: '10px 0px ',
            }}
          >
            Chat
          </div>
        </div>

        <div
          style={{
            width: '100%',
            maxHeight: '120px',
            backgroundColor: 'green',
            flex: '1 1 1px',
            padding: '0.5em',
          }}
          //   className="chat-input"
          ref={chatInput}
        >
          <div className="chat-inputbox">
            <button className="icon-btn">
              <MdAttachFile />
            </button>
            <textarea
              ref={editable}
              rows={1}
              autoFocus="true"
              autofocus="autofocus"
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
