'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

const linearEase = t => t;

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  keepWordsTogether = false,
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = linearEase,
  onAnimationComplete,
  stepDuration = 0.35
}) => {
  const elements = useMemo(
    () => animateBy === 'words' ? text.split(' ') : Array.from(text),
    [animateBy, text]
  );
  const [inView, setInView] = useState(false);
  const [completedText, setCompletedText] = useState('');
  const complete = completedText === text;
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;
  const animateKeyframes = useMemo(
    () => buildKeyframes(fromSnapshot, toSnapshots),
    [fromSnapshot, toSnapshots]
  );
  const finalSnapshot = toSnapshots[toSnapshots.length - 1];

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));
  const renderLetter = (segment, index) => {
    const spanTransition = {
      duration: totalDuration,
      times,
      delay: (index * delay) / 1000,
      ease: easing
    };

    return (
      <motion.span
        key={`${text}-${index}`}
        style={{ willChange: inView && !complete && !reducedMotion ? 'transform, filter, opacity' : 'auto' }}
        initial={reducedMotion ? finalSnapshot : fromSnapshot}
        animate={reducedMotion ? finalSnapshot : inView ? animateKeyframes : fromSnapshot}
        transition={reducedMotion ? { duration: 0 } : spanTransition}
        onAnimationComplete={index === elements.length - 1 ? () => {
          setCompletedText(text);
          onAnimationComplete?.();
        } : undefined}
      >
        {segment}
      </motion.span>
    );
  };

  const letterWords = keepWordsTogether && animateBy === 'letters'
    ? text.match(/\S+/g) ?? []
    : null;

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {letterWords
        ? letterWords.map((word, wordIndex) => {
            const firstLetterIndex = letterWords
              .slice(0, wordIndex)
              .reduce((total, previous) => total + previous.length + 1, 0);
            return (
              <span
                className="blur-text-word"
                key={`${text}-word-${wordIndex}`}
                style={{ display: 'inline-flex', flexWrap: 'nowrap', whiteSpace: 'nowrap', marginInlineEnd: '0.28em' }}
              >
                {Array.from(word).map((segment, index) => renderLetter(segment, firstLetterIndex + index))}
              </span>
            );
          })
        : elements.map((segment, index) => (
            <motion.span
              style={{ willChange: inView && !complete && !reducedMotion ? 'transform, filter, opacity' : 'auto' }}
              key={`${text}-${index}`}
              initial={reducedMotion ? finalSnapshot : fromSnapshot}
              animate={reducedMotion ? finalSnapshot : inView ? animateKeyframes : fromSnapshot}
              transition={reducedMotion ? { duration: 0 } : {
                duration: totalDuration,
                times,
                delay: (index * delay) / 1000,
                ease: easing
              }}
              onAnimationComplete={index === elements.length - 1 ? () => {
                setCompletedText(text);
                onAnimationComplete?.();
              } : undefined}
            >
              {segment === ' ' ? '\u00A0' : segment}
              {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
            </motion.span>
          ))}
    </p>
  );
};

export default BlurText;
