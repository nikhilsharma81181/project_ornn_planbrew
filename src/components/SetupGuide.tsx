"use client";

import { useState } from "react";
import { Check, Copy, TestTube, Loader2 } from "lucide-react";

interface SetupGuideProps {
  apiKey: string;
  projectId: string;
}

type Tool = "claude-code" | "cursor" | "claude-desktop" | "codex";
type SetupMethod = "terminal" | "manual";

const TOOLS: { id: Tool; label: string }[] = [
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "claude-desktop", label: "Claude Desktop" },
  { id: "codex", label: "Codex" },
];

function CopyBlock({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {label && <p className="text-xs text-muted-foreground mb-1.5">{label}</p>}
      <div className="relative group">
        <pre className="p-3 rounded-lg bg-background border border-border text-sm text-foreground overflow-x-auto font-mono whitespace-pre-wrap">
          {content}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-card border border-border opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}

function getMcpConfig(tool: Tool, apiKey: string, projectId: string, apiUrl: string): string {
  const mcpServerJson = {
    planbrew: {
      command: "npx",
      args: ["-y", "planbrew-mcp"],
      env: {
        PLANBREW_API_URL: apiUrl,
        PLANBREW_API_KEY: apiKey,
        PLANBREW_PROJECT_ID: projectId,
      },
    },
  };

  if (tool === "codex") {
    return `[mcp_servers.planbrew]
command = "npx"
args = ["-y", "planbrew-mcp"]

[mcp_servers.planbrew.env]
PLANBREW_API_URL = "${apiUrl}"
PLANBREW_API_KEY = "${apiKey}"
PLANBREW_PROJECT_ID = "${projectId}"`;
  }

  return JSON.stringify({ mcpServers: mcpServerJson }, null, 2);
}

function getConfigPath(tool: Tool): { file: string; location: string } {
  switch (tool) {
    case "claude-code":
      return {
        file: ".mcp.json",
        location: "your project root",
      };
    case "cursor":
      return {
        file: ".cursor/mcp.json",
        location: "your project root",
      };
    case "claude-desktop":
      return {
        file: "claude_desktop_config.json",
        location: "~/Library/Application Support/Claude/ (Mac) or %APPDATA%\\Claude\\ (Windows)",
      };
    case "codex":
      return {
        file: ".codex/config.toml",
        location: "your project root (or ~/.codex/config.toml for global)",
      };
  }
}

function getTerminalCommand(tool: Tool, apiKey: string, projectId: string): string | null {
  switch (tool) {
    case "claude-code":
      return `claude mcp add planbrew -e PLANBREW_API_KEY=${apiKey} -e PLANBREW_PROJECT_ID=${projectId} -- npx -y planbrew-mcp`;
    case "codex":
      return `codex --mcp-server planbrew="npx -y planbrew-mcp" --set-env planbrew:PLANBREW_API_KEY=${apiKey} --set-env planbrew:PLANBREW_PROJECT_ID=${projectId}`;
    default:
      return null;
  }
}

function getContextFileInfo(tool: Tool): { file: string; description: string } | null {
  switch (tool) {
    case "claude-code":
      return { file: "CLAUDE.md", description: "your project root" };
    case "cursor":
      return { file: ".cursorrules", description: "your project root" };
    case "claude-desktop":
      return null;
    case "codex":
      return { file: "AGENTS.md", description: "your project root" };
  }
}

export function SetupGuide({ apiKey, projectId }: SetupGuideProps) {
  const [selectedTool, setSelectedTool] = useState<Tool>("claude-code");
  const [setupMethod, setSetupMethod] = useState<SetupMethod>("terminal");
  const [testResult, setTestResult] = useState<"idle" | "loading" | "success" | "error">("idle");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.planbrew.ai/api/v1";
  const mcpConfig = getMcpConfig(selectedTool, apiKey, projectId, apiUrl);
  const configPath = getConfigPath(selectedTool);
  const contextFile = getContextFileInfo(selectedTool);
  const terminalCommand = getTerminalCommand(selectedTool, apiKey, projectId);

  // Auto-switch to manual if tool has no terminal command
  const hasTerminal = terminalCommand !== null;
  const activeMethod = hasTerminal ? setupMethod : "manual";

  const trackingSnippet = `## PlanBrew - Project Memory

You have access to PlanBrew, which remembers your project across coding sessions.

After making progress, save it:
- save_progress: what you worked on and current status
- mark_complete: when a feature/task is finished
- save_session: end-of-session summary of what was done

When you need context, recall it:
- recall_work: search past work by topic or date
- get_last_session: what happened in the previous session
- get_history: activity feed for any time period
- get_status: overall project health and pace

Use these proactively. Save progress as you go so future sessions can pick up seamlessly.`;

  const testConnection = async () => {
    setTestResult("loading");
    try {
      const res = await fetch(
        `${apiUrl}/progress/${projectId}/overview`,
        { headers: { "X-API-KEY": apiKey } }
      );
      if (res.ok) {
        setTestResult("success");
      } else {
        setTestResult("error");
      }
    } catch {
      setTestResult("error");
    }
    setTimeout(() => setTestResult("idle"), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Choose your tool */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            1
          </div>
          <h3 className="font-semibold text-foreground">Choose your AI tool</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedTool === tool.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Install */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            2
          </div>
          <h3 className="font-semibold text-foreground">Install PlanBrew</h3>
        </div>

        {/* Method toggle — only show if tool supports terminal */}
        {hasTerminal && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSetupMethod("terminal")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeMethod === "terminal"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              Terminal (recommended)
            </button>
            <button
              onClick={() => setSetupMethod("manual")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeMethod === "manual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              Manual config
            </button>
          </div>
        )}

        {activeMethod === "terminal" && terminalCommand ? (
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">
              Run this in your project directory:
            </p>
            <CopyBlock label="" content={terminalCommand} />
            <p className="text-xs text-muted-foreground/70 mt-2">
              That&apos;s it — your API key and project ID are already included.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Your API Key</p>
              <CopyBlock label="" content={apiKey} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1.5">
                Add this to{" "}
                <code className="px-1 py-0.5 rounded bg-card text-primary text-xs">{configPath.file}</code>
                {" "}in {configPath.location}:
              </p>
              {selectedTool === "claude-desktop" && (
                <p className="text-xs text-muted-foreground/70 mb-3">
                  Open Claude Desktop → Settings → Developer → Edit Config
                </p>
              )}
              <CopyBlock label="" content={mcpConfig} />
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Context file (not for Claude Desktop) */}
      {contextFile && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              3
            </div>
            <h3 className="font-semibold text-foreground">
              Add to {contextFile.file}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Add this snippet to{" "}
            <code className="px-1 py-0.5 rounded bg-card text-primary text-xs">{contextFile.file}</code>
            {" "}in {contextFile.description} so your AI assistant knows to track progress:
          </p>
          <CopyBlock label="" content={trackingSnippet} />
        </div>
      )}

      {/* Step 4: Test */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            {contextFile ? 4 : 3}
          </div>
          <h3 className="font-semibold text-foreground">Test Connection</h3>
        </div>
        <button
          onClick={testConnection}
          disabled={testResult === "loading"}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors disabled:opacity-50 text-sm"
        >
          {testResult === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : testResult === "success" ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : testResult === "error" ? (
            <TestTube className="h-4 w-4 text-destructive" />
          ) : (
            <TestTube className="h-4 w-4 text-muted-foreground" />
          )}
          {testResult === "loading"
            ? "Testing..."
            : testResult === "success"
              ? "Connected!"
              : testResult === "error"
                ? "Connection failed"
                : "Test Connection"}
        </button>
      </div>
    </div>
  );
}
