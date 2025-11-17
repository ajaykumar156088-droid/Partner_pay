'use client';

import { useState, useRef, useEffect } from 'react';

interface ScratchCardProps {
  amount: number;
  reason: string;
  voucherId: string;
  status: 'pending' | 'scratched' | 'redeemed';
  onScratch: () => void;
  onRedeem: () => void;
}

export default function ScratchCard({ amount, reason, voucherId, status, onScratch, onRedeem }: ScratchCardProps) {
  const [isScratched, setIsScratched] = useState(status === 'scratched' || status === 'redeemed');
  const [isRedeemed, setIsRedeemed] = useState(status === 'redeemed');
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    if (status === 'scratched' || status === 'redeemed') {
      setIsScratched(true);
      setScratchProgress(100);
    }
    if (status === 'redeemed') {
      setIsRedeemed(true);
    }
  }, [status]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isScratched || isRedeemed) return;
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching || isScratched || isRedeemed) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    if (!isScratching) return;
    setIsScratching(false);
    
    if (scratchProgress >= 50 && !isScratched) {
      setIsScratched(true);
      onScratch();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isScratched || isRedeemed) return;
    e.preventDefault();
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching || isScratched || isRedeemed) return;
    e.preventDefault();
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    if (!isScratching) return;
    setIsScratching(false);
    
    if (scratchProgress >= 50 && !isScratched) {
      setIsScratched(true);
      onScratch();
    }
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }
    const progress = (transparentPixels / (canvas.width * canvas.height)) * 100;
    setScratchProgress(Math.min(progress, 100));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isScratched) return;

    const updateCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw scratch-off layer
      ctx.fillStyle = '#9CA3AF'; // Gray scratch-off color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add texture pattern
      ctx.fillStyle = '#6B7280';
      for (let i = 0; i < 50; i++) {
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          2,
          2
        );
      }
    };

    // Initial draw
    updateCanvas();

    // Handle resize
    const resizeObserver = new ResizeObserver(updateCanvas);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isScratched]);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div
        ref={containerRef}
        className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl shadow-2xl overflow-hidden"
        style={{ aspectRatio: '16/10' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-white z-10 overflow-hidden">
          {isRedeemed ? (
            <div className="flex flex-col items-center justify-center h-full w-full px-2">
              <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">✓</div>
              <div className="text-base sm:text-lg font-bold mb-1">Redeemed!</div>
              <div className="text-xl sm:text-2xl font-bold">₹{amount.toLocaleString('en-IN')}</div>
              <div className="text-xs sm:text-sm mt-1 sm:mt-2 text-center opacity-90 px-2">{reason}</div>
            </div>
          ) : isScratched ? (
            <div className="flex flex-col items-center justify-center h-full w-full px-2 py-2">
              <div className="text-2xl sm:text-3xl mb-1">🎉</div>
              <div className="text-sm sm:text-base font-bold mb-1">You Won!</div>
              <div className="text-lg sm:text-xl font-bold mb-1">₹{amount.toLocaleString('en-IN')}</div>
              <div className="text-xs sm:text-sm mt-1 text-center opacity-90 px-2 line-clamp-2">{reason}</div>
              <button
                onClick={onRedeem}
                className="mt-2 sm:mt-3 px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg text-xs sm:text-sm whitespace-nowrap"
              >
                Redeem Now
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full px-2">
              <div className="text-3xl sm:text-4xl mb-2">🎁</div>
              <div className="text-base sm:text-lg font-bold mb-1">Scratch to Reveal</div>
              <div className="text-xs sm:text-sm mt-2 text-center opacity-90 px-2">Swipe your finger to scratch</div>
            </div>
          )}
        </div>

        {/* Scratch-off Layer */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing touch-none"
            style={{ userSelect: 'none' }}
          />
        )}

        {/* Progress Indicator */}
        {!isScratched && scratchProgress > 0 && (
          <div className="absolute bottom-2 left-2 right-2 z-30">
            <div className="bg-black/50 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scratchProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

