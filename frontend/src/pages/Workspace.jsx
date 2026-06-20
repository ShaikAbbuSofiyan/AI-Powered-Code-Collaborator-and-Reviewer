import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../services/api.js";

import {
  ChevronRight,
  ChevronDown,
  File,
  FolderClosed,
  FolderOpen,
  Code2,
  Play,
  GitBranch,
  Search,
  Sparkles,
  Send,
  Paperclip,
  Bot,
  Plus,
  X,
} from "lucide-react";

// Helper function
const cn = (...classes) => classes.filter(Boolean).join("");

// File Tree Data
const tree = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Button.jsx", type: "file", ext: "jsx" },
          { name: "ChatPanel.jsx", type: "file", ext: "jsx" },
          { name: "Editor.jsx", type: "file", ext: "jsx" },
        ],
      },
      {
        name: "lib",
        type: "folder",
        children: [
          { name: "agent.js", type: "file", ext: "js" },
          { name: "utils.js", type: "file", ext: "js" },
        ],
      },
      { name: "App.jsx", type: "file", ext: "jsx" },
      { name: "main.jsx", type: "file", ext: "jsx" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [{ name: "favicon.svg", type: "file", ext: "svg" }],
  },
  { name: "package.json", type: "file", ext: "json" },
  { name: "README.md", type: "file", ext: "md" },
];

const extColors = {
  jsx: "text-blue-400",
  js: "text-yellow-400",
  json: "text-orange-400",
  md: "text-gray-400",
  svg: "text-green-400",
};

function FileTree({ nodes, depth = 0, active, onSelect }) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <TreeItem
          key={node.name}
          node={node}
          depth={depth}
          active={active}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function TreeItem({ node, depth, active, onSelect }) {
  const [open, setOpen] = useState(depth < 2);

  const isActive = active === node.name;

  if (node.type === "folder") {
    return (
      <li>
        <button
          onClick={() => setOpen(!open)}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className="w-full flex items-center gap-2 py-1.5 rounded hover:bg-zinc-800 text-sm text-gray-200"
        >
          {open ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}

          {open ? (
            <FolderOpen size={16} className="text-blue-400" />
          ) : (
            <FolderClosed size={16} className="text-blue-400" />
          )}

          {node.name}
        </button>

        {open && node.children && (
          <FileTree
            nodes={node.children}
            depth={depth + 1}
            active={active}
            onSelect={onSelect}
          />
        )}
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => onSelect(node.name)}
        style={{ paddingLeft: `${depth * 12 + 28}px` }}
        className={cn(
          "w-full flex items-center gap-2 py-1.5 rounded text-sm",
          isActive
            ? "bg-blue-500/20 text-white"
            : "text-gray-300 hover:bg-zinc-800"
        )}
      >
        <File
          size={15}
          className={extColors[node.ext] || "text-gray-400"}
        />

        {node.name}
      </button>
    </li>
  );
}

const sampleCode = `import React from "react";

export default function App() {
  return (
    <div>
      <h1>Hello Workspace</h1>
    </div>
  );
}
`;

const messages = [
  {
    role: "ai",
    name: "CodeCollabAI",
    text: "I updated ChatPanel.jsx successfully.",
  },
  {
    role: "user",
    name: "Elena",
    text: "Please add toast notifications.",
  },
];

export default function Workspace(params) {
  const [active, setActive] = useState("ChatPanel.jsx");
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const {id} = useParams()
  useEffect(()=>{
    async function getProject() {
      
      try {
  
        const response = await API.get(
            `/api/projects/${id}`,
            { withCredentials: true }
        );
  
        setProject(response.data.project);
        console.log(response.data)
        
      } catch (error) {
        
        console.log(error);
        
      }
    }
    
    getProject();
    setFiles(project?.files)
  },[id])

  const [tabs, setTabs] = useState([
    "Editor.jsx",
    "ChatPanel.jsx",
    "agent.js",
  ]);

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-white overflow-hidden">
      {/* TOP BAR */}
      <header className="h-12 border-b border-zinc-700 flex items-center px-4 gap-4 bg-zinc-950">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
            <Code2 size={18} />
          </div>

          <span className="font-semibold">
            CodeCollabAI
          </span>
        </Link>

        <span className="text-gray-500">/</span>

        <span className="text-sm text-gray-300">
          {project?.title}
        </span>

        <div className="flex items-center gap-1 text-xs bg-zinc-800 px-2 py-1 rounded">
          <GitBranch size={12} />
          {params.branch}
        </div>

        <div className="ml-auto flex items-center gap-2">
          
          <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-sm">
            <Play size={14} />
            Run
          </button>

          <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-sm">
            <Sparkles size={14} />
            Ask AI
          </button>
        </div>
      </header>

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-zinc-700 bg-zinc-950 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-zinc-700">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search files..."
                className="w-full bg-zinc-800 rounded pl-9 pr-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* Explorer */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs uppercase text-gray-500">
              Explorer
            </span>

            <button className="hover:bg-zinc-800 p-1 rounded">
              <Plus size={15} />
            </button>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            <FileTree
              nodes={tree}
              active={active}
              onSelect={setActive}
            />
          </div>
        </aside>

        {/* EDITOR */}
        <section className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="h-10 border-b border-zinc-700 flex bg-zinc-950">
            {tabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setActive(tab)}
                className={cn(
                  "px-4 flex items-center gap-2 text-sm border-r border-zinc-700 cursor-pointer",
                  active === tab
                    ? "bg-zinc-900 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <File size={14} />

                {tab}

                <X
                  size={12}
                  onClick={(e) => {
                    e.stopPropagation();

                    setTabs(
                      tabs.filter((item) => item !== tab)
                    );
                  }}
                />
              </div>
            ))}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              path={active}
              defaultValue={files}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Status Bar */}
          <div className="h-7 border-t border-zinc-700 bg-zinc-950 flex items-center px-4 text-xs text-gray-400">
            <span>JavaScript React</span>

            <span className="ml-auto">
              Ln 9, Col 24
            </span>
          </div>
        </section>

        {/* AI CHAT PANEL */}
        <aside className="w-87.5 border-l border-zinc-700 bg-zinc-950 flex flex-col">
          {/* Header */}
          <div className="h-12 border-b border-zinc-700 flex items-center gap-2 px-4">
            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
              <Bot size={16} />
            </div>

            <div>
              <p className="text-sm font-medium">
                CodeCollabAI
              </p>

              <p className="text-xs text-green-400">
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" &&
                    "flex-row-reverse"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                  {msg.role === "ai" ? (
                    <Bot size={14} />
                  ) : (
                    "EM"
                  )}
                </div>

                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-xl text-sm",
                    msg.role === "ai"
                      ? "bg-zinc-800"
                      : "bg-blue-500/20"
                  )}
                >
                  <p className="text-xs text-gray-400 mb-1">
                    {msg.name}
                  </p>

                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-700">
            <div className="bg-zinc-800 rounded-xl p-2">
              <input
                type="text"
                placeholder="Ask AI anything..."
                className="w-full bg-transparent outline-none px-2 py-2 text-sm"
              />

              <div className="flex justify-between items-center mt-2">
                <button className="p-2 hover:bg-zinc-700 rounded">
                  <Paperclip size={15} />
                </button>

                <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-sm">
                  <Send size={14} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}