import React from "react";
import { useNavigate } from "react-router";

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <section className="w-screen h-screen gap-3 flex-col flex justify-center items-center bg-linear-to-br from-[#2a2d56] via-[#121324] to-[#2c2a62] ">
      <div className=" flex flex-col  text-gray-500 font-bold items-center justify-center gap-2">
        <span className="text-9xl  bg-linear-to-tl from-white-900 to-gray-200 bg-clip-text text-transparent">
          404
        </span>
        <span className="text-6xl text-white">page not found</span>
      </div>
      <div className="max-w-75 text-gray-400">
        The page you're looking for may have been moved, renamed, or deleted.
      </div>
      <div className="">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="capitalize border border-gray-50/25 px-3 py-2 rounded-lg mt-3 text-gray-300 hover:bg-slate-50/25 transition-all hover:text-white cursor-pointer"
        >
          go back
        </button>
      </div>
    </section>
  );
}

export default PageNotFound;