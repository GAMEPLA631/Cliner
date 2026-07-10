import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import RealPurgeView from './components/RealPurgeView';
import RamBoostView from './components/RamBoostView';
import RegistryIntegrityView from './components/RegistryIntegrityView';
import SystemInfoView from './components/SystemInfoView';
import PythonExporterView from './components/PythonExporterView';
import { LogMessage, CleanerModule, RegistryIssue } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [systemStatus, setSystemStatus] = useState<'secure' | 'warning' | 'optimizing'>('warning');
  const [junkSize, setJunkSize] = useState<number>(342.1); // MB
  const [registryCount, setRegistryCount] = useState<number>(4);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogMessage[]>([]);

  // Initializing modules
  const [modules, setModules] = useState<CleanerModule[]>([
    {
      id: 'usertemp',
      name: 'User Temp Folders',
      path: '%USERPROFILE%\\AppData\\Local\\Temp',
      scanned: true,
      itemCount: 84,
      sizeInBytes: 154.2 * 1024 * 1024,
      description: 'Caches and log remnants created by third-party desktop utilities.'
    },
    {
      id: 'systemtemp',
      name: 'System Temp Directory',
      path: 'C:\\Windows\\Temp',
      scanned: true,
      itemCount: 42,
      sizeInBytes: 86.8 * 1024 * 1024,
      description: 'System dump registries and operational installer buffers.'
    },
    {
      id: 'prefetch',
      name: 'Windows Prefetch Cache',
      path: 'C:\\Windows\\Prefetch',
      scanned: true,
      itemCount: 22,
      sizeInBytes: 38.6 * 1024 * 1024,
      description: 'Optimized launching shortcuts created by previous execution processes.'
    },
    {
      id: 'chrome',
      name: 'Browser Cached Logs',
      path: '%USERPROFILE%\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache',
      scanned: false,
      itemCount: 152,
      sizeInBytes: 62.5 * 1024 * 1024,
      description: 'Offline web resource caches, static assets, and telemetry scripts.'
    }
  ]);

  const [registryIssues, setRegistryIssues] = useState<RegistryIssue[]>([
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
    }
  ]);

  // Seeding initial boot logs
  useEffect(() => {
    const seedLogs = [
      { timestamp: getFormattedTime(), type: 'info' as const, text: 'Neon Engine Core booting up...' },
      { timestamp: getFormattedTime(), type: 'info' as const, text: 'Active sub-modules synchronized: DiskPurge, RAMBoost, RegistryIntegrity.' },
      { timestamp: getFormattedTime(), type: 'warn' as const, text: 'WARNING: 342.1 MB of temporary file residue detected in disk sectors.' },
      { timestamp: getFormattedTime(), type: 'warn' as const, text: 'WARNING: 4 obsolete keys identified in registry hive. Optimization required.' }
    ];
    setLogs(seedLogs);
  }, []);

  function getFormattedTime() {
    const d = new Date();
    return `[${d.toTimeString().split(' ')[0]}]`;
  }

  // Appends individual entries to the telemetry log
  const addConsoleLog = (text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const newLog: LogMessage = {
      timestamp: getFormattedTime(),
      type,
      text
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Run comprehensive dashboard diagnosis
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setSystemStatus('optimizing');
    addConsoleLog('Initiating systemic system compliance scan...', 'info');

    // Staggered diagnosis steps
    setTimeout(() => {
      addConsoleLog('Auditing temporary filesystem locations...', 'info');
      addConsoleLog('Scanned: User Temp folders -> 154.2 MB located.', 'success');
    }, 450);

    setTimeout(() => {
      addConsoleLog('Scanned: C:\\Windows\\Temp -> 86.8 MB located.', 'success');
      addConsoleLog('Scanned: C:\\Windows\\Prefetch -> 38.6 MB located.', 'success');
    }, 900);

    setTimeout(() => {
      addConsoleLog('Querying registry hive key trees for obsolete software pointers...', 'info');
      addConsoleLog('Located 4 active registry integrity deviations.', 'warn');
    }, 1400);

    setTimeout(() => {
      setIsAnalyzing(false);
      setSystemStatus('warning');
      addConsoleLog('System analysis complete. Optimization status: Lowered. Actions required.', 'warn');
    }, 2000);
  };

  // Safe file purging complete callback
  const handleCleanSuccess = (freedSize: number, customLogs: string[]) => {
    setJunkSize(prev => Math.max(0, prev - freedSize));
    customLogs.forEach(lg => addConsoleLog(lg, 'success'));

    // Automatically check if all elements have been normalized to set clean secure status
    if (junkSize - freedSize <= 0.1 && registryCount === 0) {
      setSystemStatus('secure');
      addConsoleLog('OPTIMIZATION TARGET REACHED: Complete physical and configuration health restored.', 'success');
    }
  };

  // Registry repair completed callback
  const handleFixRegistrySuccess = () => {
    setRegistryCount(0);
    setRegistryIssues(prev => prev.map(it => ({ ...it, fixed: true })));
    addConsoleLog('All identified broken registry branches safely repaired.', 'success');

    if (junkSize <= 0.1) {
      setSystemStatus('secure');
      addConsoleLog('OPTIMIZATION TARGET REACHED: Complete physical and configuration health restored.', 'success');
    }
  };

  const handleOptimizedSystemStatus = () => {
    setSystemStatus('secure');
    addConsoleLog('RAM cache page flushes accomplished. Memory status cleared.', 'success');
  };

  return (
    <div className="flex h-screen w-screen bg-cyber-bg tech-grid text-gray-100 overflow-hidden font-sans select-none" id="app-root">
      {/* Sidebar navigation panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        systemStatus={systemStatus} 
      />

      {/* Main Container region */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-cyber-bg/90 backdrop-blur-[1px]" id="main-content-wrapper">
        {/* Top telemetry state bar */}
        <Header 
          junkSize={junkSize} 
          registryCount={registryCount} 
        />

        {/* Dynamic Inner Tab routing frame */}
        <main className="flex-1 overflow-hidden flex flex-col bg-cyber-bg" id="app-viewport">
          {activeTab === 'dashboard' && (
            <DashboardView
              junkSize={junkSize}
              registryCount={registryCount}
              logs={logs}
              isAnalyzing={isAnalyzing}
              onRunAnalysis={handleRunAnalysis}
              systemStatus={systemStatus}
            />
          )}

          {activeTab === 'purge' && (
            <RealPurgeView
              modules={modules}
              setModules={setModules}
              isCleaning={isAnalyzing}
              onCleanSuccess={handleCleanSuccess}
              addConsoleLog={addConsoleLog}
            />
          )}

          {activeTab === 'ram' && (
            <RamBoostView 
              addConsoleLog={addConsoleLog} 
              onOptimizeSystem={handleOptimizedSystemStatus}
            />
          )}

          {activeTab === 'registry' && (
            <RegistryIntegrityView
              issues={registryIssues}
              setIssues={setRegistryIssues}
              addConsoleLog={addConsoleLog}
              onFixSuccess={handleFixRegistrySuccess}
            />
          )}

          {activeTab === 'sysinfo' && (
            <SystemInfoView 
              addConsoleLog={addConsoleLog} 
            />
          )}

          {activeTab === 'exporter' && (
            <PythonExporterView />
          )}
        </main>
      </div>
    </div>
  );
}
