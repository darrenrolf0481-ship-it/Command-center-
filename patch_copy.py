import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

target = '''        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700/30'
            }`}>'''

replacement = '''        {messages.map((msg, idx) => (
          <div key={idx} className={`flex group ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700/30'
            }`}>'''

content = content.replace(target, replacement)

target2 = '''              {msg.parts.map((part: any, i: number) => {
                if (part.text) {
                  return <div key={i} className="whitespace-pre-wrap text-sm">{part.text}</div>;
                }
                return null;
              })}
            </div>
          </div>'''

replacement2 = '''              {msg.parts.map((part: any, i: number) => {
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
                {copiedIndex === idx ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            )}
          </div>'''

content = content.replace(target2, replacement2)

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)

print("Patch applied.")
