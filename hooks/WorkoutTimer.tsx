import { useEffect, useState } from "react";

export default function useWorkoutTimer() {
    const [timer, setTimer] = useState('00:00');
    useEffect(() => {
        const startTime = Date.now();
      
        const updateElapsedTime = () => { 
          let totalSeconds = Math.round((Date.now() - startTime) / 1000);
          let minutes = Math.floor(totalSeconds / 60);
          let seconds = totalSeconds % 60;
          setTimer((minutes <= 9 ? '0' : '') + minutes + ':' + ((seconds <= 9) ? '0' : '') + seconds);
        }; 
      
        const interval = setInterval(updateElapsedTime, 1000);
      
        return () => {
            clearInterval(interval);
        };
    }, []);
      
    return timer;
}