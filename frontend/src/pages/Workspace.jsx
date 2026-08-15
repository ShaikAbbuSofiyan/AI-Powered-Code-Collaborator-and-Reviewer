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
  Check,
  Trash2,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const cn = (...classes) => classes.filter(Boolean).join("");

const extColors = {
  jsx: "text-blue-400",
  js: "text-yellow-400",
  json: "text-orange-400",
  md: "text-gray-400",
  svg: "text-green-400",
  py: "text-yellow-400",
};

/* =========================================================
   FILE TREE
========================================================= */

function FileTree({
  nodes,
  depth = 0,
  active,
  onSelect,
  setSelectedFile,
  id,
  setTabs,
  setFiles,
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
          setTabs={setTabs}
          setFiles={setFiles}
        />
      ))}
    </ul>
  );
}

/* =========================================================
   TREE ITEM
========================================================= */

function TreeItem({
  node,
  depth,
  active,
  onSelect,
  setSelectedFile,
  id,
  setTabs,
  setFiles,
}) {
  const [open, setOpen] = useState(depth < 2);
  const [creatingItem, setCreatingItem] = useState(null);

  /* -------------------------------------------------------
     OPEN FILE
  ------------------------------------------------------- */

  function getFile(e) {
    e.preventDefault();

    onSelect(node.name);
    setSelectedFile(node);

    setTabs((prev) => {
      if (prev.includes(node.name)) {
        return prev;
      }

      return [...prev, node.name];
    });
  }

  /* -------------------------------------------------------
     CREATE FILE/FOLDER INSIDE CURRENT FOLDER
  ------------------------------------------------------- */

  async function createItem(name) {
    if (!name?.trim()) {
      setCreatingItem(null);
      return;
    }

    try {
      const response = await API.post(
        `/api/projects/${id}/file`,
        {
          project: id,
          parent: node._id,
          fileName: name.trim(),
          isFolder: creatingItem.isFolder,
        },
        {
          withCredentials: true,
        }
      );

      setFiles(response.data.tree);

      setOpen(true);

      setCreatingItem(null);
    } catch (error) {
      console.error("Error creating item:", error);
      setCreatingItem(null);
    }
  }

  /* -------------------------------------------------------
     DELETE FILE/FOLDER
  ------------------------------------------------------- */

  async function deleteItem(e) {
    e.stopPropagation();

    const type = node.isFolder ? "folder" : "file";

    const confirmed = window.confirm(
      `Are you sure you want to delete this ${type}: "${node.name}"?${
        node.isFolder
          ? "\n\nAll files and folders inside it will also be deleted."
          : ""
      }`
    );

    if (!confirmed) return;

    try {
      const response = await API.delete(
        `/api/projects/${id}/file/${node._id}`,
        {
          withCredentials: true,
        }
      );

      setFiles(response.data.tree);

      /*
        Remove deleted item from tabs.
        For folders, the backend should return the
        updated tree after removing the folder and children.
      */

      if (!node.isFolder) {
        setTabs((prev) =>
          prev.filter((tab) => tab !== node.name)
        );

        if (active === node.name) {
          onSelect("");
          setSelectedFile(null);
        }
      }

      /*
        If deleting a folder, clear selected file.
        This is useful when the selected file was inside it.
      */

      if (node.isFolder) {
        setSelectedFile((currentFile) => {
          if (!currentFile) return null;

          return null;
        });

        onSelect("");

        /*
          Remove tabs that no longer exist after the
          backend returns the updated tree.
        */

        function collectFileNames(nodes, result = []) {
          for (const item of nodes || []) {
            if (item.isFolder) {
              collectFileNames(item.children || [], result);
            } else {
              result.push(item.name);
            }
          }

          return result;
        }

        const remainingFiles = collectFileNames(
          response.data.tree
        );

        setTabs((prev) =>
          prev.filter((tab) =>
            remainingFiles.includes(tab)
          )
        );
      }
    } catch (error) {
      console.error("Error deleting item:", error);

      window.alert(
        error.response?.data?.message ||
          "Failed to delete item"
      );
    }
  }

  const isActive = active === node.name;

  return (
    <div>
      {/* =====================================================
          FOLDER
      ===================================================== */}

      {node.isFolder && (
        <li>
          <div
            style={{
              paddingLeft: `${depth * 12 + 8}px`,
            }}
            className="w-full group flex items-center justify-between py-1.5 rounded hover:bg-zinc-800 text-sm text-gray-200"
          >
            {/* FOLDER OPEN/CLOSE */}

            <button
              onClick={() =>
                setOpen((prev) => !prev)
              }
              className="flex-1 min-w-0"
            >
              <div className="w-full flex items-center gap-2 py-1.5 rounded text-sm text-gray-200">
                {open ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}

                {open ? (
                  <FolderOpen
                    size={16}
                    className="text-blue-400"
                  />
                ) : (
                  <FolderClosed
                    size={16}
                    className="text-blue-400"
                  />
                )}

                <span className="truncate">
                  {node.name}
                </span>
              </div>
            </button>

            {/* CREATE FILE */}

            <button
              onClick={(e) => {
                e.stopPropagation();

                setCreatingItem({
                  isFolder: false,
                });

                setOpen(true);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white rounded"
              title="New File"
            >
              <FilePlusCorner size={15} />
            </button>

            {/* CREATE FOLDER */}

            <button
              onClick={(e) => {
                e.stopPropagation();

                setCreatingItem({
                  isFolder: true,
                });

                setOpen(true);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white rounded"
              title="New Folder"
            >
              <FolderPlus size={15} />
            </button>

            {/* DELETE FOLDER */}

            <button
              onClick={deleteItem}
              className="opacity-0 group-hover:opacity-100 p-1 mr-1 text-zinc-500 hover:text-red-500 rounded"
              title="Delete Folder"
            >
              <Trash2 size={15} />
            </button>
          </div>

          {/* =================================================
              FOLDER CHILDREN
          ================================================= */}

          {open && (
            <>
              {node.children?.length > 0 && (
                <FileTree
                  nodes={node.children}
                  depth={depth + 1}
                  active={active}
                  onSelect={onSelect}
                  setSelectedFile={setSelectedFile}
                  id={id}
                  setTabs={setTabs}
                  setFiles={setFiles}
                />
              )}

              {/* CREATE FILE/FOLDER INPUT */}

              {creatingItem && (
                <li
                  style={{
                    paddingLeft: `${
                      (depth + 1) * 12 + 28
                    }px`,
                  }}
                  className="py-1"
                >
                  <div className="flex items-center gap-2">
                    {creatingItem.isFolder ? (
                      <FolderClosed
                        size={15}
                        className="text-blue-400"
                      />
                    ) : (
                      <File
                        size={15}
                        className="text-gray-400"
                      />
                    )}

                    <input
                      autoFocus
                      placeholder={
                        creatingItem.isFolder
                          ? "Folder name"
                          : "File name"
                      }
                      className="flex-1 min-w-0 bg-zinc-800 border border-zinc-700 rounded-sm px-2 py-1 text-sm outline-none focus:border-violet-600"
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          await createItem(
                            e.target.value
                          );
                        }

                        if (e.key === "Escape") {
                          setCreatingItem(null);
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          setCreatingItem(null);
                        }
                      }}
                    />
                  </div>
                </li>
              )}
            </>
          )}
        </li>
      )}

      {/* =====================================================
          FILE
      ===================================================== */}

      {!node.isFolder && (
        <li
          className="group flex items-center"
          style={{
            paddingLeft: `${depth * 12 + 28}px`,
          }}
        >
          <button
            onClick={getFile}
            className={cn(
              "flex-1 min-w-0 flex items-center gap-2 py-1.5 rounded text-sm cursor-pointer",
              isActive
                ? "bg-blue-500/20 text-white"
                : "text-gray-300 hover:bg-zinc-800"
            )}
          >
            <File
              size={15}
              className={
                extColors[node.ext] ||
                "text-gray-400"
              }
            />

            <span className="truncate">
              {node.name}
            </span>
          </button>

          {/* DELETE FILE */}

          <button
            onClick={deleteItem}
            className="opacity-0 group-hover:opacity-100 p-1 mr-1 text-zinc-500 hover:text-red-500 rounded"
            title="Delete File"
          >
            <Trash2 size={15} />
          </button>
        </li>
      )}
    </div>
  );
}

/* =========================================================
   MESSAGES
========================================================= */

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

/* =========================================================
   WORKSPACE
========================================================= */

export default function Workspace(params) {
  const [active, setActive] = useState("ChatPanel.jsx");

  const [project, setProject] =
    useState(null);

  const [files, setFiles] =
    useState([]);

  const [tabs, setTabs] =
    useState([]);

  const [showAddCollab, setShowAddCollab] =
    useState(false);

  const [collabMail, setCollabMail] =
    useState("");

  const { id } = useParams();

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [
    messageSuccessful,
    setMessageSuccessful,
  ] = useState(false);

  /*
    null = nothing

    { menu: true } = show menu

    {
      menu: false,
      isFolder: false
    } = create file

    {
      menu: false,
      isFolder: true
    } = create folder
  */

  const [creatingRoot, setCreatingRoot] =
    useState(null);

  /* =======================================================
     MESSAGE TIMER
  ======================================================= */

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 1500);

    return () => clearTimeout(timer);
  }, [message]);

  /* =======================================================
     GET PROJECT
  ======================================================= */

  async function getProject() {
    try {
      const response = await API.get(
        `/api/projects/${id}`,
        {
          withCredentials: true,
        }
      );

      setProject(response.data.project);

      setFiles(response.data.tree);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProject();
  }, [id]);

  /* =======================================================
     CREATE ROOT FILE/FOLDER
  ======================================================= */

  async function createRootItem(name) {
    if (!name?.trim()) {
      setCreatingRoot(null);
      return;
    }

    try {
      const response = await API.post(
        `/api/projects/${id}/file`,
        {
          project: id,
          parent: null,
          fileName: name.trim(),
          isFolder: creatingRoot.isFolder,
        },
        {
          withCredentials: true,
        }
      );

      setFiles(response.data.tree);

      const wasFolder =
        creatingRoot.isFolder;

      setCreatingRoot(null);

      setMessageSuccessful(true);

      setMessage(
        wasFolder
          ? "Folder created successfully"
          : "File created successfully"
      );
    } catch (error) {
      console.error(
        "Error creating root item:",
        error
      );

      setMessageSuccessful(false);

      setMessage(
        error.response?.data?.message ||
          "Failed to create item"
      );
    }
  }

  /* =======================================================
     UPDATE TREE
  ======================================================= */

  function updateTree(
    nodes,
    fileId,
    newContent
  ) {
    return nodes.map((node) => {
      if (
        String(node._id) ===
        String(fileId)
      ) {
        return {
          ...node,
          content: newContent,
          dirty: true,
        };
      }

      if (
        node.isFolder &&
        node.children
      ) {
        return {
          ...node,
          children: updateTree(
            node.children,
            fileId,
            newContent
          ),
        };
      }

      return node;
    });
  }

  /* =======================================================
     COLLECT DIRTY FILES
  ======================================================= */

  function collectDirtyFiles(
    nodes,
    dirty = []
  ) {
    for (const node of nodes) {
      if (node.isFolder) {
        if (node.children) {
          collectDirtyFiles(
            node.children,
            dirty
          );
        }
      } else if (node.dirty) {
        dirty.push(node);
      }
    }

    return dirty;
  }

  /* =======================================================
     SAVE ALL
  ======================================================= */

  async function handleSaveAll(e) {
    e.preventDefault();

    try {
      const dirtyFiles =
        collectDirtyFiles(files);

      await API.put(
        `/api/projects/${id}/save`,
        {
          dirtyFiles,
        },
        {
          withCredentials: true,
        }
      );

      function removeDirty(nodes) {
        return nodes.map((node) => {
          if (node.isFolder) {
            return {
              ...node,
              children: removeDirty(
                node.children || []
              ),
            };
          }

          return {
            ...node,
            dirty: false,
          };
        });
      }

      setFiles((prev) =>
        removeDirty(prev)
      );

      setMessageSuccessful(true);

      setMessage(
        "Files saved successfully"
      );
    } catch (error) {
      console.error(error);

      setMessageSuccessful(false);

      setMessage(
        "Failed to save files"
      );
    }
  }

  /* =======================================================
     RETURN UI
  ======================================================= */

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-white overflow-hidden">

      {/* ================= TOP BAR ================= */}

      <header className="h-12 border-b border-zinc-700 flex items-center px-4 gap-4 bg-zinc-950">
        <Link
          to="/dashboard"
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
            <Code2 size={18} />
          </div>

          <span className="font-semibold">
            CodeCollabAI
          </span>
        </Link>

        <span className="text-gray-500">
          /
        </span>

        <span className="text-sm text-gray-300">
          {project?.title}
        </span>

        <div className="flex items-center gap-1 text-xs bg-zinc-800 px-2 py-1 rounded">
          <GitBranch size={12} />
          {params.branch}
        </div>

        <div className="ml-auto flex items-center gap-2">

          <button
            onClick={() =>
              setShowAddCollab(true)
            }
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-sm hover:cursor-pointer transition-colors"
          >
            <UserPlus size={14} />
            Add collaborator
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-green-800 hover:bg-green-700 text-sm hover:cursor-pointer transition-colors"
          >
            <SaveAll size={14} />
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

      {/* ================= MAIN BODY ================= */}

      <div className="flex flex-1 overflow-hidden hide-scrollbar">

        {/* ================= SIDEBAR ================= */}

        <aside className="w-64 border-r border-zinc-700 bg-zinc-950 flex flex-col">

          {/* SEARCH */}

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

          {/* EXPLORER */}

          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs uppercase text-gray-500">
              Explorer
            </span>

            {/* ROOT CREATE BUTTON */}

            <div className="relative">
              <button
                onClick={() =>
                  setCreatingRoot((prev) =>
                    prev
                      ? null
                      : { menu: true }
                  )
                }
                className="hover:bg-zinc-800 p-1 rounded"
                title="Create file or folder"
              >
                <Plus size={15} />
              </button>

              {/* CREATE MENU */}

              {creatingRoot?.menu && (
                <div className="absolute right-0 top-8 z-50 w-40 bg-zinc-800 border border-zinc-700 rounded shadow-lg overflow-hidden">

                  <button
                    onClick={() =>
                      setCreatingRoot({
                        menu: false,
                        isFolder: false,
                      })
                    }
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 text-left"
                  >
                    <FilePlusCorner size={15} />
                    New File
                  </button>

                  <button
                    onClick={() =>
                      setCreatingRoot({
                        menu: false,
                        isFolder: true,
                      })
                    }
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 text-left"
                  >
                    <FolderPlus size={15} />
                    New Folder
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ROOT CREATE INPUT */}

          {creatingRoot &&
            !creatingRoot.menu && (
              <div className="px-3 pb-2">
                <div className="flex items-center gap-2">

                  {creatingRoot.isFolder ? (
                    <FolderClosed
                      size={15}
                      className="text-blue-400"
                    />
                  ) : (
                    <File
                      size={15}
                      className="text-gray-400"
                    />
                  )}

                  <input
                    autoFocus
                    placeholder={
                      creatingRoot.isFolder
                        ? "Folder name"
                        : "File name"
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm outline-none focus:border-violet-600"
                    onKeyDown={async (e) => {
                      if (
                        e.key === "Enter"
                      ) {
                        await createRootItem(
                          e.target.value
                        );
                      }

                      if (
                        e.key === "Escape"
                      ) {
                        setCreatingRoot(null);
                      }
                    }}
                  />
                </div>
              </div>
            )}

          {/* FILE TREE */}

          <div className="flex-1 overflow-y-auto px-2 pb-3 hide-scrollbar">
            <FileTree
              nodes={files}
              active={active}
              onSelect={setActive}
              setSelectedFile={
                setSelectedFile
              }
              id={id}
              setTabs={setTabs}
              setFiles={setFiles}
            />
          </div>
        </aside>

        {/* ================= EDITOR ================= */}

        <section className="flex-1 flex flex-col overflow-hidden">

          {/* TABS */}

          <div className="h-10 border-b border-zinc-700 flex bg-zinc-950">
            {tabs.map((tab) => (
              <div
                key={tab}
                onClick={() => {
                  setActive(tab);
                }}
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

                    setTabs((prev) =>
                      prev.filter(
                        (item) =>
                          item !== tab
                      )
                    );

                    if (
                      active === tab
                    ) {
                      setActive("");
                      setSelectedFile(
                        null
                      );
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* MONACO EDITOR */}

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={
                selectedFile?.language ||
                "javascript"
              }
              language={
                selectedFile?.language ||
                "javascript"
              }
              theme="vs-dark"
              path={active}
              options={{
                fontSize: 14,
                minimap: {
                  enabled: false,
                },
                smoothScrolling: true,
              }}
              value={
                selectedFile
                  ? selectedFile.content || ""
                  : ""
              }
              onChange={(value) => {
                if (!selectedFile) {
                  return;
                }

                setSelectedFile((prev) => ({
                  ...prev,
                  content: value,
                  dirty: true,
                }));

                setFiles((prev) =>
                  updateTree(
                    prev,
                    selectedFile._id,
                    value
                  )
                );
              }}
            />
          </div>

          {/* STATUS BAR */}

          <div className="h-7 border-t border-zinc-700 bg-zinc-950 flex items-center px-4 text-xs text-gray-400">
            <span>
              {selectedFile?.language}
            </span>

            <span className="ml-auto">
              Ln 9, Col 24
            </span>
          </div>
        </section>

        {/* ================= AI CHAT ================= */}

        <aside className="w-87.5 border-l border-zinc-700 bg-zinc-950 flex flex-col">

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
                  {msg.role === "ai"
                    ? <Bot size={14} />
                    : "EM"}
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

          {/* CHAT INPUT */}

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

      {/* ================= ADD COLLABORATOR ================= */}

      {showAddCollab && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-96 bg-zinc-900 rounded-lg p-6 shadow-xl border border-zinc-700">

            <h2 className="text-lg font-semibold mb-4">
              Enter email of Collab
            </h2>

            <input
              type="email"
              placeholder="e.g. sofiyan1@gmail.com"
              value={collabMail}
              onChange={(e) =>
                setCollabMail(
                  e.target.value
                )
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none"
            />

            <div className="flex justify-end gap-2 mt-5">

              <button
                onClick={() =>
                  setShowAddCollab(false)
                }
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    const response =
                      await API.post(
                        `/api/projects/${id}/add-collaborator`,
                        {
                          email: collabMail,
                        },
                        {
                          withCredentials: true,
                        }
                      );

                    setShowAddCollab(false);

                    setMessageSuccessful(true);

                    setMessage(
                      response.data.message
                    );

                    setCollabMail("");
                  } catch (error) {
                    console.error(error);

                    setShowAddCollab(false);

                    setMessageSuccessful(false);

                    setMessage("Error");

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

      {/* ================= TOAST ================= */}

      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="w-fit h-fit p-3 flex justify-between items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg">

            {messageSuccessful ? (
              <Check
                size={22}
                className="text-green-500"
              />
            ) : (
              <X
                size={22}
                className="text-red-500"
              />
            )}

            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}