import { useEffect } from "react";
import confetti from "canvas-confetti";

const FireworksEffect = () => {
  useEffect(() => {
    // 중앙 폭죽 (1회 실행)
    confetti({
      particleCount: 150,
      spread: 360,
      startVelocity: 50,
      decay: 0.95,
      scalar: 1.2,
      gravity: 0.3,
      ticks: 120,
      origin: { x: 0.5, y: 0.5 },
    });

    // 랜덤 폭죽 실행 함수
    const triggerRandomFireworks = () => {
      confetti({
        particleCount: 50,
        spread: 300,
        startVelocity: 40,
        decay: 0.9,
        scalar: 1.1,
        gravity: 0.4,
        ticks: 100,
        origin: { 
          x: Math.random(), 
          y: Math.random() * 0.5 + 0.25 
        },
      });
    };

    // 0.5초 후 첫번째 랜덤 폭죽 실행
    const timer1 = setTimeout(triggerRandomFireworks, 500);
    // 1초 후 두번째 랜덤 폭죽 실행
    const timer2 = setTimeout(triggerRandomFireworks, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return null;
};

export default FireworksEffect;
