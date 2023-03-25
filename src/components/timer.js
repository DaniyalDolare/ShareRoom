import React, { useState, useEffect } from 'react';

class WorkerInterval {
  worker = null;
  constructor(callback, interval) {
    const blob = new Blob([`setInterval(() => postMessage(0), ${interval});`]);
    const workerScript = URL.createObjectURL(blob);
    this.worker = new Worker(workerScript);
    this.worker.onmessage = callback;
  }

  stop() {
    this.worker.terminate();
  }
}

function Timer(props) {
  const [time, setTime] = useState(props.duration);

  useEffect(() => {
    console.log('props changes: ', props, time);
    setTime(props.duration);
  }, [props.duration]);

  // useEffect(() => {
  //   let interval = null;
  //   if (time > 0) {
  //     interval = setInterval(() => {
  //       setTime((time) => time - 1);
  //     }, 1000);
  //   } else {
  //     clearInterval(interval);
  //     props.onTimerEnd();
  //   }
  //   return () => clearInterval(interval);
  // }, [time, props]);

  useEffect(() => {
    let interval = null;
    if (time > 0) {
      interval = new WorkerInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else {
      if (interval !== null) interval.stop();
      props.onTimerEnd();
    }
    if (interval !== null) {
      return () => interval.stop();
    }
  }, [time, props]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer">
      {minutes}:{seconds < 10 ? '0' : ''}
      {seconds}
    </div>
  );
}

export { Timer };
