import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AppSidebar } from "../components/AppSidebar";
import StatusCard from "../components/StatusCard";
import { Activity, Users, Zap } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import API from "../services/api.js";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [memberscount, setMemberscount] = useState(0);
useEffect(() => {

    async function getProjects() {

      try {

        const response = await API.get(
          "/api/projects/",
          { withCredentials: true }
        );

        const fetchedProjects = response.data.projects;

        setProjects(fetchedProjects);

        const totalMembers = fetchedProjects.reduce(
          (acc, project) =>
            acc + (project.members?.length || 0),
          0
        );

        setMemberscount(totalMembers);

      } catch (error) {

        console.log(error);

      }
    }

    getProjects();

  }, []);
  return (
    <div className="flex min-h-screen w-full bg-background ">
      <AppSidebar />
      <div className="flex gap-3 flex-col w-full border-l border-white/10">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <section className="grid lg:grid-cols-3 gap-4">

            <StatusCard title = {"Active Projects"} number = {projects.length} icon = {Activity}/>
            <StatusCard title = {"Team Members"} number = {memberscount} icon = {Users}/>
            <StatusCard title = {"AI sessions"} number = {0}  icon = {Zap}/>

          </section>
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
                <p className="text-sm text-gray-400">Pinned and recently updated.</p>
              </div>
              <div className="flex gap-2">
                <button variant="outline" className="bg-gray-800 rounded-sm px-3 py-2 border border-gray-700 text-gray-400 cursor-pointer hover:bg-blue-300/10 font-semibold hover:text-white hover:shadow-md">All</button>
                <button variant="ghost" className="rounded-sm px-3 py-2 border border-gray-700 text-gray-400 cursor-pointer hover:bg-blue-300/10 font-semibold hover:text-white hover:shadow-md">Pinned</button>
                <button variant="ghost" className="rounded-sm px-3 py-2 border border-gray-700 text-gray-400 cursor-pointer hover:bg-blue-300/10 font-semibold hover:text-white hover:shadow-md">Archived</button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {
                projects.length ? 
                projects.map((project, index)=>(
                  <div key={index}>
                    <Link to= "/workspace">
                    
                    <ProjectCard  title = {`${project.title}`} color = {"gray"} branch = {"sofiyan"}  lang = {"Typescript"} description = {`${project.description}`} commits = {""} id = {`${project._id}`}/>
                    </Link>
                  </div>
                )): ""
              }
            

            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
