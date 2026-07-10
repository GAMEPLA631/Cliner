import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Clock, Radio } from 'lucide-react';

interface HeaderProps {
  junkSize: number;
  registryCount: number;
}

export default function Header({ junkSize, registryCount }: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [cpuUsage, setCpuUsage] = useState<number>(14);
  const [ramUsage, setRamUsage] = useState<number>(42);

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuating hardware stats to look incredibly authentic
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const change = (Math.random() - 0.5) * 6;
        const next = prev + change;
        return Math.min(Math.max(Math.round(next), 4), 38);
      });
      setRamUsage((prev) => {
        const change = (Math.random() - 0.5) * 2;
        const next = prev + change;
        return Math.min(Math.max(Math.round(next), 39), 45);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-12 border-b border-cyber-border bg-cyber-deep px-4 flex items-center justify-between select-none shrink-0" id="app-header">
      {/* Live status indicators */}
      <div className="flex items-center gap-4">
        {/* CPU */}
        <div className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-cyber-blue" />
          <span className="text-[10px] font-mono text-gray-500">CPU_LOAD:</span>
          <span className="text-xs font-mono font-bold text-cyber-blue neon-text-blue w-8">
            {cpuUsage}%
          </span>
          {/* Spark bar */}
          <div className="w-10 h-0.5 bg-cyber-border rounded-full overflow-hidden hidden sm:block">
            <div 
              className="h-full bg-cyber-blue transition-all duration-500" 
              style={{ width: `${cpuUsage}%` }}
            ></div>
          </div>
        </div>

        {/* RAM */}
        <div className="flex items-center gap-1.5 border-l border-cyber-border pl-4">
          <Radio className="h-3.5 w-3.5 text-cyber-green" />
          <span className="text-[10px] font-mono text-gray-500">RAM_USED:</span>
          <span className="text-xs font-mono font-bold text-cyber-green neon-text-green w-8">
            {ramUsage}%
          </span>
          {/* Spark bar */}
          <div className="w-10 h-0.5 bg-cyber-border rounded-full overflow-hidden hidden sm:block">
            <div 
              className="h-full bg-cyber-green transition-all duration-500" 
              style={{ width: `${ramUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Disk quick health status */}
        <div className="flex items-center gap-1.5 hidden md:flex border-l border-cyber-border pl-4">
          <HardDrive className="h-3.5 w-3.5 text-cyber-pink" />
          <span className="text-[10px] font-mono text-gray-500">JUNK_VOL:</span>
          <span className="text-xs font-mono font-bold text-cyber-pink neon-text-pink">
            {junkSize.toFixed(1)} MB
          </span>
        </div>
      </div>

      {/* Right Clock / Time status */}
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-cyber-blue animate-pulse" />
        <span className="text-xs font-mono text-cyber-blue/90 tracking-wider">
          {time}
        </span>
      </div>
    </header>
  );
}
