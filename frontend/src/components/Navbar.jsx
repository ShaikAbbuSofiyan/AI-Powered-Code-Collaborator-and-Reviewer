import React from 'react';
import {setUser} from '../redux/authSlice';
import {useSelector} from 'react-redux';
import { Bell, Search, Plus} from "lucide-react";
import CreateProject from '../pages/CreateProject';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = useSelector(state => state.auth.user);
  const newNotification = 1;
  return (
    <header className="h-20 border-b border-white/10 bg-background/70 backdrop-blur sticky top-0 z-10 flex items-center gap-4 px-6">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-tight truncate text-gray-100">Hello, {user?.name}</h1>
        <p className="text-sm text-muted-foreground truncate text-gray-400">Here's what's moving on your workspace today</p>
      </div>

      <div className="flex-1 max-w-md ml-auto relative hidden md:block ">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search projects, files, people…" className="pl-9 h-10 w-full bg-gray-800 rounded-xl focus:border-violet-500 hover:ring-violet-900/80 hover:ring-5 focus:ring-4 focus:ring-violet-500/40 outline-none " />
      </div>

      <button size="icon" variant="ghost" className="relative h-9 w-9 hover:bg-cyan-500/90 hover:rounded-sm px-2 hover:cursor-pointer items-center outline-none">
        <Bell className="w-5 h-5" />
        {newNotification != null ? <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-700 " />:<span></span>}
      </button>

      <button className="bg-linear-to-br from-violet-300/90 via-cyan-400/80 to-violet-400/90 rounded-[5px] items-center p-2 hover:cursor-pointer hover:opacity-90 shadow-glow gap-2 hidden sm:inline-flex  ">
        <Plus className="w-4 h-4" /> <a href="/createproject">New project</a> 
          
      </button>
    </header>
  )
}

export default Navbar
