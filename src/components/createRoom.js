import React, { useEffect, useState } from 'react';
import './../App.css';
import { isRoomExists, createRoom } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import Center from './center';

export default function CreateRoom() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  function generateRoomCode() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let roomCode = '';
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * characters.length);
      roomCode += characters.charAt(index);
    }
    return roomCode;
  }

  useEffect(() => {
    async function generateRoom() {
      let roomCode = generateRoomCode();
      while (await isRoomExists(roomCode)) {
        roomCode = generateRoomCode();
      }
      console.log('room code genrerated ' + roomCode);
      setRoomId(roomCode);
      createRoom(roomCode).then(() => {
        console.log('room created in firebase', new Date());
        navigate(roomCode, { replace: true });
      });
    }
    if (roomId === '') {
      generateRoom();
    }
  }, []);

  return (
    <Center>
      {' '}
      <div>Creating room.. {roomId}</div>
    </Center>
  );
}
