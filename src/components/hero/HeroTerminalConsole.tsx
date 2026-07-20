import React, { useState, useRef, useEffect } from "react";
import { Terminal, CornerDownLeft, Trash2, ArrowLeftRight, Download, Mail } from "lucide-react";

interface TerminalCommandOutput {
  command: string;
  output: React.ReactNode;
}

interface HeroTerminalConsoleProps {
  onToggleStandardView?: () => void;
}

export const HeroTerminalConsole: React.FC<HeroTerminalConsoleProps> = ({ onToggleStandardView }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<TerminalCommandOutput[]>([
    {
      command: "welcome",
      output: (
        <div className="space-y-1 text-muted-foreground">
          <p className="text-primary font-bold">Priyabrata Dutta — Interactive CLI Terminal v2.0</p>
          <p className="text-xs">Type <span className="text-string font-mono">'help'</span> to see available commands or click quick action buttons below.</p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to command history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const cmd = trimmed.toLowerCase();
    let outputNode: React.ReactNode;

    switch (cmd) {
      case "help":
        outputNode = (
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="text-foreground font-semibold">Available Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono">
              <div><span className="text-primary font-bold">whoami</span> — Profile summary & role</div>
              <div><span className="text-primary font-bold">skills</span> — Tech stack breakdown</div>
              <div><span className="text-primary font-bold">projects</span> — Key portfolio builds</div>
              <div><span className="text-primary font-bold">experience</span> — Work history & metrics</div>
              <div><span className="text-primary font-bold">cv</span> / <span className="text-primary font-bold">download</span> — Download resume PDF</div>
              <div><span className="text-primary font-bold">contact</span> — Email & phone details</div>
              <div><span className="text-primary font-bold">clear</span> — Clear terminal output</div>
              <div><span className="text-primary font-bold">standard</span> / <span className="text-primary font-bold">mode</span> — Switch to standard view</div>
            </div>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="text-foreground font-semibold">Priyabrata Dutta</p>
            <p>Technical Lead | Full Stack Developer | Building AI-Powered Products</p>
            <p className="text-primary">10+ Years IT Experience · 5+ Years Building Scalable Web Apps</p>
            <p>Location: Bangalore, India</p>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="text-foreground font-semibold">Technical Skills Overview:</p>
            <p><span className="text-keyword font-bold">Frontend:</span> React.js, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS</p>
            <p><span className="text-keyword font-bold">Backend:</span> Node.js, Express.js, FastAPI, Python, REST APIs, JWT/OAuth, Razorpay</p>
            <p><span className="text-keyword font-bold">Databases:</span> MySQL, PostgreSQL, Redis, Prisma ORM</p>
            <p><span className="text-keyword font-bold">DevOps & Cloud:</span> AWS (EC2, S3, Lambda, CloudFront), Docker, Kubernetes, Git/GitHub, CI/CD</p>
            <p><span className="text-keyword font-bold">AI/LLM:</span> OpenAI API, LangChain, ChromaDB, RAG Pipelines, Prompt Engineering, Agentic Workflows</p>
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="text-foreground font-semibold">Featured Projects:</p>
            <p>1. <span className="text-string font-bold">Clinic Appointment SaaS Platform</span> — Multi-tenant scheduling SaaS (React, Node, MySQL, AWS, Docker)</p>
            <p>2. <span className="text-string font-bold">B2B E-commerce Platform</span> — 5,000+ SKUs, tiered pricing, Razorpay (React, Node, Express, Redis)</p>
            <p>3. <span className="text-string font-bold">Generative AI Assistant</span> — LLM document analysis (FastAPI, LangChain, OpenAI, ChromaDB)</p>
            <p>4. <span className="text-string font-bold">Sales & Marketing CRM</span> — Predictive lead scoring (React, Node, FastAPI, scikit-learn)</p>
          </div>
        );
        break;

      case "experience":
        outputNode = (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="text-foreground font-semibold">Career Timeline:</p>
            <p><span className="text-primary font-bold">Appadd India (P) Ltd</span> (Feb 2022 – Present) — Technical Lead / Full Stack Developer (100+ projects shipped, 50K+ MAU)</p>
            <p><span className="text-primary font-bold">GraphicxIT</span> (2021 – 2022) — Freelance Full Stack Developer (20+ global client apps delivered)</p>
            <p><span className="text-primary font-bold">Uttarbanga Sambad</span> (2019 – 2021) — Technical Resource / Web Developer (100K+ monthly readers portal)</p>
            <p><span className="text-primary font-bold">SIEM</span> (2010 – 2019) — Technical Assistant / Web Developer (500+ students/yr, web lead)</p>
          </div>
        );
        break;

      case "cv":
      case "download":
      case "resume":
        // Trigger download
        const link = document.createElement("a");
        link.href = "/DuttaPriyabrata-9832465858-Latest-1.0.pdf";
        link.download = "DuttaPriyabrata-9832465858-Latest-1.0.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        outputNode = (
          <p className="text-xs text-string font-mono">
            ✓ Triggered download for DuttaPriyabrata-9832465858-Latest-1.0.pdf
          </p>
        );
        break;

      case "contact":
      case "email":
        outputNode = (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="text-foreground font-semibold">Contact Info:</p>
            <p>Email: <a href="mailto:priyabrata.dutta.slg@gmail.com" className="text-primary underline">priyabrata.dutta.slg@gmail.com</a></p>
            <p>Phone / WhatsApp: <a href="tel:+919832465858" className="text-primary underline">+91 98324 65858</a></p>
            <p>LinkedIn: <a href="https://linkedin.com/in/priyabratadutta" target="_blank" rel="noreferrer" className="text-primary underline">linkedin.com/in/priyabratadutta</a></p>
          </div>
        );
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        break;

      case "clear":
        setLogs([]);
        setInput("");
        return;

      case "standard":
      case "mode":
      case "exit":
        if (onToggleStandardView) {
          onToggleStandardView();
          return;
        }
        outputNode = <p className="text-xs text-comment">// Switch to standard view via the top toggle button.</p>;
        break;

      default:
        outputNode = (
          <p className="text-xs text-destructive">
            Command not recognized: '{trimmed}'. Type <span className="text-primary underline cursor-pointer" onClick={() => handleCommand("help")}>'help'</span> for available commands.
          </p>
        );
    }

    setLogs((prev) => [...prev, { command: trimmed, output: outputNode }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="rounded-lg border border-border bg-editor-bg overflow-hidden editor-shadow text-left w-full max-w-2xl font-mono">
      {/* Title bar with controls */}
      <div className="flex items-center justify-between bg-editor-titlebar border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-primary" /> pdutta@terminal:~
          </span>
        </div>

        {onToggleStandardView && (
          <button
            onClick={onToggleStandardView}
            className="text-xs font-mono text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/30"
            title="Switch back to standard view (Rollback)"
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>[ Standard View ]</span>
          </button>
        )}
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 space-y-3 min-h-[260px] max-h-[360px] overflow-y-auto text-xs leading-relaxed">
        {logs.map((log, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">$</span>
              <span className="font-semibold text-string">{log.command}</span>
            </div>
            <div className="pl-4">{log.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Input Row */}
      <div className="border-t border-border p-3 bg-editor-bg/80 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type 'help', 'skills', 'projects', 'cv'..."
            className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-comment focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => handleCommand(input)}
            className="text-xs font-mono text-primary hover:text-primary/80 p-1.5 rounded hover:bg-primary/10 transition-colors"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Command Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-comment">Quick:</span>
          {["help", "whoami", "skills", "projects", "cv", "contact"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              className="px-2 py-0.5 rounded border border-border text-foreground hover:border-primary hover:text-primary transition-colors bg-card/50"
            >
              {cmd}
            </button>
          ))}
          <button
            onClick={() => handleCommand("clear")}
            className="px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-destructive transition-colors ml-auto flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroTerminalConsole;
