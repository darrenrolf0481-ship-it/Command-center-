with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

if content.startswith('"use client";import'):
    content = '"use client";\nimport' + content[len('"use client";import'):]
    with open('components/CommandCenter.tsx', 'w') as f:
        f.write(content)
    print("Fixed CommandCenter.tsx")
else:
    print("CommandCenter.tsx didn't match.")
