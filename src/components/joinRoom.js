import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chatroom from '../screen/chatroom';
import { isRoomExists, getLiveRoomData } from '../services/firebase';
import Center from './center';

export default function JoinRoom() {
  const EXPIRETIME = 600;
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [roomDeleted, setRoomDeleted] = useState(false);

  useEffect(() => {
    async function roomJoin(roomId) {
      const exists = await isRoomExists(roomId);
      console.log('room exists: ' + exists);
      if (exists) {
        setLoading(false);
        setExists(true);
      } else {
        setExists(false);
        setLoading(false);
      }
    }
    roomJoin(params.roomId);
  }, []);

  // Subscribe to document data changes
  useEffect(() => {
    console.log('loading: ' + loading);
    console.log('exists: ' + exists);
    if (loading === false && exists === true) {
      console.log('Subscribe to document data changes ');
      const unsubscribe = getLiveRoomData(
        params.roomId,
        setRoomData,
        setRoomDeleted
      );
      setLoading(false);
      return unsubscribe;
    }
  }, [loading, exists]);

  // Subscribe to document data changes
  useEffect(() => {
    console.log('on room delete: ' + roomDeleted);
    if (roomDeleted === true) {
      // navigate('/', { replace: true });
    }
  }, [roomDeleted]);

  // On document data change, check expiry and set remaining time
  useEffect(() => {
    console.log('roomData: ', roomData);
    if (roomData !== null && roomData.serverTime !== null) {
      const now = new Date(
        roomData.serverTime.seconds * 1000 +
          roomData.serverTime.nanoseconds / 1000000
      );
      const expirationTime = new Date(
        roomData.createdTime.seconds * 1000 +
          roomData.createdTime.nanoseconds / 1000000 +
          EXPIRETIME * 1000
      );
      const remainingTime = Math.round((expirationTime - now) / 1000);
      console.log('RemainingTime: ', remainingTime);
      setRemainingTime(remainingTime);
      if (remainingTime <= 0) {
        console.log('expire');
      }
    }
  }, [roomData]);

  if (loading === true) {
    return (
      <Center>
        <div>Joining</div>
      </Center>
    );
  }
  if (exists === true) {
    if (roomDeleted === true) {
      return (
        <Center>
          <div>Room has ended</div>
        </Center>
      );
    } else if (roomData === null || remainingTime === null) {
      return (
        <Center>
          <div>Joining</div>
        </Center>
      );
    } else {
      return (
        <Chatroom roomId={params.roomId} duration={remainingTime}></Chatroom>
      );
    }
  } else {
    return (
      <Center>
        <div>Room with code {params.roomId} does not exists</div>
      </Center>
    );
  }
}
