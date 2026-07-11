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
  SaveAll,
  FilePlusCorner,
  FolderPlus,
  UserPlus,
  Check
} from "lucide-react";
// Helper function
const cn = (...classes) => classes.filter(Boolean).join("");

const extColors = {
  jsx: "text-blue-400",
  js: "text-yellow-400",
  json: "text-orange-400",
  md: "text-gray-400",
  svg: "text-green-400",
  py: "text-yellow-400",
};

function FileTree({
  nodes,
  depth = 0,
  active,
  onSelect,
  setSelectedFile,
  id,
  setTabs,
  setFiles
}) {
  return (
    <ul className="space-y-1">
      {nodes?.map((node) => (
        <TreeItem
          key={node?._id}
          node={node}
          depth={depth}
          active={active}
          onSelect={onSelect}
          setSelectedFile={setSelectedFile}
          id={id}
          setTabs = {setTabs}
          setFiles = {setFiles}
          
        />
      ))}
    </ul>
  );
}

function TreeItem({ node, depth, active, onSelect, setSelectedFile, id , setTabs,setFiles}) {
  const [open, setOpen] = useState(depth < 2);
  const [creatingFile, setCreatingFile] = useState(null);
  function getFile(e) {
      e.preventDefault();
      onSelect(node.fileName);
      setSelectedFile(node);
      setTabs([node.name]);
  }

  const isActive = active === node.name;
  return (

  <div className="">
    
    
    {node.isFolder && 
      <li>
        <div 
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className="w-full group flex items-center justify-between py-1.5 rounded hover:bg-zinc-800 text-sm text-gray-200"
        >

        <button
          onClick={() => setOpen(!open)}
          className="w-full"
        >
          <div className="w-full flex items-center gap-2 py-1.5 rounded hover:bg-zinc-800 text-sm text-gray-200">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}

            {open ? (
              <FolderOpen size={16} className="text-blue-400" />
            ) : (
              <FolderClosed size={16} className="text-blue-400" />
            )}

            {node.name}
          </div>

          

        </button>
        <button
          onClick={(e) =>(
            e.stopPropagation(),
            setCreatingFile({parentId: node._id,isFolder: false}),
            setOpen(true)
          )
          }
          className="opacity-0 group-hover:opacity-100 font-light cursor-pointer text-zinc-500 mx-2 hover:text-white rounded-md"
        >
          <FilePlusCorner size={15}/>
        </button>
        <button
          onClick={(e) =>(
            e.stopPropagation(),
            setCreatingFile({parentId: node._id,isFolder: true}),
            setOpen(true)
          )
          }
          className="opacity-0 group-hover:opacity-100 text-sm font-light cursor-pointer text-zinc-500 mx-2 hover:text-white rounded-md  p-0.2"
        >
          <FolderPlus size={15}/>
        </button>
        </div>

        {open && node.children && (
          <>
            <FileTree
              nodes={node.children}
              depth={depth + 1}
              active={active}
              onSelect={onSelect}
              setSelectedFile={setSelectedFile}
              creatingFile={creatingFile}
              setCreatingFile={setCreatingFile}
              id = {id}
              setTabs={setTabs}
              setFiles = {setFiles}
            />

            {String(creatingFile?.parentId) == String(node._id) && (
              <li
                style={{
                  paddingLeft: `${(depth + 1) * 12 + 28}px`,
                }}
              >
                <input
                  className="border rounded-sm px-2 py-1 text-sm border-gray-700 outline-violet-700"
                  autoFocus
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      const response = await API.post(`/api/projects/${id}/file`, {
                        project: id,

                        parent: node._id,

                        fileName: e.target.value,
                        isFolder:creatingFile.isFolder,
                      },{withCredentials:true});

                      setCreatingFile(null);
                      setFiles(response.data.tree);
                      setOpen(open)
                      // await getProject(); // reload tree
                    }

                    if (e.key === "Escape") {
                      setCreatingFile(null);
                    }
                  }}
                />
              </li>
            )}
          </>
        )}
      </li>
    }

    {
      !node.isFolder && 
      <li>
        <button
          onClick={getFile}
          style={{ paddingLeft: `${depth * 12 + 28}px` }}
          className={cn(
            "w-full flex items-center gap-2 py-1.5 rounded text-sm cursor-pointer bg-zinc-800",
            isActive
              ? "bg-blue-500/20 text-white "
              : "text-gray-300 hover:bg-zinc-800",
          )}
        >
          <File size={15} className={extColors[node.ext] || "text-gray-400"} />

          {node.name}
        </button>
      </li>

  
    }

    
    
  </div>
  );


}

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
  const [tabs, setTabs] = useState([]);
  const [showAddCollab, setShowAddCollab] = useState(false);
  const [collabMail, setCollabMail] = useState("");
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageSuccessful, setMessageSuccessful] = useState(false);


  useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
  }, 1000);

  return () => clearTimeout(timer);
}, [message]);


  async function getProject() {
    try {
      const response = await API.get(`/api/projects/${id}`, {
        withCredentials: true,
      });

      setProject(response.data.project);
      setFiles(response.data.tree);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {

    getProject();
  }, [id]);


  function updateTree(nodes, fileId, newContent){
    return nodes.map(node=>{
      if(String(node._id) == String(fileId)){
        return {
          ...node,
          content:newContent,
          dirty:true
        };
      }
      if(node.isFolder && node.children){
        return {
          ...node,
          children:updateTree(node.children, fileId, newContent),
        };
      }
      return node;
    });
  }
  function collectDirtyFiles(nodes, dirty = []){
    for(const node of nodes){
      
      if(node.isFolder){
        collectDirtyFiles(node.children, dirty);
      }
      else if(node.dirty){
        dirty.push(node);
      }
    }
    return dirty;
  }

  async function handleSaveAll(e){
    e.preventDefault();
    try {
      const dirtyFiles = collectDirtyFiles(files);
      console.log(dirtyFiles);
      const response = await API.put(`/api/projects/${id}/save`,{dirtyFiles},{withCredentials:true});
    } catch (error) {
      console.error(error);
      
    }
  }
 

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-white overflow-hidden">
      {/* TOP BAR */}
      <header className="h-12 border-b border-zinc-700 flex items-center px-4 gap-4 bg-zinc-950">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
            <Code2 size={18} />
          </div>

          <span className="font-semibold">CodeCollabAI</span>
        </Link>

        <span className="text-gray-500">/</span>

        <span className="text-sm text-gray-300">{project?.title}</span>

        <div className="flex items-center gap-1 text-xs bg-zinc-800 px-2 py-1 rounded">
          <GitBranch size={12} />
          {params.branch}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=>(setShowAddCollab(true))} className="flex items-center gap-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-sm hover:cursor-pointer transition-colors">
            <UserPlus size={14}/>
            Add collaborator
          </button>
          <button onClick={handleSaveAll} className="flex items-center gap-1 px-3 py-1.5 rounded bg-green-800 hover:bg-green-700 text-sm hover:cursor-pointer transition-colors">
            <SaveAll size={14}/>
            Save all
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-sm hover:cursor-pointer transition-colors">
            <Play size={14} />
            Run
          </button>

          <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-sm hover:cursor-pointer transition-colors">
            <Sparkles size={14} />
            Ask AI
          </button>
        </div>
      </header>

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden hide-scrollbar ">
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
            <span className="text-xs uppercase text-gray-500">Explorer</span>

            <button  className="hover:bg-zinc-800 p-1 rounded">
              <Plus size={15} />
            </button>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto px-2 pb-3 hide-scrollbar">
            <FileTree
              nodes={files}
              active={active}
              onSelect={setActive}
              setSelectedFile={setSelectedFile}
              id = {id}
              setTabs = {setTabs}
              setFiles = {setFiles}
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
                    : "text-gray-400 hover:text-white",
                )}
              >
                <File size={14} />

                {tab}

                <X
                  size={12}
                  onClick={(e) => {
                    e.stopPropagation();

                    setTabs(tabs.filter((item) => item !== tab));
                  }}
                />
              </div>
            ))}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={selectedFile?.language || "javascript"}
              theme="vs-dark"
              path={active}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                smoothScrolling: true,
              }}
              value={selectedFile ? selectedFile.content : ""}
              onChange={(value)=>{
                if(!selectedFile) return;
                setSelectedFile(prev=>({
                  ...prev,
                  content:value,
                  dirty:true
                }))
                setFiles(prev => {
                  const updated =  updateTree(prev, selectedFile._id, value);
                  return updated;
                })
              }}
            />
          </div>

          {/* Status Bar */}
          <div className="h-7 border-t border-zinc-700 bg-zinc-950 flex items-center px-4 text-xs text-gray-400">
            <span>{selectedFile?.language}</span>

            <span className="ml-auto">Ln 9, Col 24</span>
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
              <p className="text-sm font-medium">CodeCollabAI</p>

              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" && "flex-row-reverse",
                )}
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                  {msg.role === "ai" ? <Bot size={14} /> : "EM"}
                </div>

                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-xl text-sm",
                    msg.role === "ai" ? "bg-zinc-800" : "bg-blue-500/20",
                  )}
                >
                  <p className="text-xs text-gray-400 mb-1">{msg.name}</p>

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
      {showAddCollab && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-96 bg-zinc-900 rounded-lg p-6 shadow-xl border border-zinc-700">

            <h2 className="text-lg font-semibold mb-4">
              Enter email of Collab
            </h2>

            <input
              type="email"
              placeholder="e.g. sofiyan1@gmail.com"
              onChange={(e)=>setCollabMail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none"
            />

            <div className="flex justify-end gap-2 mt-5">

              <button
                onClick={() => setShowAddCollab(false)}
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                      const response = await API.post(`/api/projects/${id}/add-collaborator`,{
                      email:collabMail
                      }, {withCredentials:true})
                      setShowAddCollab(false);
                      setMessageSuccessful(true);
                      setMessage(response.data.message);
                      setCollabMail("");
                    } catch (error) {
                    console.error(error)
                    setShowAddCollab(false);
                    setMessage("error");
                    setCollabMail("");
                    
                  }
                }}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
              >
                Add
              </button>

            </div>

          </div>
        </div>
      )}

      {message && 
      <div className="fixed inset-0 bg-black/60 flex justify-center z-50">
        <div className="mt-2 w-fit h-fit p-2 flex justify-between  items-center bg-zinc-800 transition-all rounded-1">
          {
            messageSuccessful&&
            <Check size={22} className="text-green-500"/>
          }
          {
            !messageSuccessful &&
            <X size={22} className="text-red-500"/>
          }
          {message}
        </div>
      </div>
      }

    </div>
  );
}
