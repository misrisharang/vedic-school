import React, { useId } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Decorative leafy sprig (glossy two-tone leaves on a curved stem, curled tendrils).
 * Each leaf flutters around its own base and the whole sprig sways from the bottom.
 * SVG SMIL rotations pivot exactly on each leaf's base; they are not rendered under
 * prefers-reduced-motion.
 */

type Leaf = {
  x: number;
  y: number;
  /** Direction the leaf points, in degrees (0 = right, -90 = up) */
  angle: number;
  length: number;
  width: number;
  /** Flutter period and phase, in seconds */
  dur: number;
  delay: number;
  /** Flutter swing in degrees */
  swing: number;
};

const LEAVES: Leaf[] = [
  { x: 86, y: 216, angle: -158, length: 64, width: 21, dur: 4.6, delay: 0, swing: 4 },
  { x: 86, y: 202, angle: -24, length: 60, width: 20, dur: 5.2, delay: -1.4, swing: 4 },
  { x: 80, y: 180, angle: -152, length: 56, width: 19, dur: 4.2, delay: -2.1, swing: 5 },
  { x: 78, y: 164, angle: -30, length: 54, width: 19, dur: 4.8, delay: -0.6, swing: 5 },
  { x: 71, y: 142, angle: -146, length: 48, width: 16, dur: 3.9, delay: -1.9, swing: 6 },
  { x: 72, y: 126, angle: -36, length: 48, width: 16, dur: 4.4, delay: -3.0, swing: 6 },
  { x: 72, y: 104, angle: -140, length: 42, width: 14, dur: 3.6, delay: -0.9, swing: 7 },
  { x: 73, y: 90, angle: -42, length: 40, width: 14, dur: 4.0, delay: -2.4, swing: 7 },
  { x: 69, y: 70, angle: -134, length: 34, width: 11, dur: 3.3, delay: -1.2, swing: 8 },
  { x: 70, y: 56, angle: -48, length: 32, width: 11, dur: 3.7, delay: -2.8, swing: 8 },
  { x: 71, y: 38, angle: -124, length: 25, width: 9, dur: 3.1, delay: -0.4, swing: 9 },
  { x: 73, y: 28, angle: -58, length: 24, width: 9, dur: 3.4, delay: -1.7, swing: 9 },
  // side branch
  { x: 92, y: 104, angle: -12, length: 30, width: 10, dur: 3.8, delay: -2.2, swing: 7 },
  { x: 100, y: 88, angle: -100, length: 26, width: 9, dur: 3.5, delay: -0.8, swing: 8 },
  { x: 106, y: 74, angle: -20, length: 22, width: 8, dur: 3.2, delay: -1.5, swing: 9 },
];

const SPLINE = '0.45 0 0.55 1';

/**
 * Broad leaf with a long, slightly drooping "drip" tip (like the reference):
 * widest in the first third, edges turning concave towards the tip.
 */
function leafPaths(l: number, w: number) {
  const tipX = l;
  const tipY = w * 0.12;
  const upper = `C ${l * 0.1} ${-w * 1.35}, ${l * 0.52} ${-w * 1.25}, ${l * 0.7} ${-w * 0.45} Q ${l * 0.84} ${-w * 0.06}, ${tipX} ${tipY}`;
  const lower = `Q ${l * 0.8} ${w * 0.32}, ${l * 0.6} ${w * 0.62} C ${l * 0.42} ${w * 1.0}, ${l * 0.1} ${w * 0.85}, 0 0 Z`;
  const outline = `M0 0 ${upper} ${lower}`;
  const lowerHalf = `M0 0 Q ${l * 0.5} ${-w * 0.08} ${tipX} ${tipY} ${lower}`;
  const midrib = `M${l * 0.03} 0 Q ${l * 0.5} ${-w * 0.08} ${l * 0.92} ${tipY * 0.8}`;
  return { outline, lowerHalf, midrib };
}

export function LeafSprig({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const animate = !reduce;
  // Unique gradient ids: the page renders more than one sprig (desktop + mobile), and a
  // shared id could resolve to the hidden copy's <defs>.
  const uid = useId().replace(/:/g, '');
  const leafFill = `leafSprigLeaf-${uid}`;
  const stemFill = `leafSprigStem-${uid}`;

  return (
    <svg
      viewBox="0 0 160 244"
      className={cn('select-none pointer-events-none overflow-visible', className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={leafFill} x1="0" y1="-1" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#5BBE48" />
          <stop offset="45%" stopColor="#1F9437" />
          <stop offset="100%" stopColor="#0A6B2D" />
        </linearGradient>
        <linearGradient id={stemFill} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5C4422" />
          <stop offset="50%" stopColor="#9A7542" />
          <stop offset="100%" stopColor="#6B4F27" />
        </linearGradient>
      </defs>

      <g>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 84 244; 1.6 84 244; -1.2 84 244; 0 84 244"
            keyTimes="0; 0.35; 0.7; 1"
            calcMode="spline"
            keySplines={`${SPLINE}; ${SPLINE}; ${SPLINE}`}
            dur="7.5s"
            repeatCount="indefinite"
          />
        )}

        {/* Stems */}
        <path d="M84 244 C 94 196, 60 156, 72 104" stroke={`url(#${stemFill})`} strokeWidth="6.5" strokeLinecap="round" />
        <path d="M72 104 C 78 74, 66 42, 76 12" stroke={`url(#${stemFill})`} strokeWidth="3.6" strokeLinecap="round" />
        <path
          d="M84 244 C 94 196, 60 156, 72 104 C 78 74, 66 42, 76 12"
          stroke="#E2C493"
          strokeOpacity="0.6"
          strokeWidth="0.9"
          strokeLinecap="round"
          transform="translate(-1.2 0)"
        />
        <path d="M72 118 C 86 108, 100 96, 112 66" stroke={`url(#${stemFill})`} strokeWidth="2.4" strokeLinecap="round" />

        {/* Curled tendrils at the tips */}
        <path d="M76 12 C 78 4, 86 4, 86 10 C 86 14, 81 15, 80 11" stroke="#2E9A3A" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M112 66 C 115 58, 123 59, 122 65 C 121 69, 116 69, 116 65" stroke="#2E9A3A" strokeWidth="1.6" strokeLinecap="round" />

        {/* Leaves */}
        {LEAVES.map((leaf, i) => {
          const { outline, lowerHalf, midrib } = leafPaths(leaf.length, leaf.width);
          const s = leaf.swing;
          return (
            <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}>
              <g>
                {animate && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`0 0 0; ${s} 0 0; ${-s * 0.5} 0 0; ${s * 0.6} 0 0; 0 0 0`}
                    keyTimes="0; 0.3; 0.55; 0.8; 1"
                    calcMode="spline"
                    keySplines={`${SPLINE}; ${SPLINE}; ${SPLINE}; ${SPLINE}`}
                    dur={`${leaf.dur}s`}
                    begin={`${leaf.delay}s`}
                    repeatCount="indefinite"
                  />
                )}
                <path d={outline} fill={`url(#${leafFill})`} />
                <path d={lowerHalf} fill="#055726" fillOpacity="0.38" />
                <path d={midrib} stroke="#9BD87F" strokeOpacity="0.55" strokeWidth="0.8" strokeLinecap="round" />
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
