import React from "react";

const StatusCard = (params) => {
  return (
    <div className="rounded-lg shadow-sm p-5 bg-gray-800 text-gray-400 ">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm">{params.title}</p>
          <p className="font-semibold text-4xl">{params.number}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-violet-900/40 grid place-items-center text-primary">
            {<params.icon/>}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
