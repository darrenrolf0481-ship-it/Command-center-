"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Trash2,
  Sun,
  Activity,
  Cpu,
  Database,
  Network,
  Terminal,
  Settings,
  HardDrive,
  MessageSquare, Globe, ExternalLink,
  Paperclip,
  Send,
  Loader2,
  FileText,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
} from "lucide-react";

export function CommandCenter() {
  const [activeTab, setActiveTab] = useState("overview");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "memory", label: "Memory", icon: Database },
    { id: "tools", label: "Tools", icon: Settings },
    { id: "integrations", label: "Integrations", icon: Network },
    { id: "logs", label: "Logs", icon: Terminal },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "omniroute", label: "OmniRoute", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0A0C10] dark:text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <div className="max-w-[1024px] mx-auto p-4 md:p-6 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              H3
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Hermes 3 Command Center</h1>
              <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">
                Agent Control Room · Orchestrator · Specialists — Llama 3.2-based, 128K context
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2.5 rounded-full bg-slate-900/50 border border-slate-800 hover:border-indigo-500 transition-all text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#0A0C10] animate-pulse"></span>
                online — localhost:11434
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-1.5">
                Last updated: just now
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 border-b border-slate-800 scrollbar-hide pb-[1px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-300 hover:border-slate-700"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 pb-6 flex flex-col">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "memory" && <MemoryTab />}
          {activeTab === "tools" && <ToolsTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "logs" && <LogsTab />}
          {activeTab === "chat" && <ChatTab />}
          {activeTab === "omniroute" && <OmniRouteTab />}
        </div>
      </div>
    </div>
  );
}

// --- Tab Components ---

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Primary Orchestrator Status */}
      <div className="lg:col-span-2">
        <Card title="Agent Control Room (Level 3)" icon={Activity}>
          <div className="flex flex-col gap-1 mb-6">
            <div className="text-2xl font-bold tracking-tight">hermes-orchestrator</div>
            <div className="text-xs text-slate-400">Front Door & Delegation Synthesis</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30">
              <div className="text-xs font-medium text-slate-400 mb-1">Task Bus Status</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-200">Active Routing</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-2">3 pending tasks in /srv/agent-bus</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30">
              <div className="text-xs font-medium text-slate-400 mb-1">Last Sync</div>
              <div className="text-xl font-bold text-emerald-400">just now</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-2">All runbooks up to date</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Badge color="green">routing active</Badge>
            <Badge color="blue">VPS connected</Badge>
            <Badge color="purple">orchestrated path</Badge>
          </div>
        </Card>
      </div>

      {/* Quick Actions adapted for Control Room */}
      <div className="lg:col-span-1">
        <Card title="Control Plane" icon={Terminal}>
          <div className="grid grid-cols-1 gap-3 mt-2">
            <button className="w-full text-left px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-500/20">
              Deploy New Agent
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-xl text-xs font-bold transition-colors">
              Audit Security (agent-security-auditor)
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-xl text-xs font-bold transition-colors">
              Sync SSH Aliases
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-xl text-xs font-bold transition-colors">
              Run Backup Check
            </button>
          </div>
        </Card>
      </div>

      {/* Specialist Registry */}
      <div className="lg:col-span-3">
        <Card title="Specialist Registry" icon={Database}>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SessionItem title="hermes-life" meta="Personal management" status="online" />
            <SessionItem title="hermes-dev" meta="Code & site work" status="online" />
            <SessionItem title="hermes-seo" meta="SEO specialist" status="idle" />
            <SessionItem title="hermes-ops" meta="VPS & backups" status="online" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MemoryTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Mem0 (Vector+Graph)" icon={Database}>
           <div className="text-3xl font-bold tracking-tight">1,247 <span className="text-sm font-normal text-slate-500 dark:text-slate-500">facts</span></div>
           <ProgressBar value={62} color="bg-emerald-500" className="mt-4 mb-2" />
           <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-500">
             <span>Vector: 1,180</span>
             <span>Graph: 42</span>
             <span>SQL: 25</span>
           </div>
        </Card>
        <Card title="Zep (Temporal KG)" icon={Database}>
           <div className="text-3xl font-bold tracking-tight">4,192 <span className="text-sm font-normal text-slate-500 dark:text-slate-500">events</span></div>
           <ProgressBar value={40} color="bg-indigo-500" className="mt-4 mb-2" />
           <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-500">
             <span>Episodes: 382</span>
             <span>Entities: 890</span>
           </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="LangMem (LangGraph)" icon={Activity}>
           <div className="text-2xl font-bold tracking-tight">Active</div>
           <div className="text-xs text-slate-500 dark:text-slate-500 mt-2 mt-4">Manages conversational threads and subgraph transitions.</div>
        </Card>
        <Card title="ChromaDB (Vector Store)" icon={HardDrive}>
           <div className="text-2xl font-bold tracking-tight">8.4 MB</div>
           <ProgressBar value={12} color="bg-purple-500" className="mt-4 mb-2" />
           <div className="text-xs text-slate-500 dark:text-slate-500">Embeddings & Document Chunks</div>
        </Card>
        <Card title="Redis (Cache)" icon={HardDrive}>
           <div className="text-2xl font-bold tracking-tight">98% <span className="text-sm font-normal text-slate-500 dark:text-slate-500">hit rate</span></div>
           <ProgressBar value={98} color="bg-amber-500" className="mt-4 mb-2" />
           <div className="text-xs text-slate-500 dark:text-slate-500">Session states & semantic caching</div>
        </Card>
      </div>
    </div>
  );
}

function ToolsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card title="Bundled Skills (Control Room)" icon={Settings}>
          <div className="mt-2">
             <ToolItem name="setup-control-room" desc="Bootstrap VPS with Node, Claude Code, Docker & Hermes" status="active" />
             <ToolItem name="agent-registry-manager" desc="Maintain agent registry and sync inventory" status="active" />
             <ToolItem name="agent-task-router" desc="Route tasks from orchestrator to specialists via Task Bus" status="active" />
             <ToolItem name="create-vps" desc="Provision Hetzner VPS and generate SSH aliases" status="degraded" />
             <ToolItem name="agent-security-auditor" desc="Audit ports, dashboards, SSH, and secret placement" status="active" />
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Card title="Skill Metrics" icon={Activity}>
           <div className="space-y-5 mt-2">
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Execution Success</span><span className="font-bold text-slate-800 dark:text-slate-200">98.5%</span></div>
                <ProgressBar value={98.5} color="bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Avg VPS latency</span><span className="font-bold text-slate-800 dark:text-slate-200">240 ms</span></div>
                <ProgressBar value={40} color="bg-indigo-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Security Checks</span><span className="font-bold text-slate-800 dark:text-slate-200">100% Pass</span></div>
                <ProgressBar value={100} color="bg-emerald-500" />
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-indigo-400" />
          Framework & Orchestration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <IntegrationItem name="LangChain" desc="ChatOllama + LCEL + bind_tools" status="connected" />
           <IntegrationItem name="LlamaIndex" desc="VectorStoreIndex + query engine" status="connected" />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Network size={18} className="text-indigo-400" />
          External Systems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <IntegrationItem name="Lab Brain (WebSocket)" desc="ws://localhost:8785 (via /api/query/lab-brain)" status="connected" />
           <IntegrationItem name="ARGUS Escalations" desc="Webhook receiver on /api/hermes/ingest" status="active" />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Database size={18} className="text-indigo-400" />
          Memory & Storage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <IntegrationItem name="Mem0" desc="Vector + Graph + SQL hybrid memory layer" status="active" />
           <IntegrationItem name="ChromaDB" desc="Vector store · HNSW index" status="active" />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Settings size={18} className="text-indigo-400" />
          API Keys Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <ApiKeyInput name="OpenRouter API Key" provider="openrouter" />
           <ApiKeyInput name="OpenAI API Key" provider="openai" />
           <ApiKeyInput name="Anthropic API Key" provider="anthropic" />
           <ApiKeyInput name="Google Gemini API Key" provider="gemini" />
        </div>
      </div>
    </div>
  );
}

function LogsTab() {
  return (
    <Card title="Observability Stream" icon={Terminal}>
      <div className="space-y-0 font-mono text-sm mt-2">
        <LogItem time="14:14:02" msg="Tool call: bridge_status — timeout after 30s" type="error" />
        <LogItem time="14:12:47" msg="Memory extraction: 3 facts added to Mem0 (Sage, Seven, Mama)" type="info" />
        <LogItem time="14:10:33" msg="Context compression triggered — reclaimed 3,200 tokens" type="system" />
        <LogItem time="14:08:19" msg="RAG retrieval: 5 chunks from 'Sage conversation archives'" type="system" />
        <LogItem time="14:05:56" msg="KV cache warning: 78% of allocated VRAM" type="warn" />
        <LogItem time="14:03:41" msg="Session 'Bridge diagnostics — Sage-7' initialized" type="info" />
        <LogItem time="14:01:22" msg="Ollama health check passed — hermes3:3b ready" type="info" />
      </div>
    </Card>
  );
}

// --- Chat Tab with Document Upload ---

function ChatTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{name: string, type: string, base64: string}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    const saved = localStorage.getItem("hermesChatHistory");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
    setIsHistoryLoaded(true);
  }, []);

  useEffect(() => {
    if (isHistoryLoaded) {
      localStorage.setItem("hermesChatHistory", JSON.stringify(messages));
    }
  }, [messages, isHistoryLoaded]);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("hermesChatHistory");
  };

  const exportHistory = () => {
    if (messages.length === 0) return;
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isProcessingFiles]);

  const handleFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    if (newFiles.length === 0) return;
    
    setIsProcessingFiles(true);
    let processedCount = 0;

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        setSelectedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          base64: base64String
        }]);
        processedCount++;
        if (processedCount === newFiles.length) {
          setIsProcessingFiles(false);
        }
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
       fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

    const newUserMessageParts: any[] = [];
    if (input.trim()) {
      newUserMessageParts.push({ text: input.trim() });
    }
    
    selectedFiles.forEach(file => {
      newUserMessageParts.push({
        inlineData: {
          data: file.base64,
          mimeType: file.type
        }
      });
    });

    const newUserMsg = { role: "user", parts: newUserMessageParts, originalFiles: selectedFiles };
    const newMessages = [...messages, newUserMsg];
    
    setMessages(newMessages);
    setInput("");
    setSelectedFiles([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/query/lab-brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send history without the `originalFile` custom field
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            parts: m.parts
          }))
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: data.text }] }]);
      } else {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: `Error: ${data.error}` }] }]);
      }
    } catch (error) {
       setMessages(prev => [...prev, { role: "model", parts: [{ text: "Failed to communicate with the server." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`flex flex-col h-[600px] bg-white dark:bg-slate-900/40 border ${isDragging ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-800'} rounded-3xl overflow-hidden relative transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-500/10 backdrop-blur-sm border-2 border-indigo-500 border-dashed rounded-3xl">
          <div className="flex flex-col items-center gap-4 p-8 bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileText size={32} />
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">Drop document here</p>
            <p className="text-sm text-slate-500">Supports Images, PDFs, and Text files</p>
            {selectedFiles.length > 0 && (
               <div className="mt-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} queued
               </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-indigo-400" />
          <h2 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200">Hermes Assistant</h2>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <>
              <button
                onClick={exportHistory}
                className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-indigo-500 uppercase tracking-widest transition-colors"
                title="Export History"
              >
                <Download size={14} />
                Export
              </button>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-rose-500 uppercase tracking-widest transition-colors"
                title="Clear History"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </>
          )}
          <div className="text-[10px] font-bold text-indigo-400 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase tracking-wider">gemini-2.5-flash</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-500 space-y-4">
             <MessageSquare size={48} className="opacity-20" />
             <p className="text-sm">Start a conversation or drag and drop a document to begin.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex group ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700/30'
            }`}>
              {/* If user attached files, show a small preview */}
              {msg.originalFiles && msg.originalFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {msg.originalFiles.map((file: any, i: number) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${msg.role === 'user' ? 'bg-indigo-700/50 text-indigo-50' : 'bg-slate-200 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200'}`}>
                      {file.type.startsWith('image/') ? (
                        <ImageIcon size={18} className="shrink-0" />
                      ) : (
                        <FileText size={18} className="shrink-0" />
                      )}
                      <span className="text-xs truncate max-w-[150px] font-medium">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {msg.parts.map((part: any, i: number) => {
                if (part.text) {
                  return <div key={i} className="whitespace-pre-wrap text-sm">{part.text}</div>;
                }
                return null;
              })}
            </div>
            {msg.role !== 'user' && (
              <button
                onClick={() => handleCopy(msg.parts.map((p: any) => p.text || '').join(''), idx)}
                className="mt-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                title="Copy to clipboard"
                aria-label="Copy message"
              >
                {copiedIndex === idx ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 rounded-2xl rounded-tl-sm px-5 py-4 w-full max-w-[80%] space-y-3">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700/50 animate-pulse"></div>
                 <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse"></div>
               </div>
               <div className="h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse"></div>
               <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse"></div>
               <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        
        {/* Selected Files Preview List */}
        {(selectedFiles.length > 0 || isProcessingFiles) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 rounded-xl max-w-fit relative group">
                {file.type.startsWith('image/') ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={`data:${file.type};base64,${file.base64}`} alt="preview" className="w-10 h-10 object-cover rounded-lg" />
                ) : (
                   <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <FileText size={18} />
                   </div>
                )}
                <div className="flex flex-col pr-6">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[150px] truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium uppercase tracking-wider mt-0.5">Queued</span>
                </div>
                <button 
                  onClick={() => removeFile(idx)} 
                  className="absolute right-3 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
            {isProcessingFiles && (
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 rounded-xl w-48 relative overflow-hidden">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-lg animate-pulse shrink-0"></div>
                <div className="flex flex-col gap-1.5 flex-1 w-full">
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse"></div>
                  <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-end gap-2 relative">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-500 dark:text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors shrink-0 border border-slate-200 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/40"
            title="Attach Document"
          >
            <Paperclip size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,text/plain"
            multiple
          />
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message Hermes, or drag and drop a document..."
              className="w-full max-h-32 min-h-[46px] p-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm placeholder:text-slate-500 dark:text-slate-500"
              rows={1}
            />
          </div>
          
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0 shadow-lg shadow-indigo-500/20"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-center mt-3 text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-semibold">
           Verify important information. Supports Images, PDFs, and Text files.
        </div>
      </div>
    </div>
  );
}

// --- UI Helpers ---

function Card({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Icon size={18} className="text-indigo-400" />
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode, color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' }) {
  const colorMap = {
    blue: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    yellow: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    red: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorMap[color]}`}>
      {children}
    </span>
  );
}

function ProgressBar({ value, color, className = "" }: { value: number, color: string, className?: string }) {
  return (
    <div className={`w-full h-2 bg-slate-800 rounded-full overflow-hidden ${className}`}>
      <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  );
}

function SessionItem({ title, meta, status }: { title: string, meta: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 hover:bg-slate-700/50 rounded-2xl transition-colors cursor-pointer group mb-3 last:mb-0">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 group-hover:text-indigo-300">
           <Activity size={18} />
        </div>
        <div>
           <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{title}</div>
           <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">{meta}</div>
        </div>
      </div>
      <Badge color={status === 'saved' ? 'green' : 'yellow'}>{status}</Badge>
    </div>
  );
}

function ToolItem({ name, desc, status }: { name: string, desc: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 hover:bg-slate-700/50 rounded-2xl transition-colors cursor-pointer group mb-3 last:mb-0">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 shrink-0">
           <Settings size={18} />
        </div>
        <div>
           <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{name}</div>
           <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">{desc}</div>
        </div>
      </div>
      <Badge color={status === 'active' ? 'green' : (status === 'degraded' ? 'yellow' : 'blue')}>{status}</Badge>
    </div>
  );
}

function IntegrationItem({ name, desc, status }: { name: string, desc: string, status: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 rounded-2xl">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
        <Network size={18} />
      </div>
      <div className="flex-1">
         <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{name}</div>
         <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">{desc}</div>
      </div>
      <Badge color={status === 'connected' || status === 'active' ? 'green' : 'red'}>{status}</Badge>
    </div>
  );
}

function LogItem({ time, msg, type }: { time: string, msg: string, type: 'info' | 'warn' | 'error' | 'system' }) {
  const typeMap = {
    info: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    error: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    system: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
  };

  return (
    <div className="flex gap-3 items-start py-2.5 px-3 border border-slate-200 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-800/40 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800/60 mb-2 last:mb-0">
      <div className="text-[10px] text-slate-500 shrink-0 w-16 pt-0.5">{time}</div>
      <div className="text-xs text-slate-700 dark:text-slate-300 flex-1">{msg}</div>
      <div className={`text-[9px] px-2 py-0.5 rounded shrink-0 font-bold uppercase tracking-wider ${typeMap[type]}`}>
        {type}
      </div>
    </div>
  );
}

function ApiKeyInput({ name, provider }: { name: string, provider: string }) {
  const [key, setKey] = useState("");
  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 rounded-2xl">
      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{name}</div>
      <div className="flex items-center gap-2">
        <input 
          type="password" 
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={`Enter ${provider} key...`}
          className="flex-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors">
          Save
        </button>
      </div>
    </div>
  );
}

function OmniRouteTab() {
  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden relative">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <Globe size={18} className="text-emerald-500 dark:text-emerald-400" />
          <h2 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200">OmniRoute Gateway</h2>
        </div>
        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full uppercase tracking-wider">Web Dashboard</div>
      </div>
      <div className="flex-1 bg-slate-50 dark:bg-[#0A0C10] flex flex-col items-center justify-center p-8 text-center">
        <Globe size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">External Gateway</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
          The OmniRoute Web Dashboard is protected and must be opened in a new window to ensure a secure connection.
        </p>
        <a 
          href="https://omniroute.online/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
        >
          Open OmniRoute Dashboard
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
