import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const [selectedFile, setSelectedFile] = useState<{name: string, type: string, base64: string} | null>(null);',
    'const [selectedFiles, setSelectedFiles] = useState<{name: string, type: string, base64: string}[]>([]);'
)

content = content.replace(
'''  const handleFile = (file: File) => {
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
  };''',
'''  const handleFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        setSelectedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          base64: base64String
        }]);
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
  };'''
)

content = content.replace(
'''  const handleSend = async () => {
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
    setIsLoading(true);''',
'''  const handleSend = async () => {
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
    setIsLoading(true);'''
)

content = content.replace(
'''              {/* If user attached a file, show a small preview */}
              {msg.originalFile && (
                <div className={`flex items-center gap-3 mb-3 p-3 rounded-xl ${msg.role === 'user' ? 'bg-indigo-700/50' : 'bg-slate-700/50'}`}>
                  {msg.originalFile.type.startsWith('image/') ? (
                    <ImageIcon size={18} className="shrink-0" />
                  ) : (
                    <FileText size={18} className="shrink-0" />
                  )}
                  <span className="text-xs truncate max-w-[200px] font-medium">{msg.originalFile.name}</span>
                </div>
              )}''',
'''              {/* If user attached files, show a small preview */}
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
              )}'''
)

content = content.replace(
'''        {/* Selected File Preview */}
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
        )}''',
'''        {/* Selected Files Preview List */}
        {selectedFiles.length > 0 && (
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
          </div>
        )}'''
)

content = content.replace(
'''          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,text/plain"
          />''',
'''          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,text/plain"
            multiple
          />'''
)

content = content.replace(
'''disabled={(!input.trim() && !selectedFile) || isLoading}''',
'''disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}'''
)

# And one more thing: let's change `setSelectedFile(null)` in `removeFile` to `setSelectedFiles(prev => prev.filter((_, i) => i !== index))`
# wait, I already replaced the `removeFile` block. Let's make sure it's applied.

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)

print("Patch generated and applied.")
