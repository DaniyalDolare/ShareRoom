import React, { useState, useRef, useEffect } from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';
import { uploadFile } from '../services/firebase';

export default function UploadFileDialog(props) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // at least one file has been dropped so do something
      console.log('handleDrop ', e.dataTransfer.files);
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // at least one file has been selected so do something
      console.log('handleChange ', e.target.files);
      handleFile(e.target.files[0]);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  function handleFile(fileData) {
    if (fileData.size > 10e6) {
      alert('File size should be less than 10 MB');
    } else {
      setFile(fileData);
    }
  }

  function upload() {
    console.log('upload');
    uploadFile(props.roomId, file, setUploadPercent, setFileUrl);
  }

  useEffect(() => {
    console.log('upload stats: ', uploadPercent, fileUrl);
    if (uploadPercent === 100 && fileUrl !== null) {
      console.log('upload complete');
      props.onUpload(file.name, fileUrl, file.size);
      setFile(null);
      setUploadPercent(null);
      setFileUrl(null);
      props.onHide();
    }
  }, [uploadPercent, fileUrl]);

  return (
    <Modal
      show={props.show}
      onHide={() => {
        setFile(null);
        props.onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Drag and Drop or Select a file to Upload</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <form
            className="d-flex flex-column justify-content-center"
            id="form-file-upload"
            onDragEnter={handleDrag}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              ref={inputRef}
              type="file"
              id="input-file-upload"
              onChange={handleChange}
            />
            {file ? (
              <div className="d-flex flex-column align-items-center gap-2">
                {uploadPercent && (
                  <ProgressBar
                    style={{ width: '50%' }}
                    now={uploadPercent}
                    label={`${uploadPercent}%`}
                  />
                )}
                <button onClick={upload} className="upload-button">
                  Upload {file.name}
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <label
                id="label-file-upload"
                htmlFor="input-file-upload"
                className={dragActive ? 'drag-active' : ''}
              >
                <div>
                  <p>Drag and drop your file here or</p>
                  <button onClick={onButtonClick} className="upload-button">
                    Select a file
                  </button>
                </div>
              </label>
            )}
            {dragActive && (
              <div
                id="drag-file-element"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              ></div>
            )}
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
