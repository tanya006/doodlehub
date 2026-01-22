import { useMemo, memo } from "react";
import "./background.css";

/* ===== IMPORTS (same as before) ===== */
// confetti
import cb1 from "./confetti-b1.svg";
import cb2 from "./confetti-b2.svg";
import cb3 from "./confetti-b3.svg";
import cb4 from "./confetti-b4.svg";
import cb5 from "./confetti-b5.svg";

import cg1 from "./confetti-g1.svg";
import cg2 from "./confetti-g2.svg";
import cg3 from "./confetti-g3.svg";
import cg4 from "./confetti-g4.svg";
import cg5 from "./confetti-g5.svg";

import cp1 from "./confetti-p1.svg";
import cp2 from "./confetti-p2.svg";
import cp3 from "./confetti-p3.svg";
import cp4 from "./confetti-p4.svg";
import cp5 from "./confetti-p5.svg";

import cpi1 from "./confetti-pi1.svg";
import cpi2 from "./confetti-pi2.svg";
import cpi3 from "./confetti-pi3.svg";
import cpi4 from "./confetti-pi4.svg";
import cpi5 from "./confetti-pi5.svg";

import cy1 from "./confetti-y1.svg";
import cy2 from "./confetti-y2.svg";
import cy3 from "./confetti-y3.svg";
import cy4 from "./confetti-y4.svg";
import cy5 from "./confetti-y5.svg";

// shapes
import c1 from "./c1.svg";
import c2 from "./c2.svg";
import c3 from "./c3.svg";
import c4 from "./c4.svg";
import c5 from "./c5.svg";

import r1 from "./r1.svg";
import r2 from "./r2.svg";
import r3 from "./r3.svg";
import r4 from "./r4.svg";
import r5 from "./r5.svg";

import t1 from "./t1.svg";
import t2 from "./t2.svg";
import t3 from "./t3.svg";
import t4 from "./t4.svg";
import t5 from "./t5.svg";

// pencils
import p1 from "./p1.svg";
import p2 from "./p2.svg";
import p3 from "./p3.svg";
import p4 from "./p4.svg";
import p5 from "./p5.svg";

/* ===== ELEMENT LIST ===== */
const elements = [
  cb1,
  cb2,
  cb3,
  cb4,
  cb5,
  cg1,
  cg2,
  cg3,
  cg4,
  cg5,
  cp1,
  cp2,
  cp3,
  cp4,
  cp5,
  cpi1,
  cpi2,
  cpi3,
  cpi4,
  cpi5,
  cy1,
  cy2,
  cy3,
  cy4,
  cy5,
  c1,
  c2,
  c3,
  c4,
  c5,
  r1,
  r2,
  r3,
  r4,
  r5,
  t1,
  t2,
  t3,
  t4,
  t5,
  p1,
  p2,
  p3,
  p4,
  p5,
];

/* ===== RANDOM NON-OVERLAP POSITIONS ===== */
const generatePositions = (count, minDistance = 12) => {
  const positions = [];

  const isFarEnough = (x, y) =>
    positions.every(
      (p) => Math.hypot(p.x - x, p.y - y) > minDistance
    );

  const isOutsideCenter = (x, y) => {
    // center card approx area (middle 30%)
    return !(x > 35 && x < 65 && y > 30 && y < 70);
  };

  while (positions.length < count) {
    const x = Math.random() * 94 + 3;
    const y = Math.random() * 94 + 3;

    if (isFarEnough(x, y) && isOutsideCenter(x, y)) {
      positions.push({ x, y });
    }
  }

  return positions;
};


const BackgroundElements = () => {
  const positions = useMemo(() => generatePositions(elements.length), []);

  return (
    <div className="bg-wrapper">
      {elements.map((src, index) => (
        <img
          key={index}
          src={src}
          alt=""
          className="bg-element"
          style={{
            top: `${positions[index].y}%`,
            left: `${positions[index].x}%`,
            animationDuration: `${4 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
};

export default memo(BackgroundElements);
