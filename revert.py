with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = content.replace('  Copy,\n  Check\n', '')
content = content.replace('{copiedIndex === idx ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}', 'Copy')

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)
