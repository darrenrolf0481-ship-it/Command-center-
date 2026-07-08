import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '  Image as ImageIcon\n} from "lucide-react";',
    '  Image as ImageIcon,\n  Copy,\n  Check\n} from "lucide-react";'
)

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)
