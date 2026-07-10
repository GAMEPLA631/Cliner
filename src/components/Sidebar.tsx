import React from 'react';
import { 
  LayoutDashboard, 
  Trash2, 
  Cpu, 
  Database, 
  Terminal, 
  Download,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: 'secure' | 'warning' | 'optimizing';
}

export default function Sidebar({ activeTab, setActiveTab, systemStatus }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'purge', name: 'Real Purge', icon: Trash2 },
    { id: 'ram', name: 'RAM Boost', icon: Cpu },
    { id: 'registry', name: 'Registry Clean', icon: Database },
    { id: 'sysinfo', name: 'System Info', icon: Terminal },
    { id: 'exporter', name: 'Python App Exporter', icon: Download },
  ];

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'secure':
        return 'text-cyber-green neon-text-green';
      case 'optimizing':
        return 'text-cyber-yellow animate-pulse';
      case 'warning':
        return 'text-cyber-pink neon-text-pink animate-pulse';
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'secure':
        return '● SYSTEM SECURED';
      case 'optimizing':
        return '▲ OPTIMIZING...';
      case 'warning':
        return '■ OPTIMIZATION REQ';
    }
  };

  return (
    <aside className="w-60 bg-cyber-card border-r border-cyber-border flex flex-col justify-between h-full select-none shrink-0 z-10" id="app-sidebar">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-cyber-border flex items-center gap-2.5 bg-cyber-deep/40">
          <div className="relative">
            <Zap className="h-5 w-5 text-cyber-blue animate-pulse" />
            <div className="absolute -inset-1 bg-cyber-blue opacity-20 blur-sm rounded-full"></div>
          </div>
          <div>
            <h1 className="font-display font-bold text-xs text-white tracking-widest uppercase">NEON_ENGINE</h1>
            <span className="text-[9px] font-mono text-cyber-blue/80 tracking-widest block uppercase -mt-0.5">CORE_V4.0</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1" id="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-mono text-xs font-medium tracking-wider uppercase transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-cyber-border/60 text-cyber-blue border-l-2 border-cyber-blue shadow-[inset_3px_0_8px_rgba(0,240,255,0.04)]'
                    : 'text-gray-400 hover:bg-cyber-border/20 hover:text-white'
                }`}
              >
                <IconComponent className={`h-4 w-4 transition-colors duration-200 ${
                  isActive ? 'text-cyber-blue' : 'text-gray-400 group-hover:text-cyber-blue'
                }`} />
                <span>{item.name}</span>
                
                {/* Micro neon visual dot on hover/active */}
                {isActive && (
                  <span className="absolute right-2.5 w-1 h-1 rounded-full bg-cyber-blue shadow-[0_0_6px_rgba(0,240,255,1)]"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-cyber-border bg-cyber-deep/80">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#07070D] border border-cyber-border/60">
          <ShieldCheck className={`h-3.5 w-3.5 ${systemStatus === 'secure' ? 'text-cyber-green' : 'text-cyber-pink'}`} />
          <span className={`font-mono text-[9px] font-bold tracking-widest ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <div className="mt-2.5 text-center flex justify-between items-center px-1">
          <span className="text-[8px] font-mono text-gray-500 tracking-wider">
            PORT_3000
          </span>
          <span className="text-[8px] font-mono text-cyber-blue/60 tracking-wider">
            SYS_OK // V4
          </span>
        </div>
      </div>
    </aside>
  );
}
