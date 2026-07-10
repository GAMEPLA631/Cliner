import React from 'react';
import { 
  Zap, 
  Trash2, 
  Cpu, 
  Database, 
  Play, 
  Terminal, 
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { LogMessage } from '../types';

interface DashboardViewProps {
  junkSize: number;
  registryCount: number;
  logs: LogMessage[];
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
  systemStatus: 'secure' | 'warning' | 'optimizing';
}

export default function DashboardView({
  junkSize,
  registryCount,
  logs,
  isAnalyzing,
  onRunAnalysis,
  systemStatus,
}: DashboardViewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" id="dashboard-tab-content">
      {/* Dynamic Security Banner Card */}
      <div 
        className={`relative overflow-hidden p-4 rounded border transition-all duration-300 bg-cyber-card ${
          systemStatus === 'secure'
            ? 'border-cyber-green/30 shadow-[0_0_12px_rgba(57,255,20,0.02)]'
            : systemStatus === 'optimizing'
            ? 'border-cyber-yellow/30 shadow-[0_0_12px_rgba(255,255,0,0.02)]'
            : 'border-cyber-pink/30 shadow-[0_0_12px_rgba(255,0,127,0.02)]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              {systemStatus === 'secure' ? (
                <ShieldCheck className="h-4 w-4 text-cyber-green neon-text-green" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-cyber-pink neon-text-pink animate-bounce" />
              )}
              <h2 className="font-mono font-bold text-xs text-white tracking-widest uppercase">
                {systemStatus === 'secure' 
                  ? 'CYBER_COMPLIANCE_LEVEL: 100%' 
                  : systemStatus === 'optimizing'
                  ? 'PERFORMING_OPTIMIZATION_OVERHAUL'
                  : 'SYSTEM_INTEGRITY: OPTIMIZATION_REQUIRED'}
              </h2>
            </div>
            <p className="text-[11px] text-gray-400 max-w-2xl font-sans leading-relaxed">
              {systemStatus === 'secure'
                ? 'Your local memory partitions and Registry trees are clear of redundant references and junk clusters. Maintain state by running weekly audits.'
                : systemStatus === 'optimizing'
                ? 'The cleaning system is actively running cache flushes and registry integrity alignments. Do not shut down the utility.'
                : 'Over 250MB of accumulated temporary system logs, leftover setup residues, and stale registry configurations have been detected.'}
            </p>
          </div>
          
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className={`font-mono font-bold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded border transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
              isAnalyzing
                ? 'bg-cyber-border/40 border-cyber-border text-gray-500 cursor-not-allowed'
                : 'bg-cyber-blue text-cyber-bg border-transparent hover:bg-transparent hover:text-cyber-blue hover:border-cyber-blue shadow-[0_0_12px_rgba(0,240,255,0.2)]'
            }`}
          >
            <Play className={`h-3 w-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'AUDITING...' : 'RUN_QUICK_DIAGNOSIS'}
          </button>
        </div>

        {/* Techno backgrounds */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyber-blue/5 to-transparent pointer-events-none opacity-30"></div>
        <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full border border-cyber-blue/5 pointer-events-none"></div>
      </div>

      {/* Grid of Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Junk found */}
        <div className="bg-cyber-card border border-cyber-border p-4 rounded flex flex-col justify-between h-28 hover:border-cyber-blue/40 hover:shadow-[0_0_10px_rgba(0,240,255,0.05)] transition-all duration-200">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono font-bold text-gray-500 tracking-wider">JUNK_ON_DISK</span>
            <Trash2 className="h-3.5 w-3.5 text-cyber-blue" />
          </div>
          <div className="my-1">
            <span className="font-display font-bold text-2xl text-white tracking-tight">
              {junkSize === 0 ? '0.0' : junkSize.toFixed(1)}
            </span>
            <span className="text-[10px] text-cyber-blue font-mono font-bold ml-1">MB</span>
          </div>
          <span className="text-[10px] text-gray-500 font-sans">
            Ready to be safely wiped in "Real Purge"
          </span>
        </div>

        {/* Card 2: Registry Issues */}
        <div className="bg-cyber-card border border-cyber-border p-4 rounded flex flex-col justify-between h-28 hover:border-cyber-pink/40 hover:shadow-[0_0_10px_rgba(255,0,127,0.05)] transition-all duration-200">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono font-bold text-gray-500 tracking-wider">REGISTRY_DEVIATIONS</span>
            <Database className="h-3.5 w-3.5 text-cyber-pink" />
          </div>
          <div className="my-1">
            <span className="font-display font-bold text-2xl text-white tracking-tight">
              {registryCount}
            </span>
            <span className="text-[10px] text-cyber-pink font-mono font-bold ml-1">ISSUES</span>
          </div>
          <span className="text-[10px] text-gray-500 font-sans">
            Orphaned keys and config anomalies
          </span>
        </div>

        {/* Card 3: RAM boost */}
        <div className="bg-cyber-card border border-cyber-border p-4 rounded flex flex-col justify-between h-28 hover:border-cyber-green/40 hover:shadow-[0_0_10px_rgba(57,255,20,0.05)] transition-all duration-200">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono font-bold text-gray-500 tracking-wider">EFFICIENCY_INDEX</span>
            <Zap className="h-3.5 w-3.5 text-cyber-green" />
          </div>
          <div className="my-1">
            <span className="font-display font-bold text-2xl text-white tracking-tight">
              {junkSize === 0 && registryCount === 0 ? '100' : '82'}
            </span>
            <span className="text-[10px] text-cyber-green font-mono font-bold ml-1">% RATE</span>
          </div>
          <span className="text-[10px] text-gray-500 font-sans">
            Core optimization score index
          </span>
        </div>
      </div>

      {/* Cyberpunk Terminal / Telemetry Feed Console */}
      <div className="border border-cyber-border bg-cyber-card rounded flex flex-col overflow-hidden h-[300px]">
        {/* Terminal Header */}
        <div className="bg-cyber-deep px-4 py-2 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-cyber-blue" />
            <span className="font-mono text-[9px] font-bold text-cyber-blue tracking-widest uppercase">
              LIVE_TELEMETRY_FEED_&_DIAGNOSTIC_CONSOLE
            </span>
          </div>
          {/* Decorative terminal dots */}
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink/30"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-yellow/30"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green/30"></span>
          </div>
        </div>

        {/* Log rows container */}
        <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] space-y-0.5 bg-cyber-deep select-text">
          {logs.map((log, index) => {
            const colorClass = 
              log.type === 'success' 
                ? 'text-cyber-green' 
                : log.type === 'warn' 
                ? 'text-cyber-yellow' 
                : log.type === 'error' 
                ? 'text-cyber-pink' 
                : 'text-gray-400';
            
            return (
              <div key={index} className="flex items-start gap-1.5 hover:bg-cyber-border/10 py-0.5 rounded px-1 transition-colors">
                <span className="text-gray-600 shrink-0">{log.timestamp}</span>
                <span className={`font-bold shrink-0 w-11 ${colorClass}`}>
                  {log.type === 'info' ? '[INFO]' : log.type === 'success' ? '[OK]' : log.type === 'warn' ? '[WARN]' : '[ERR]'}
                </span>
                <span className="text-gray-300">{log.text}</span>
              </div>
            );
          })}
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-1.5">
              <Terminal className="h-5 w-5 stroke-1 text-gray-700 animate-pulse" />
              <span>Diagnostic console idle. Run quick analysis or select a module.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
