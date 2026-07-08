import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

# Add Globe to imports
if 'Globe' not in content:
    content = content.replace('MessageSquare,', 'MessageSquare, Globe,')

# Add the omniroute tab
tabs_pattern = r'const tabs = \[\n(.*?)\n  \];'
match = re.search(tabs_pattern, content, flags=re.DOTALL)
if match:
    old_tabs = match.group(1)
    if 'omniroute' not in old_tabs:
        new_tabs = old_tabs + '\n    { id: "omniroute", label: "OmniRoute", icon: Globe },'
        content = content.replace(old_tabs, new_tabs)

# Add the omniroute tab content
content_pattern = r'\{activeTab === "chat" && <ChatTab \/>\}'
if 'OmniRouteTab' not in content:
    content = content.replace(content_pattern, '{activeTab === "chat" && <ChatTab />}\n          {activeTab === "omniroute" && <OmniRouteTab />}')

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)
print("Patched tabs!")
