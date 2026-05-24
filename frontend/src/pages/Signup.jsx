import React from "react";
import { Code2, Sparkles, GitBranch, Bot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from '../services/api.js'
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice.js";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleSignup(e) {
    e.preventDefault();
    const name  = e.target.name.value;
    const email  = e.target.email.value;
    const password  = e.target.password.value;
    const response = await API.post("/api/auth/register", {
        name, email, password
    }, {withCredentials: true});
    
    const user = response.data.user;
    dispatch(setUser(user));

    const token = await cookieStore.get("token");
    dispatch(setToken(token.value));

    navigate('/dashboard');
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
      {/* Left Side Branding */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-blue-900/80 via-violet-700/90 to-violet-700/50 overflow-hidden">
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
      </aside>

      {/* Right login card */}
      <main className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">CodeCollabAI</span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight">Sign Up</h2>
          <p className="text-muted-foreground mt-2">
            Sign up to create an account
          </p>

          <form className="mt-10 space-y-5 " onSubmit={handleSignup}>
            <div className="space-y-2 space-x-5 flex flex-col ">
              <label htmlFor="name" className="font-semibold">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. John Doe"
                className="h-11 bg-gray-700 rounded-1xl px-5 rounded outline-violet-900 hover:outline-3"
              />
            </div>
            <div className="space-y-2 space-x-5 flex flex-col ">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="h-11 bg-gray-700 rounded-1xl px-5 rounded outline-violet-900 hover:outline-3"

              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-semibold">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full h-11 bg-gray-700 rounded-1xl px-5 rounded outline-violet-900 hover:outline-3"
              />
            </div>

            <button className="w-full h-11  bg-linear-to-br from-violet-400/90 via-violet-100/80 to-blue-300/90 hover:opacity-90 shadow-glow font-medium">
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground text-center">
            Already Registered?{" "}
            <a
              href="/"
              className="text-primary hover:text-cyan-300 font-medium "
            >
              Sign In
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
