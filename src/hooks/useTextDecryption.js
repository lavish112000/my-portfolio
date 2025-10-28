/**
 * useTextDecryption Hook
 * Handles the animated text decryption effect
 */
import { useState, useEffect, useCallback } from 'react';
import { RANDOM_CHARS } from '../constants/navigation';

export const useTextDecryption = (fullText, shouldAnimate = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const startDecryption = useCallback(() => {
    if (!shouldAnimate || animationCompleted || isAnimating) return;

    setIsAnimating(true);
    const textLength = fullText.length;
    let currentIndex = 0;

    const decryptInterval = setInterval(() => {
      if (currentIndex < textLength) {
        setDisplayedText(prev => {
          const realPart = fullText.substring(0, currentIndex + 1);
          const randomPart = Array.from({ length: Math.min(20, textLength - currentIndex - 1) })
            .map(() => RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)])
            .join('');
          return realPart + randomPart;
        });
        currentIndex++;
      } else {
        setDisplayedText(fullText);
        setIsAnimating(false);
        setAnimationCompleted(true);
        clearInterval(decryptInterval);
      }
    }, 15);

    return () => clearInterval(decryptInterval);
  }, [fullText, shouldAnimate, animationCompleted, isAnimating]);

  return {
    displayedText,
    isAnimating,
    animationCompleted,
    startDecryption
  };
};
