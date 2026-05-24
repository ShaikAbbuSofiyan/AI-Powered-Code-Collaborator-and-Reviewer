import React from 'react'
import { Code2, Sparkles, GitBranch, Bot } from "lucide-react";
import { Link } from "react-router-dom";

function Aside() {
  return (
    <div >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-448px h-448px rounded-full bg-primary-glow/20 blur-3xl" />

        <div className="relative flex items-center gap-2 text-foreground">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight text-lg">
            CodeCollabAI
          </span>
        </div>

        <div className="relative space-y-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-surface/40 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary-glow" /> AI Developer
            Collaboration
          </div>
          <h1 className="text-5xl font-semibold tracking-tight leading-[1.05]">
            Build software, <br />
            <span className="bg-cyan-500 via-cyan- bg-clip-text text-transparent">
              together with AI.
            </span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A real-time workspace where your team and AI agents pair-program,
            review, and ship code in the same room.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { icon: Bot, label: "AI pair programming" },
              { icon: GitBranch, label: "Live branches" },
              { icon: Code2, label: "Cloud editor" },
              { icon: Sparkles, label: "Smart reviews" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl glass  bg-gray-900/70"
              >
                <div className="w-8 h-8 rounded-md bg-cyan-900/15 grid place-items-center text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-muted-foreground">
          © 2026 CodeCollabAI Labs · Crafted for engineering teams
        </p>

    </div>
  )
}

export default Aside
