import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

new_section = """      <div>
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
}"""

content = content.replace("    </div>\n  );\n}\n\nfunction LogsTab()", new_section + "\n\nfunction LogsTab()")

api_key_input_code = """
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
"""

content += api_key_input_code

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)

