import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = content.replace(
'''  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);''',
'''  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
    } else if (saved === "dark") {
      setIsDark(true);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);'''
)

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)

print("Patch generated and applied.")
