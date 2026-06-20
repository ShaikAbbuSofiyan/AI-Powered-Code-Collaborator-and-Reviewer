import React from "react";
import { GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectCard = (params) => {
  const navigate = useNavigate();
  function handleProject(e){
    e.preventDefault();
    navigate(`/workspace/${params.id}`, {params});  
  }
  return (
    <div onClick={handleProject} className="rounded-lg border border-gray-900 text-gray-400 shadow-sm group p-5 bg-gray-800 hover:border-violet-400/40 transition-all hover:shadow-elegant h-[200px] flex flex-col justify-between">
      <div>
        <div className="flex gap-2">
          <div
            className={`bg-${params.color}-900 rounded-xl border px-4 py-3 w-12`}
          >
            {params.title.slice(0, 2)}
          </div>

          <div className="flex flex-col">
            <p className="font-semibold text-gray-100">{params.title}</p>

            <span className="text-sm">{params.lang}</span>
          </div>
        </div>

        <p className="mt-4 line-clamp-1">{params.description}</p>
      </div>

      <div className="flex gap-2 items-center">
        <GitBranch className="w-4 h-4" />

        <p className="w-fit border rounded-full text-sm bg-gray-800/20 px-2">
          {params.branch}
        </p>

        <p>{params.commits}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
