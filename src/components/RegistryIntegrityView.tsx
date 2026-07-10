import React, { useState } from 'react';
import { Database, Search, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { RegistryIssue } from '../types';

interface RegistryIntegrityViewProps {
  issues: RegistryIssue[];
  setIssues: React.Dispatch<React.SetStateAction<RegistryIssue[]>>;
  addConsoleLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
  onFixSuccess: () => void;
}

export default function RegistryIntegrityView({
  issues,
  setIssues,
  addConsoleLog,
  onFixSuccess,
}: RegistryIntegrityViewProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  // Trigger registry audit simulation
  const handleScanRegistry = () => {
    setIsScanning(true);
    addConsoleLog('Querying HKEY_CURRENT_USER & HKEY_LOCAL_MACHINE Registry hives...', 'info');
    
    // Clear old issues
    setIssues([]);

    setTimeout(() => {
      addConsoleLog('Auditing Software subkeys: broken uninstaller strings...', 'info');
    }, 400);

    setTimeout(() => {
      addConsoleLog('Bypassing inaccessible key: HKLM/System/SecureHive (Safe Bypass - try/except)', 'warn');
      
      const foundIssues: RegistryIssue[] = [
        {
          id: 'reg1',
          hive: 'HKCU',
          key: 'Software\\ObsoleteApp\\Paths',
          valueName: 'InstallDir',
          reason: 'Broken run string path points to missing directory "C:\\Program Files\\ObsoleteApp\\"',
          fixed: false,
        },
        {
          id: 'reg2',
          hive: 'HKLM',
          key: 'System\\ControlSet001\\Services\\StaleSvc',
          valueName: 'ImagePath',
          reason: 'Orphaned service refers to deleted driver package "stalesvc.sys"',
          fixed: false,
        },
        {
          id: 'reg3',
          hive: 'HKCU',
          key: 'Software\\Classes\\.tmp_cyber_log',
          valueName: 'Default',
          reason: 'Unmapped extension has no active associated software package',
          fixed: false,
        },
        {
          id: 'reg4',
          hive: 'HKCU',
          key: 'Software\\Microsoft\\Windows\\CurrentVersion\\Run',
          valueName: 'StartupBooster',
          reason: 'Invalid startup record targets missing "C:\\Users\\Admin\\AppData\\Local\\cleaner_stub.exe"',
          fixed: false,
        },
      ];

      setIssues(foundIssues);
      addConsoleLog(`Scan completed: detected ${foundIssues.length} broken registry elements.`, 'warn');
      setIsScanning(false);
    }, 1500);
  };

  // Trigger repair operation
  const handleRepairRegistry = () => {
    if (issues.length === 0) return;
    setIsRepairing(true);
    addConsoleLog('Executing structural registry repair sequence...', 'warn');

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < issues.length) {
        const item = issues[idx];
        addConsoleLog(`Patching key: ${item.key}\\${item.valueName}`, 'info');
        setIssues((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, fixed: true } : it))
        );
        idx++;
      } else {
        clearInterval(interval);
        setIsRepairing(false);
        addConsoleLog('REPAIR COMPLETE: All detected registry deviations normalized.', 'success');
        onFixSuccess();
      }
    }, 500);
  };

  const unfixedCount = issues.filter((it) => !it.fixed).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" id="registry-tab-content">
      {/* Intro */}
      <div>
        <div className="flex items-center gap-2">
          <Database className="h-4.5 w-4.5 text-cyber-blue" />
          <h2 className="font-mono font-bold text-xs text-white tracking-widest uppercase">REGISTRY_INTEGRITY // STRUCTURE_OPTIMIZER</h2>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 max-w-2xl font-sans leading-relaxed">
          Scans hive keys for obsolete software traces, broken file path configurations, and orphaned driver handles. 
          Safely bypasses locked administrator branches using robust permission checkers.
        </p>
      </div>

      {/* Main Registry Table */}
      <div className="bg-cyber-card border border-cyber-border rounded overflow-hidden flex flex-col h-[280px]">
        {/* Table Header toolbar */}
        <div className="bg-cyber-deep px-4 py-2 border-b border-cyber-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-cyber-blue tracking-widest uppercase">HIVE_DEVIATION_MATRIX</span>
          </div>
          <span className="text-[9px] font-mono text-gray-500">
            {issues.length > 0 ? `${unfixedCount} pending issues` : 'No issues loaded'}
          </span>
        </div>

        {/* Rows scroll region */}
        <div className="flex-1 overflow-y-auto bg-cyber-deep/20">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-cyber-border/40 bg-cyber-deep/45 text-[9px] text-gray-500 font-mono tracking-wider">
                <th className="p-2.5 pl-4 w-24">HIVE</th>
                <th className="p-2.5 w-56">KEY PATH</th>
                <th className="p-2.5">DETECTED DEFICIENCY</th>
                <th className="p-2.5 text-center w-28">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/20">
              {issues.map((item) => (
                <tr key={item.id} className="hover:bg-cyber-border/5 transition-colors">
                  <td className="p-2 pl-4 font-mono text-[10px] text-cyber-blue font-semibold">
                    {item.hive}
                  </td>
                  <td className="p-2 font-mono text-[9px] text-gray-400 max-w-[200px] truncate">
                    {item.key} <span className="text-cyber-pink">({item.valueName})</span>
                  </td>
                  <td className="p-2 text-[11px] text-gray-300 leading-normal">
                    {item.reason}
                  </td>
                  <td className="p-2 text-center">
                    {item.fixed ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyber-green/10 text-cyber-green border border-cyber-green/20">
                        REPAIRED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/20 animate-pulse">
                        DETECTED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-sans">
                    <div className="flex flex-col items-center gap-1.5 justify-center">
                      <RefreshCw className={`h-4.5 w-4.5 stroke-1 text-gray-600 ${isScanning ? 'animate-spin' : ''}`} />
                      <span className="text-[11px] font-mono">{isScanning ? 'Auditing active Windows registry branches...' : 'No registry anomalies scanned yet. Execute audit below.'}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control Actions bar */}
      <div className="bg-cyber-card border border-cyber-border p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-4.5 w-4.5 text-cyber-blue shrink-0 mt-0.5" />
          <div>
            <h4 className="font-mono font-bold text-[10px] text-white tracking-wider uppercase">REGISTRY_STRUCTURAL_ALIGNMENT</h4>
            <p className="text-[10px] text-gray-400 font-sans mt-0.5">
              Patching references will securely dereference missing DLL pointers and clean obsolete shell extensions.
            </p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleScanRegistry}
            disabled={isScanning || isRepairing}
            className={`font-mono font-bold text-[10px] px-3.5 py-2.5 rounded border transition-all duration-300 flex items-center gap-1.5 ${
              isScanning || isRepairing
                ? 'bg-cyber-border/20 border-cyber-border text-gray-500 cursor-not-allowed'
                : 'bg-transparent border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10'
            }`}
          >
            <Search className="h-3 w-3" />
            SCAN_REGISTRY
          </button>

          <button
            onClick={handleRepairRegistry}
            disabled={isScanning || isRepairing || issues.length === 0 || unfixedCount === 0}
            className={`font-mono font-bold text-[10px] px-3.5 py-2.5 rounded transition-all duration-300 flex items-center gap-1.5 ${
              isScanning || isRepairing || issues.length === 0 || unfixedCount === 0
                ? 'bg-cyber-border/30 text-gray-500 cursor-not-allowed'
                : 'bg-cyber-blue text-cyber-bg hover:bg-transparent hover:text-cyber-blue hover:border hover:border-cyber-blue shadow-[0_0_12px_rgba(0,240,255,0.2)]'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            REPAIR_DEVIATIONS
          </button>
        </div>
      </div>
    </div>
  );
}
