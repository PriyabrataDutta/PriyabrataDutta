import React, { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";

export type ThemeId = "ember" | "matrix" | "cyberpunk" | "oceanic";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  colorClass: string;
  bgHex: string;
}

export const themes: ThemeOption[] = [
  { id: "ember", name: "Ember Orange", colorClass: "bg-[#f95324]", bgHex: "#f95324" },
  { id: "matrix", name: "Matrix Green", colorClass: "bg-[#22c55e]", bgHex: "#22c55e" },
  { id: "cyberpunk", name: "Cyberpunk Purple", colorClass: "bg-[#c084fc]", bgHex: "#c084fc" },
  { id: "oceanic", name: "Oceanic Blue", colorClass: "bg-[#38bdf8]", bgHex: "#38bdf8" },
];

export const ThemeSwitcher: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("ember");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("accent_theme") as ThemeId) || "ember";
    setActiveTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const changeTheme = (themeId: ThemeId) => {
    setActiveTheme(themeId);
    localStorage.setItem("accent_theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md border border-border bg-editor-bg text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors flex items-center gap-1.5"
        title="Change accent color theme"
        aria-label="Theme Switcher"
      >
        <Palette className="w-4 h-4" />
        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: themes.find(t => t.id === activeTheme)?.bgHex }} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-xl z-50 p-2 space-y-1">
            <div className="text-[10px] text-comment px-2 py-1 uppercase tracking-wider">// accent_theme</div>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                  activeTheme === t.id ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:bg-editor-bg hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${t.colorClass}`} />
                  <span>{t.name}</span>
                </div>
                {activeTheme === t.id && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
