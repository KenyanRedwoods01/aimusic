import  { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  data?: number[];
  isPlaying: boolean;
  color?: string;
  barCount?: number;
}

const AudioVisualizer = ({ 
  data, 
  isPlaying, 
  color = 'bg-indigo-500', 
  barCount = 32 
}: AudioVisualizerProps) => {
  const intervalRef = useRef<number | null>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  
  // Generate random data if no data provided
  const visualizerData = data || Array.from({ length: barCount }, () => Math.random() * 100);
  
  // Animate bars when playing
  useEffect(() => {
    if (!barsRef.current) return;
    
    if (isPlaying) {
      let frame = 0;
      
      const updateBars = () => {
        if (!barsRef.current) return;
        
        const bars = barsRef.current.children;
        frame++;
        
        for (let i = 0; i < bars.length; i++) {
          const bar = bars[i] as HTMLElement;
          
          // Create a different animation pattern for each bar
          const height = ((Math.sin(frame / 10 + i) + 1) / 2) * 80 + 20;
          bar.style.height = `${height}%`;
        }
      };
      
      // Start animation
      intervalRef.current = window.setInterval(updateBars, 50);
    } else {
      // Stop animation
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        
        // Reset bars to original heights
        if (barsRef.current) {
          const bars = barsRef.current.children;
          for (let i = 0; i < bars.length; i++) {
            const bar = bars[i] as HTMLElement;
            const originalHeight = visualizerData[i % visualizerData.length];
            const scaledHeight = (originalHeight / 100) * 80 + 20;
            bar.style.height = `${scaledHeight}%`;
          }
        }
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, visualizerData]);
  
  return (
    <div 
      ref={barsRef}
      className="flex items-end h-16 gap-[2px]"
      aria-label="Audio visualizer"
    >
      {Array.from({ length: barCount }).map((_, idx) => {
        const heightPercentage = (visualizerData[idx % visualizerData.length] / 100) * 80 + 20;
        
        return (
          <div
            key={idx}
            className={`w-1 ${color} rounded-t-sm`}
            style={{ height: `${heightPercentage}%` }}
          />
        );
      })}
    </div>
  );
};

export default AudioVisualizer;
 