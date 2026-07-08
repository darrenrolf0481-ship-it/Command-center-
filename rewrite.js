const fs = require('fs');
let content = fs.readFileSync('components/CommandCenter.tsx', 'utf8');
content = content.replace(/^"use client";\s*/, '"use client";\n');
fs.writeFileSync('components/CommandCenter.tsx', content);
