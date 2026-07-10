import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Activity, Info, Sparkles } from 'lucide-react';

interface RamBoostViewProps {
  addConsoleLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
  onOptimizeSystem: () => void;
}

export default function RamBoostView({ addConsoleLog, onOptimizeSystem }: RamBoostViewProps) {
  const [isBoosting, setIsBoosting] = useState(false);
  const [currentLoad, setCurrentLoad] = useState(64); // %
  const [totalMemory] = useState(16.0); // GB
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataPointsRef = useRef<number[]>(Array(50).fill(64));
  const animationFrameRef = useRef<number | null>(null);

  // Animate the oscilloscope canvas graph representing memory allocation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = (rect?.width || 600) * window.devicePixelRatio;
      canvas.height = 200 * window.devicePixelRatio;
      canvas.style.width = '100%';
      canvas.style.height = '200px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let offset = 0;

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = 200;

      // Clear with deep tech blue tint
      ctx.fillStyle = '#09090F';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = '#151522';
      ctx.lineWidth = 1;
      
      // Moving grid vertical lines
      const gridSpacing = 40;
      const xScroll = offset % gridSpacing;
      for (let x = -xScroll; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Append new value with slight random fluctuation based on currentLoad
      if (!isBoosting) {
        const nextVal = currentLoad + (Math.random() - 0.5) * 3;
        const boundedVal = Math.min(Math.max(nextVal, 10), 95);
        dataPointsRef.current.shift();
        dataPointsRef.current.push(boundedVal);
      } else {
        // If boosting, data points drop dramatically
        const targetVal = currentLoad;
        dataPointsRef.current.shift();
        dataPointsRef.current.push(targetVal);
      }

      // Draw active memory line
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#39FF14';
      ctx.strokeStyle = '#39FF14';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const step = width / (dataPointsRef.current.length - 1);
      dataPointsRef.current.forEach((point, idx) => {
        const x = idx * step;
        // Transform percentage to height coordinate (higher percentage = higher point = lower Y coordinate)
        const y = height - (point / 100) * (height - 40) - 20;
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Area fill gradient below line
      ctx.shadowBlur = 0; // disable shadow for fill
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(57, 255, 20, 0.15)');
      gradient.addColorStop(1, 'rgba(57, 255, 20, 0.00)');
      ctx.fillStyle = gradient;
      
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Render oscilloscope scanline
      offset += 1.5;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentLoad, isBoosting]);

  // Execute deep RAM optimization
  const handleRamBoost = () => {
    setIsBoosting(true);
    addConsoleLog('Connecting to virtual memory pages...', 'info');
    addConsoleLog('Querying OS page caches and task working sets...', 'info');

    // Simulate high-fidelity boost phases
    setTimeout(() => {
      addConsoleLog('Invoking kernel32 API FlushMemoryPools...', 'info');
      // Rapid memory drop transition
      let intervalCount = 0;
      const dropInterval = setInterval(() => {
        setCurrentLoad((prev) => {
          const next = prev - 8;
          if (next <= 34) {
            clearInterval(dropInterval);
            return 32;
          }
          return next;
        });
        
        // Push intermediate drop points into graph for dynamic visuals
        dataPointsRef.current.shift();
        dataPointsRef.current.push(64 - (intervalCount * 8));
        intervalCount++;
      }, 80);
    }, 800);

    setTimeout(() => {
      addConsoleLog('[OK] Completed deep compaction of active handles.', 'success');
      addConsoleLog('Flushed physical working set memory. Recovered 4.8 GB swap caches.', 'success');
      
      setIsBoosting(false);
      onOptimizeSystem(); // Update status of overall system to secured
    }, 2000);
  };

  const usedMem = (totalMemory * (currentLoad / 100)).toFixed(1);
  const freeMem = (totalMemory * ((100 - currentLoad) / 100)).toFixed(1);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" id="ram-tab-content">
      {/* View Intro */}
      <div>
        <div className="flex items-center gap-2">
          <Cpu className="h-4.5 w-4.5 text-cyber-green" />
          <h2 className="font-mono font-bold text-xs text-white tracking-widest uppercase">RAM_BOOST // PAGING_COMPACTION</h2>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 max-w-2xl font-sans leading-relaxed">
          Frees unused dynamic RAM mapping sectors by releasing unused process resources and calling native Windows Page APIs. 
          Reduces system pagefile swapping for improved real-time frame rates.
        </p>
      </div>

      {/* Oscilloscope Neon Graph Canvas */}
      <div className="bg-cyber-card border border-cyber-border rounded overflow-hidden flex flex-col">
        <div className="bg-cyber-deep px-4 py-2 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-cyber-green animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyber-green tracking-widest uppercase">LIVE_MEMORY_SCOPE_(PHYSICAL_COMPACTION)</span>
          </div>
          <span className="text-[9px] font-mono text-gray-500">SWEEP_RATE: 1.5ms</span>
        </div>
        
        <div className="p-3 bg-cyber-deep">
          <canvas ref={canvasRef} className="rounded border border-cyber-border/40 overflow-hidden" />
        </div>
      </div>

      {/* Dynamic Hardware Stats panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-card border border-cyber-border p-3.5 rounded hover:border-cyber-green/45 hover:shadow-[0_0_10px_rgba(57,255,20,0.03)] transition-all">
          <span className="text-[9px] font-mono text-gray-500 uppercase block">ACTIVE_LOAD</span>
          <span className="text-xl font-mono font-bold text-cyber-green neon-text-green mt-0.5 block">
            {currentLoad}%
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Total physical allocation index</span>
        </div>

        <div className="bg-cyber-card border border-cyber-border p-3.5 rounded hover:border-cyber-blue/45 hover:shadow-[0_0_10px_rgba(0,240,255,0.03)] transition-all">
          <span className="text-[9px] font-mono text-gray-500 uppercase block">USED_MEMORY</span>
          <span className="text-xl font-mono font-bold text-white mt-0.5 block">
            {usedMem} <span className="text-[10px] font-mono text-gray-400">GB</span>
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">In-use paging and active handles</span>
        </div>

        <div className="bg-cyber-card border border-cyber-border p-3.5 rounded hover:border-cyber-blue/45 hover:shadow-[0_0_10px_rgba(0,240,255,0.03)] transition-all">
          <span className="text-[9px] font-mono text-gray-500 uppercase block">AVAILABLE_MEMORY</span>
          <span className="text-xl font-mono font-bold text-cyber-blue neon-text-blue mt-0.5 block">
            {freeMem} <span className="text-[10px] font-mono text-gray-400">GB</span>
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Uncommitted physical sectors</span>
        </div>
      </div>

      {/* Action Button Trigger Card */}
      <div className="bg-cyber-card border border-cyber-border p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2.5">
          <Sparkles className="h-4.5 w-4.5 text-cyber-green shrink-0 mt-0.5" />
          <div>
            <h4 className="font-mono font-bold text-[10px] text-white tracking-wider uppercase">READY_FOR_SWAP_FILE_NORMALIZATION</h4>
            <p className="text-[10px] text-gray-400 font-sans mt-0.5">
              Executing the flush will invoke kernel process working set optimization routines, dropping inactive handles.
            </p>
          </div>
        </div>

        <button
          onClick={handleRamBoost}
          disabled={isBoosting}
          className={`font-mono font-bold text-[10px] tracking-widest uppercase px-4 py-3 rounded border transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
            isBoosting
              ? 'bg-cyber-border/40 border-cyber-border text-gray-500 cursor-not-allowed animate-pulse'
              : 'bg-cyber-green text-cyber-bg border-transparent hover:bg-transparent hover:text-cyber-green hover:border-cyber-green shadow-[0_0_12px_rgba(57,255,20,0.2)]'
          }`}
        >
          <Zap className={`h-3 w-3 ${isBoosting ? 'animate-spin' : ''}`} />
          {isBoosting ? 'BOOSTING_RAM...' : 'EXECUTE_DEEP_RAM_FLUSH'}
        </button>
      </div>

      {/* Technical documentation note */}
      <div className="flex gap-2.5 items-start text-[10px] text-gray-500 bg-cyber-deep/60 p-3 rounded border border-cyber-border/30 font-mono leading-relaxed">
        <Info className="h-3.5 w-3.5 text-cyber-blue shrink-0 mt-0.5" />
        <span>
          WINDOWS COMPLIANCE DETAIL: Under Windows NT frameworks, the local desktop exporter issues native ctypes bindings to invoke <code className="text-white">psapi.dll/EmptyWorkingSet</code> directly, reducing paging load immediately.
        </span>
      </div>
    </div>
  );
}
