import React from 'react';
import { Col, Container, Row, Ratio } from 'react-bootstrap';
import landing from '../images/landing.png';
import realtime from '../images/realtime.png';
import files from '../images/files.png';
import encryption from '../images/encryption.png';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import './../App.css';
import { useEffect, useRef, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const dropdownBtnRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const navigate = useNavigate();
  const [isDropdownInFocus, setIsDropdownInFocus] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const inputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    function checkFocus() {
      if (
        dropdownBtnRef.current.contains(document.activeElement) ||
        dropdownContentRef.current.contains(document.activeElement)
      ) {
        setIsDropdownInFocus(true);
        dropdownContentRef.current.style.display = 'block';
      }
      if (!isDropdownInFocus) {
        dropdownContentRef.current.style.display = 'none';
      }
    }

    const dropdownBtn = dropdownBtnRef.current;
    const dropdownContent = dropdownContentRef.current;
    dropdownContent.style.display = 'none';

    function handleBlur() {
      setTimeout(checkFocus, 0);
    }

    function handleFocus() {
      setIsDropdownInFocus(true);
      dropdownContent.style.display = 'block';
    }

    dropdownBtn.addEventListener('blur', handleBlur);

    dropdownBtn.addEventListener('focus', handleFocus);

    const buttons = dropdownContent.querySelectorAll('button');
    buttons.forEach((button) => {
      button.addEventListener('blur', handleBlur);
    });
  }, [isDropdownInFocus]);

  function handleSubmit(event) {
    if (event !== undefined) event.preventDefault(); // Prevent default form submission behavior

    if (roomCode.length !== 6) {
      setErrorMessage('Room code must be 6 characters');
      return;
    }

    navigate(`room/${roomCode}`);
  }

  return (
    <div id="root">
      <Navbar bg="white" expand="lg">
        <Container>
          <Navbar.Brand href="#home">ShareRoom</Navbar.Brand>
          <Nav className="justify-content-end">
            <button className="signin-btn">Sign in</button>
          </Nav>
        </Container>
      </Navbar>
      <Container className="home-container">
        <Row className="my-auto">
          <Col xs={12} md={12} lg={6} className="my-auto text-start">
            <h1 className="mb-4">
              Share without any <span style={{ color: '#ff725c' }}>care</span>
            </h1>
            <p>
              Seamless sharing of text and file data.
              <br />
              <br />
              Anonymous rooms eliminating the need to share personal
              information.
              <br />
              <br />
              Secure data sharing using password encryption.
            </p>
            {/* <p>
            Anonymous rooms eliminating the need to share personal
              information.
            </p>
            <p>Secure data sharing using password encryption.</p> */}
            <Row className="mt-5 justify-content-center">
              <Col className="m-2" xs={12} md={5} lg={5}>
                <div>
                  <button
                    className="create-btn"
                    onClick={() => navigate('room')}
                  >
                    Create Room
                  </button>
                  <div id="dropdown" className="dropdown">
                    <button ref={dropdownBtnRef} className="down-btn">
                      <BsChevronDown />
                    </button>
                    <div
                      ref={dropdownContentRef}
                      id="dropdown-content"
                      className="dropdown-content"
                    >
                      <button>Basic room</button>
                      <button>Private room</button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="m-2" xs={12} md={5} lg={5}>
                <form
                  id="join-group"
                  className="join-group"
                  onSubmit={(event) => handleSubmit(event)}
                >
                  <input
                    ref={inputRef}
                    onChange={() => {
                      setRoomCode(inputRef.current.value);
                    }}
                    onFocus={() => {
                      const joinGrp = document.getElementById('join-group');
                      joinGrp.style.border = '#ff725c 2px solid';
                    }}
                    onBlur={() => {
                      document.getElementById('join-group').style.border =
                        'gray 1px solid';
                    }}
                    size="10"
                    placeholder="Enter room code"
                    className="join-input"
                  ></input>
                  <button
                    className="join-btn"
                    onClick={() => {
                      handleSubmit();
                    }}
                    type="submit"
                  >
                    <BsChevronRight />
                  </button>
                </form>
                {errorMessage && (
                  <div className="error-msg">{errorMessage}</div>
                )}{' '}
              </Col>
            </Row>
          </Col>
          <Col className="text-center" xs={12} md={12} lg={6}>
            <Ratio
              style={{
                margin: '0px auto',
                maxWidth: '500px',
                minWidth: '300px',
                width: '70%',
              }}
              aspectRatio="1x1"
            >
              <img src={landing} alt="Landing" />
            </Ratio>

            <Row className="features text-center">
              <Col>
                <img src={realtime} alt="Realtime" />
                <p>Realtime</p>
              </Col>
              <Col>
                <img src={encryption} alt="Encryption" />
                <p>Excryption</p>
              </Col>
              <Col>
                <img
                  style={{
                    width: '50%',
                    maxWidth: '50px',
                  }}
                  src={files}
                  alt="Files"
                />
                <p>File Sharing</p>
              </Col>
            </Row>
            {/* <Row className="text-center">
              <Col>Realtime</Col>
              <Col>Excrypted</Col>
              <Col>File Sharing</Col>
            </Row> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
