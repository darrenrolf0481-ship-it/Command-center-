with open("components/CommandCenter.tsx", "r") as f:
    content = f.read()
if content.startswith('"use client";import'):
    content = content.replace('"use client";import', '"use client";\nimport', 1)
with open("components/CommandCenter.tsx", "w") as f:
    f.write(content)
