import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Chatroom from '../screen/chatroom';
import { isRoomExists, getLiveRoomData } from '../services/firebase';

export default function JoinRoom() {
  const EXPIRETIME = 600;
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [valid, setValid] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [roomDeleted, setRoomDeleted] = useState(false);

  useEffect(() => {
    async function roomJoin(roomId) {
      const exists = await isRoomExists(roomId);
      console.log('room exists: ' + exists);
      if (exists) {
        // const data = await getRoomData(roomId);
        // await getCurrentTime(setCurrentTime);
        // const now = new Date();
        // const expirationTime = new Date(
        //   data.createdtime.seconds * 1000 +
        //     data.createdtime.nanoseconds / 1000000 +
        //     600000
        // );
        // setExpiryTime(expirationTime);
        // const remainingTime = Math.round((expirationTime - now) / 1000);
        // console.log('RemainingTime: ', remainingTime);
        // setRemainingTime(remainingTime);
        // if (remainingTime <= 0) {
        //   setValid(false);
        //   console.log('expire');
        // } else {
        //   setValid(true);
        // }
        setLoading(false);
        setExists(true);
      } else {
        setExists(false);
        setValid(false);
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
        setValid(false);
        console.log('expire');
      } else {
        setValid(true);
      }
    }
  }, [roomData]);

  return loading === false ? (
    exists === true ? (
      roomDeleted === true ? (
        <div>Room has ended</div>
      ) : roomData === null || remainingTime === null ? (
        <div>Joining</div>
      ) : (
        <Chatroom
          roomId={params.roomId}
          duration={remainingTime}
        ></Chatroom>
      )
    ) : (
      <div>Room with code {params.roomId} does not exists</div>
    )
  ) : (
    <div>Joining</div>
  );
}
