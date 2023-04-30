import React from 'react';
import { Modal } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from 'react-icons/md';

export default function ShareDialog(props) {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Open link or Scan QR</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <h5>Use this link to join room</h5>
          <div className="d-flex">
            <a href="{window.location.href}" className="">
              {window.location.href}
            </a>
            <CopyToClipboard
              text={window.location.href}
              onCopy={() => {
                alert('copied');
              }}
            >
              <button className="copy-btn">
                <MdContentCopy />
              </button>
            </CopyToClipboard>
          </div>
          <div className="my-4">OR</div>
          <h5>Scan this QR Code</h5>
          <QRCode
            className="p-4"
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={window.location.href}
          ></QRCode>
        </div>
      </Modal.Body>
    </Modal>
  );
}
