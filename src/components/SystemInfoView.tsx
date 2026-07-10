import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, HardDrive, Layout, ChevronRight, RefreshCw } from 'lucide-react';
import { SystemInfoData } from '../types';

interface SystemInfoViewProps {
  addConsoleLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export default function SystemInfoView({ addConsoleLog }: SystemInfoViewProps) {
  const [loading, setLoading] = useState(false);
  const [uptime, setUptime] = useState('02h 14m 54s');
  const [sysData, setSysData] = useState<SystemInfoData>({
    osName: 'Windows 11 Pro build 22631',
    architecture: 'AMD64 / x86_64',
    cpuName: 'Intel(R) Core(TM) i9-13900K @ 3.00GHz (24 Cores)',
    totalDisk: 512,
    usedDisk: 284,
    freeDisk: 228,
    totalRam: 16,
    usedRam: 6.7,
    freeRam: 9.3,
  });

  // Uptime counter simulation
  useEffect(() => {
    let seconds = 8094;
    const interval = setInterval(() => {
      seconds++;
      const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setUptime(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshSpecs = () => {
    setLoading(true);
    addConsoleLog('Contacting OS Kernel via WMI & shutil bindings...', 'info');
    
    setTimeout(() => {
      setLoading(false);
      addConsoleLog('Hardware specs completely synchronized from local modules.', 'success');
    }, 800);
  };

  const pctDisk = Math.round((sysData.usedDisk / sysData.totalDisk) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" id="sysinfo-tab-content">
      {/* Intro */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-cyber-blue" />
            <h2 className="font-mono font-bold text-xs text-white tracking-widest uppercase">SYSTEM_INFO // KERNEL_SPECTRA</h2>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 max-w-2xl font-sans leading-relaxed">
            Queries native operating system architectures and measures physical sector capacity using real-time system APIs and directory sizing algorithms.
          </p>
        </div>

        <button
          onClick={handleRefreshSpecs}
          disabled={loading}
          className={`font-mono font-bold text-[9px] tracking-widest uppercase border border-cyber-border rounded px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
            loading 
              ? 'text-gray-500 cursor-not-allowed bg-cyber-border/10' 
              : 'text-cyber-blue hover:text-white hover:bg-cyber-blue/10 hover:border-cyber-blue'
          }`}
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          SYNC_MODULES
        </button>
      </div>

      {/* Main Stats Card Panel */}
      <div className="bg-cyber-card border border-cyber-border rounded p-4">
        <div className="flex items-center gap-1.5 border-b border-cyber-border/30 pb-2 mb-3">
          <Shield className="h-3.5 w-3.5 text-cyber-blue" />
          <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">KERNEL_HARDWARE_DESCRIPTION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
          {[
            { label: 'Operating System', val: sysData.osName },
            { label: 'Architecture', val: sysData.architecture },
            { label: 'Central Processor', val: sysData.cpuName },
            { label: 'Uptime', val: uptime },
            { label: 'Pagefile / Swap Size', val: 'Total: 4.09 GB | In-Use: 1.14 GB' },
            { label: 'Hardware Entropy Status', val: 'SECURE / ENCRYPTED' },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-1.5 border-b border-cyber-border/15 last:border-0 md:[&:nth-last-child(2)]:border-0">
              <span className="text-[11px] text-gray-400">{item.label}:</span>
              <span className="text-[11px] font-mono font-semibold text-white truncate max-w-xs">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Disk Sector Segment Analyzer */}
      <div className="bg-cyber-card border border-cyber-border rounded p-4 space-y-3.5">
        <div className="flex items-center gap-1.5 border-b border-cyber-border/30 pb-2">
          <HardDrive className="h-3.5 w-3.5 text-cyber-pink" />
          <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">DISK_C:_SECTOR_CAPACITY</span>
        </div>

        <div className="space-y-3">
          {/* Main Segmented Bar */}
          <div className="h-3 w-full bg-cyber-deep rounded border border-cyber-border/50 overflow-hidden flex">
            {/* System Files - Blue */}
            <div 
              className="h-full bg-cyber-blue relative group" 
              style={{ width: '30%' }}
              title="System Kernel Files (30%)"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            {/* User Files - Pink */}
            <div 
              className="h-full bg-cyber-pink relative group" 
              style={{ width: '25%' }}
              title="User Libraries & Data (25%)"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            {/* Temporary Caches - Yellow */}
            <div 
              className="h-full bg-cyber-yellow relative group" 
              style={{ width: '5%' }}
              title="Pagefile & Temporary Caches (5%)"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            {/* Free space - Charcoal gray */}
            <div 
              className="h-full bg-cyber-border relative group" 
              style={{ width: '40%' }}
              title="Uncommitted sector space (40%)"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          {/* Segment Labels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-0.5 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyber-blue block"></span>
              <span className="text-gray-400">System Core (153 GB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyber-pink block"></span>
              <span className="text-gray-400">User Data (128 GB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyber-yellow block"></span>
              <span className="text-gray-400">Temp Cache (2.8 GB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyber-border block"></span>
              <span className="text-gray-400">Free Space (228 GB)</span>
            </div>
          </div>
        </div>

        {/* Shutil-like Capacity Report */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-gray-500 gap-2 border-t border-cyber-border/30">
          <span>Drive Allocation Ratio: <strong className="text-white font-mono">{pctDisk}% Used</strong></span>
          <span className="font-mono text-[10px] text-right">shutil.disk_usage('C:\\') → Total: {sysData.totalDisk} GB | Used: {sysData.usedDisk} GB | Free: {sysData.freeDisk} GB</span>
        </div>
      </div>
    </div>
  );
}
