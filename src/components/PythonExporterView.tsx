import React, { useState } from 'react';
import { Download, Copy, Check, Terminal, FileCode, Info } from 'lucide-react';
import { PYTHON_CLEANER_CODE } from '../pythonCode';

export default function PythonExporterView() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PYTHON_CLEANER_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([PYTHON_CLEANER_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyber_cleaner_app.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" id="exporter-tab-content">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="h-4.5 w-4.5 text-cyber-blue" />
            <h2 className="font-mono font-bold text-xs text-white tracking-widest uppercase">PYTHON_CLIENT_EXPORTER</h2>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 max-w-2xl font-sans leading-relaxed">
            Ready to run this exact application locally on your Windows PC? Download or copy the complete, self-contained Python Tkinter script below.
          </p>
        </div>

        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleCopyCode}
            className="flex-1 sm:flex-none font-mono font-bold text-[10px] tracking-wider border border-cyber-border rounded px-3.5 py-2.5 flex items-center justify-center gap-1.5 text-gray-300 hover:text-white hover:bg-cyber-border/20 hover:border-cyber-blue/40 transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-cyber-green" />
                COPIED!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                COPY_CODE
              </>
            )}
          </button>

          <button
            onClick={handleDownloadFile}
            className="flex-1 sm:flex-none font-mono font-bold text-[10px] tracking-widest bg-cyber-blue text-cyber-bg px-4 py-2.5 rounded hover:bg-transparent hover:text-cyber-blue hover:border hover:border-cyber-blue shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <Download className="h-3 w-3" />
            DOWNLOAD_PY
          </button>
        </div>
      </div>

      {/* Execution Instructions Box */}
      <div className="bg-cyber-card border border-cyber-border p-4 rounded space-y-2.5">
        <h4 className="font-mono font-bold text-[10px] text-white tracking-wider uppercase flex items-center gap-1.5">
          <Terminal className="h-4.5 w-4.5 text-cyber-pink" />
          STEPS_TO_RUN_LOCALLY_ON_WINDOWS
        </h4>
        
        <ol className="text-[11px] text-gray-300 space-y-1.5 list-decimal list-inside font-sans pl-1 leading-relaxed">
          <li>
            Make sure you have <strong className="text-white">Python 3.x</strong> installed on your machine.
          </li>
          <li>
            Download the <code className="bg-cyber-deep px-1.5 py-0.5 rounded border border-cyber-border/40 font-mono text-cyber-pink">cyber_cleaner_app.py</code> script using the button above.
          </li>
          <li>
            Open Command Prompt (cmd) or PowerShell, and run (optional, but recommended):
            <div className="my-1.5 bg-cyber-deep p-2 rounded border border-cyber-border/20 font-mono text-cyber-blue select-all text-[10px] leading-tight">
              pip install psutil
            </div>
          </li>
          <li>
            Execute your application with administrative rights to allow Prefetch directory cleaning:
            <div className="my-1.5 bg-cyber-deep p-2 rounded border border-cyber-border/20 font-mono text-cyber-blue select-all text-[10px] leading-tight">
              python cyber_cleaner_app.py
            </div>
          </li>
        </ol>
      </div>

      {/* Python Code Viewer Card */}
      <div className="border border-cyber-border bg-cyber-card rounded flex flex-col h-[260px]">
        {/* Code toolbar */}
        <div className="bg-cyber-deep px-4 py-2 border-b border-cyber-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] font-bold text-cyber-blue tracking-widest uppercase">
              🐍 SOURCE_CODE: cyber_cleaner_app.py
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-500">Python 3 OOP Style | TKINTER</span>
        </div>

        {/* Code Content */}
        <pre className="flex-1 p-3 overflow-y-auto font-mono text-[10px] bg-cyber-deep text-gray-300 select-all whitespace-pre leading-relaxed">
          <code>{PYTHON_CLEANER_CODE}</code>
        </pre>
      </div>

      {/* OS Compatibility Footer */}
      <div className="flex gap-2.5 items-start text-[10px] text-gray-500 bg-cyber-deep/60 p-3 rounded border border-cyber-border/30 font-mono leading-relaxed">
        <Info className="h-3.5 w-3.5 text-cyber-pink shrink-0 mt-0.5" />
        <span>
          CROSS-PLATFORM SUPPORT: The exported script is designed natively for Windows operating systems (supporting winreg, ctypes EmptyWorkingSet, and Prefetch cleaning). If run on macOS or Linux, it gracefully targets user-safe temporary directories and simulates Windows-specific hives with robust fallbacks.
        </span>
      </div>
    </div>
  );
}
