#!/bin/bash

# Define the new section
NEW_SECTION='      <div>\
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">\
          <Settings size={18} className="text-indigo-400" />\
          API Keys Configuration\
        </h3>\
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\
           <ApiKeyInput name="OpenRouter API Key" provider="openrouter" />\
           <ApiKeyInput name="OpenAI API Key" provider="openai" />\
           <ApiKeyInput name="Anthropic API Key" provider="anthropic" />\
           <ApiKeyInput name="Google Gemini API Key" provider="gemini" />\
        </div>\
      </div>\
    </div>'

# Replace the closing div of IntegrationsTab with the new section
sed -i "s/    <\/div>\n  );/      <\/div>\n$NEW_SECTION\n  );/" components/CommandCenter.tsx
