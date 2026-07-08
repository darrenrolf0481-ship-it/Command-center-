import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

# Add icon import
if 'Trash2' not in content:
    content = content.replace('  Check\n}', '  Check,\n  Trash2\n}')

# 1. State updates
state_target = '''function ChatTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");'''

state_replacement = '''function ChatTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [input, setInput] = useState("");'''

content = content.replace(state_target, state_replacement)

# 2. Add history logic
logic_target = '''  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };'''

logic_replacement = '''  const handleCopy = (text: string, index: number) => {
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
  };'''

content = content.replace(logic_target, logic_replacement)

# 3. Add button to header
header_target = '''      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-indigo-400" />
          <h2 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200">Hermes Assistant</h2>
        </div>
        <div className="text-[10px] font-bold text-indigo-400 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase tracking-wider">gemini-2.5-flash</div>
      </div>'''

header_replacement = '''      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-indigo-400" />
          <h2 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200">Hermes Assistant</h2>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-rose-500 uppercase tracking-widest transition-colors"
              title="Clear History"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
          <div className="text-[10px] font-bold text-indigo-400 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase tracking-wider">gemini-2.5-flash</div>
        </div>
      </div>'''

content = content.replace(header_target, header_replacement)

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)

print("History implementation applied.")
