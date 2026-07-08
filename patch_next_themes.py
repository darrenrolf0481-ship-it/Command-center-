import re

with open('components/CommandCenter.tsx', 'r') as f:
    content = f.read()

# Replace the imports
content = content.replace(
'''import React, { useState, useRef, useEffect } from "react";''',
'''import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";'''
)

# Replace the state and useEffect
content = content.replace(
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
  }, [isDark]);''',
'''  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;'''
)

# Replace the toggle logic
content = content.replace(
'''<button
              onClick={() => setIsDark(!isDark)}''',
'''<button
              onClick={() => setTheme(isDark ? "light" : "dark")}'''
)

with open('components/CommandCenter.tsx', 'w') as f:
    f.write(content)

print("Patch generated and applied.")
