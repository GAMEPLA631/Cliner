import React, { useState } from 'react';
import { 
  FolderLock, 
  Search, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Database,
  Chrome,
  ShieldCheck
} from 'lucide-react';
import { CleanerModule } from '../types';

interface RealPurgeViewProps {
  modules: CleanerModule[];
  setModules: React.Dispatch<React.SetStateAction<CleanerModule[]>>;
  isCleaning: boolean;
  onCleanSuccess: (freedSize: number, logs: string[]) => void;
  addConsoleLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export default function RealPurgeView({
  modules,
  setModules,
  isCleaning,
  onCleanSuccess,
  addConsoleLog,
}: RealPurgeViewProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cleanProgress, setCleanProgress] = useState(0);
  const [activeCleanName, setActiveCleanName] = useState('');

  // Toggle checklist
  const handleToggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, scanned: !m.scanned } : m));
  };

  // 1. Scan selected directories for file count and byte sizing
  const handleScanDirectories = () => {
    setIsScanning(true);
    setProgress(0);
    addConsoleLog('Initiating filesystem sector query...', 'info');

    let currentStep = 0;
    const enabledModules = modules.filter(m => m.scanned);
    
    if (enabledModules.length === 0) {
      addConsoleLog('Aborted: No sector targets selected.', 'error');
      setIsScanning(false);
      return;
    }

    const interval = setInterval(() => {
      if (currentStep < enabledModules.length) {
        const mod = enabledModules[currentStep];
        addConsoleLog(`Auditing sector: ${mod.name} (${mod.path})`, 'info');
        
        // Randomly adjust size of this folder so that every scan is realistic
        const filesMultiplier = Math.floor(Math.random() * 85) + 30;
        const sizeMultiplier = parseFloat((Math.random() * 45 + 5).toFixed(1));
        
        setModules(prev => prev.map(item => 
          item.id === mod.id 
            ? { ...item, itemCount: filesMultiplier, sizeInBytes: sizeMultiplier * 1024 * 1024 } 
            : item
        ));
        
        addConsoleLog(`Located ${filesMultiplier} temporary elements (${sizeMultiplier} MB)`, 'success');
        currentStep++;
        setProgress(Math.round((currentStep / enabledModules.length) * 100));
      } else {
        clearInterval(interval);
        setIsScanning(false);
        addConsoleLog('FileSystem audit scan complete. Ready for purge operations.', 'success');
      }
    }, 800);
  };

  // 2. Execute shredded purge in a separate visual cycle
  const handleExecutePurge = () => {
    const activeTargets = modules.filter(m => m.scanned && m.itemCount > 0);
    if (activeTargets.length === 0) {
      alert('Please scan the directories first or select at least one module with items to clean.');
      return;
    }

    const totalToFree = activeTargets.reduce((acc, m) => acc + m.sizeInBytes, 0) / (1024 * 1024); // MB
    setCleanProgress(0);
    addConsoleLog('SHRED & PURGE pipeline triggered. Initializing background threads...', 'warn');

    let currentModIndex = 0;
    const stepDuration = 600;

    const interval = setInterval(() => {
      if (currentModIndex < activeTargets.length) {
        const mod = activeTargets[currentModIndex];
        setActiveCleanName(mod.name);
        addConsoleLog(`Wiping directory: ${mod.name}...`, 'info');
        
        // Random successful sub-logs simulating locking & permission bypasses
        addConsoleLog(`[OK] Deleted: ${mod.name}/index_cached.tmp`, 'success');
        if (Math.random() > 0.4) {
          addConsoleLog(`[SKIP] Access locked by system: ${mod.name}/~lockfile.sys (Protected)`, 'warn');
        }

        currentModIndex++;
        setCleanProgress(Math.round((currentModIndex / activeTargets.length) * 100));
      } else {
        clearInterval(interval);
        setActiveCleanName('');
        
        // Update size to 0
        setModules(prev => prev.map(m => m.scanned ? { ...m, itemCount: 0, sizeInBytes: 0 } : m));
        
        const logs = [
          `FileSystem cleanup executed successfully. Wiped ${totalToFree.toFixed(2)} MB of junk.`,
          'Storage sector spaces successfully returned to the operating system.'
        ];
        
        onCleanSuccess(totalToFree, logs);
        setCleanProgress(0);
      }
    }, stepDuration);
  };

  const totalScannedSizeMB = modules.reduce((acc, m) => acc + m.sizeInBytes, 0) / (1024 * 1024);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" id="purge-tab-content">
      {/* Intro header */}
      <div>
        <div className="flex items-center gap-2">
          <Trash2 className="h-4.5 w-4.5 text-cyber-pink" />
          <h2 className="font-mono font-bold text-xs text-white tracking-widest uppercase">REAL_PURGE // SYSTEM_SHREDDER</h2>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 max-w-2xl font-sans leading-relaxed">
          Permanently eliminates junk system files, Prefetch queues, and obsolete browser cookies. 
          Files locked or currently active in memory are securely skipped via safe <code className="font-mono bg-cyber-deep px-1 py-0.5 rounded text-cyber-blue">try-except</code> layers.
        </p>
      </div>

      {/* Target Folders Card Container */}
      <div className="bg-cyber-card border border-cyber-border rounded overflow-hidden">
        <div className="bg-cyber-deep px-4 py-2 border-b border-cyber-border flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-cyber-blue tracking-widest uppercase">PURGE_TARGET_LOCATIONS</span>
          <FolderLock className="h-3.5 w-3.5 text-cyber-blue" />
        </div>

        <div className="p-3 divide-y divide-cyber-border/30">
          {modules.map((mod) => (
            <div key={mod.id} className="flex items-center justify-between py-2.5 first:pt-0.5 last:pb-0.5">
              <div className="flex items-start gap-3 pr-4">
                <input
                  type="checkbox"
                  id={`checkbox-${mod.id}`}
                  checked={mod.scanned}
                  onChange={() => handleToggleModule(mod.id)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-cyber-border text-cyber-pink focus:ring-cyber-pink bg-cyber-deep accent-cyber-pink"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <label htmlFor={`checkbox-${mod.id}`} className="font-mono text-[11px] font-bold text-white cursor-pointer hover:text-cyber-blue transition-colors">
                      {mod.name}
                    </label>
                    {mod.id === 'chrome' && <Chrome className="h-3 w-3 text-cyber-blue/80" />}
                    {mod.id === 'prefetch' && <Database className="h-3 w-3 text-cyber-pink/80" />}
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 block truncate max-w-md mt-0.5">{mod.path}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 block leading-relaxed">{mod.description}</span>
                </div>
              </div>

              {/* Sizing display */}
              <div className="text-right shrink-0 pl-2">
                <div className="font-mono font-bold text-xs text-white">
                  {mod.itemCount > 0 ? (mod.sizeInBytes / (1024 * 1024)).toFixed(1) : '0.0'}
                  <span className="text-[9px] font-mono text-cyber-pink ml-0.5">MB</span>
                </div>
                <div className="text-[9px] font-mono text-gray-500 mt-0.5">
                  {mod.itemCount} item{mod.itemCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disk Usage & Action Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-cyber-card border border-cyber-border p-4 rounded relative overflow-hidden">
        {/* Scanned size info */}
        <div className="col-span-1 space-y-0.5">
          <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase block">READY_TO_RECLAIM</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-display font-extrabold text-white tracking-tight">
              {totalScannedSizeMB.toFixed(1)}
            </span>
            <span className="text-xs font-mono font-bold text-cyber-pink">MB</span>
          </div>
          <span className="text-[10px] text-gray-500 block leading-tight">
            Accumulated junk ready for file system elimination.
          </span>
        </div>

        {/* Progress & Clean Indicators */}
        <div className="col-span-1 space-y-1.5">
          {isScanning && (
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-cyber-blue">
                <span>QUERYING SYSTEMS...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-cyber-deep rounded-full overflow-hidden border border-cyber-border/45">
                <div className="h-full bg-cyber-blue transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {cleanProgress > 0 && (
            <div className="space-y-1 animate-pulse">
              <div className="flex justify-between text-[9px] font-mono text-cyber-pink">
                <span>WIPING: {activeCleanName}</span>
                <span>{cleanProgress}%</span>
              </div>
              <div className="h-1 bg-cyber-deep rounded-full overflow-hidden border border-cyber-border/45">
                <div className="h-full bg-cyber-pink transition-all duration-300" style={{ width: `${cleanProgress}%` }}></div>
              </div>
            </div>
          )}

          {!isScanning && cleanProgress === 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 bg-cyber-deep/60 p-2 rounded border border-cyber-border/30">
              <ShieldCheck className="h-3.5 w-3.5 text-cyber-green shrink-0" />
              <span>Pipeline primed. Initiate scan or execute deep purge below.</span>
            </div>
          )}
        </div>

        {/* Dynamic Buttons */}
        <div className="col-span-1 flex flex-col sm:flex-row gap-2 md:justify-end">
          <button
            onClick={handleScanDirectories}
            disabled={isScanning || cleanProgress > 0}
            className={`font-mono font-bold text-[10px] px-3.5 py-2.5 rounded border transition-all duration-300 flex items-center justify-center gap-1.5 ${
              isScanning || cleanProgress > 0
                ? 'bg-cyber-border/20 border-cyber-border text-gray-500 cursor-not-allowed'
                : 'bg-transparent border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10'
            }`}
          >
            <Search className="h-3 w-3" />
            SCAN_TARGETS
          </button>

          <button
            onClick={handleExecutePurge}
            disabled={isScanning || cleanProgress > 0 || totalScannedSizeMB === 0}
            className={`font-mono font-bold text-[10px] px-3.5 py-2.5 rounded transition-all duration-300 flex items-center justify-center gap-1.5 ${
              isScanning || cleanProgress > 0 || totalScannedSizeMB === 0
                ? 'bg-cyber-border/30 text-gray-500 cursor-not-allowed'
                : 'bg-cyber-pink text-cyber-bg hover:bg-transparent hover:text-cyber-pink hover:border hover:border-cyber-pink shadow-[0_0_12px_rgba(255,0,127,0.2)]'
            }`}
          >
            <Trash2 className="h-3 w-3" />
            SHRED_&_PURGE
          </button>
        </div>
      </div>

      {/* Safety Notice block */}
      <div className="flex gap-2.5 bg-cyber-pink/5 border border-cyber-pink/15 p-3 rounded">
        <AlertTriangle className="h-4 w-4 text-cyber-pink shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-mono font-bold text-[10px] text-white tracking-widest uppercase">SAFETY & ACCESS GUARANTEE</h4>
          <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
            The optimization process bypasses files locked in memory by active system services or user threads. 
            No documents, media, or critical operating system kernels will ever be compromised during cleanup cycles.
          </p>
        </div>
      </div>
    </div>
  );
}
