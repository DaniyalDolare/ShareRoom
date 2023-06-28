import React from 'react';
import {
  Col,
  Container,
  Row,
  Ratio,
  SplitButton,
  Dropdown,
} from 'react-bootstrap';
import landing from '../images/landing.png';
import realtime from '../images/realtime.png';
import files from '../images/files.png';
import encryption from '../images/encryption.png';
import { BsChevronRight } from 'react-icons/bs';
import './../App.css';
import { useRef, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const inputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

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
          <Navbar.Brand href="/">ShareRoom</Navbar.Brand>
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
            <Row className="mt-5 justify-content-center">
              <Col
                className="d-flex m-2 justify-content-center"
                xs={6}
                md={5}
                lg={5}
                sm={5}
              >
                <SplitButton
                  onClick={() => navigate('room')}
                  className="bg-primary"
                  title="Create Room"
                >
                  <Dropdown.Item onClick={() => navigate('room')} eventKey="1">
                    Basic room
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="2">Private room</Dropdown.Item>
                </SplitButton>
              </Col>
              <Col
                className="d-flex m-2 justify-content-center"
                xs={6}
                md={5}
                lg={5}
                sm={5}
              >
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
          </Col>
        </Row>
      </Container>
    </div>
  );
}
