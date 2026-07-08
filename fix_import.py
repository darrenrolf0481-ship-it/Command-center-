import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

# Make sure Trash2 is imported
if 'Trash2' not in content[:1000]:
    content = content.replace('import {\n  Moon,', 'import {\n  Moon,\n  Trash2,')

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)
print("Import fixed")
