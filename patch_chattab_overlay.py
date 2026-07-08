import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = content.replace(
'''            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">Drop document here</p>
            <p className="text-sm text-slate-500">Supports Images, PDFs, and Text files</p>
          </div>
        </div>''',
'''            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">Drop document here</p>
            <p className="text-sm text-slate-500">Supports Images, PDFs, and Text files</p>
            {selectedFiles.length > 0 && (
               <div className="mt-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} queued
               </div>
            )}
          </div>
        </div>'''
)

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)

print("Patch overlay generated and applied.")
