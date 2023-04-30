// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  list,
} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBN_n23q4TqFtsAQfyyavD2Izsem2l0gck',
  authDomain: 'share-room-ab265.firebaseapp.com',
  projectId: 'share-room-ab265',
  storageBucket: 'share-room-ab265.appspot.com',
  messagingSenderId: '936075348911',
  appId: '1:936075348911:web:fdc3b203f2decababe7d5a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function uploadFile(roomId, file, setPercent, setFileUrl) {
  const storageRef = ref(storage, `/files/${roomId}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  if (!file) {
    alert('Please choose a file first!');
  }

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const percent = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );

      // update progress
      console.log('percent:=========== ', percent);
      setPercent(percent);
    },
    (err) => console.log(err),
    () => {
      // download url
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log('URL:=========== ', url);
        setFileUrl(url);
      });
    }
  );
}

async function sendMessage(roomId, type, text) {
  try {
    await addDoc(collection(db, 'rooms', roomId, 'messages'), {
      type: type,
      message: text,
      time: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

function getMessages(roomId, callback) {
  console.log('roomid in getMessages ', roomId);
  return onSnapshot(
    query(collection(db, 'rooms', roomId, 'messages'), orderBy('time', 'asc')),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    }
  );
}

async function isRoomExists(roomCode) {
  const docRef = doc(db, 'rooms', roomCode);
  const snapshot = await getDoc(docRef);
  return snapshot.exists();
}

async function createRoom(roomCode) {
  const docRef = doc(db, 'rooms', roomCode);
  const snapshot = await setDoc(docRef, {
    roomid: roomCode,
    createdTime: serverTimestamp(),
    expiryTime: serverTimestamp(),
    serverTime: serverTimestamp(),
  });
}

async function getRoomData(roomCode) {
  const docRef = doc(db, 'rooms', roomCode);
  const snapshot = await getDoc(docRef);
  return snapshot.data();
}

async function deleteRoom(roomCode) {
  const docRef = doc(db, 'rooms', roomCode);
  await deleteDoc(docRef);
  const storageRef = ref(storage, `/files/${roomCode}`);
  (await list(storageRef)).items.forEach(async (fileRef) => {
    console.log(fileRef.fullPath);
    await deleteObject(fileRef);
  });
  console.log('room deleted');
}

function getLiveRoomData(roomCode, setRoomData, setRoomDelete) {
  const docRef = doc(db, 'rooms', roomCode);
  updateDoc(docRef, { serverTime: serverTimestamp() });
  return onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      // Document exists, handle changes or print document data
      console.log('Document data:', docSnapshot.data());
      setRoomData(docSnapshot.data());
    } else {
      // Document does not exist, print "delete"
      console.log('delete');
      setRoomDelete(true);
    }
  });
}

async function setTimestamp() {
  const timestampRef = doc(db, 'timestamps', 'timestamp');
  await setDoc(timestampRef, { timestamp: serverTimestamp() });
}

async function getCurrentTime(setCurrentTime) {
  await setTimestamp();
  const docRef = doc(db, 'timestamps', 'timestamp');
  return onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      // Document exists, handle changes or print document data
      console.log('Document data:', docSnapshot.data());
      const serverTime = docSnapshot.data().timestamp;
      const time = new Date(
        serverTime.seconds * 1000 + serverTime.nanoseconds / 1000000
      );
      setCurrentTime(time);
    }
  });
}

export {
  getRoomData,
  getLiveRoomData,
  sendMessage,
  getMessages,
  isRoomExists,
  createRoom,
  getCurrentTime,
  deleteRoom,
  uploadFile,
};
