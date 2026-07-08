import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

# Replace ChatTab
# First, find the definition
pattern = r'function ChatTab\(\) \{.*?\n\}'
match = re.search(pattern, content, flags=re.DOTALL)

if match:
    old_chattab = match.group(0)
    
    new_chattab = """function ChatTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{name: string, type: string, base64: string} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      setSelectedFile({
        name: file.name,
        type: file.type,
        base64: base64String
      });
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
       fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const newUserMessageParts: any[] = [];
    if (input.trim()) {
      newUserMessageParts.push({ text: input.trim() });
    }
    
    if (selectedFile) {
      newUserMessageParts.push({
        inlineData: {
          data: selectedFile.base64,
          mimeType: selectedFile.type
        }
      });
    }

    const newUserMsg = { role: "user", parts: newUserMessageParts, originalFile: selectedFile };
    const newMessages = [...messages, newUserMsg];
    
    setMessages(newMessages);
    setInput("");
    setSelectedFile(null);
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
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-indigo-400" />
          <h2 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200">Hermes Assistant</h2>
        </div>
        <div className="text-[10px] font-bold text-indigo-400 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase tracking-wider">gemini-2.5-flash</div>
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
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700/30'
            }`}>
              {/* If user attached a file, show a small preview */}
              {msg.originalFile && (
                <div className={`flex items-center gap-3 mb-3 p-3 rounded-xl ${msg.role === 'user' ? 'bg-indigo-700/50' : 'bg-slate-700/50'}`}>
                  {msg.originalFile.type.startsWith('image/') ? (
                    <ImageIcon size={18} className="shrink-0" />
                  ) : (
                    <FileText size={18} className="shrink-0" />
                  )}
                  <span className="text-xs truncate max-w-[200px] font-medium">{msg.originalFile.name}</span>
                </div>
              )}
              {msg.parts.map((part, i) => {
                if (part.text) {
                  return <div key={i} className="whitespace-pre-wrap text-sm">{part.text}</div>;
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3 text-slate-400">
               <Loader2 size={16} className="animate-spin" />
               <span className="text-sm">Processing...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        
        {/* Selected File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 rounded-xl max-w-fit">
            {selectedFile.type.startsWith('image/') ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={`data:${selectedFile.type};base64,${selectedFile.base64}`} alt="preview" className="w-10 h-10 object-cover rounded-lg" />
            ) : (
               <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400">
                  <FileText size={18} />
               </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[200px] truncate">{selectedFile.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium uppercase tracking-wider mt-0.5">Attached asset</span>
            </div>
            <button onClick={removeFile} className="ml-3 text-slate-500 dark:text-slate-500 hover:text-rose-400 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
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
            disabled={(!input.trim() && !selectedFile) || isLoading}
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
}"""
    
    new_content = content.replace(old_chattab, new_chattab)
    with open('components/CommandCenter.tsx', 'w') as f:
        f.write(new_content)
    print("Patched successfully!")
else:
    print("Could not find ChatTab!")
