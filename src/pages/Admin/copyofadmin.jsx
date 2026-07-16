import React from "react";
import { RotateCcw, Save } from "lucide-react";
import CataegoryTable from "../../components/CataegoryTable";

function AdminDashboard() {
  return (
    <section className="admin-dash flex  justify-center bg-[#f7fbff] w-full min-h-screen">
      <div className="w-full max-w-5xl">
        <div className="w-full  p-5">
          <div className="menu-header bg-white rounded-2xl p-6 flex justify-between items-center shadow-sm border border-gray-100">
            <div>
              <h1 className="font-bold text-2xl capitalize text-gray-900">
                menu dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Last published 2 hours ago
              </p>
            </div>

            <div className="m-h-btns flex gap-3">
              <button className="flex items-center cursor-pointer gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <RotateCcw size={16} />
                Revert
              </button>
              <button className="flex items-center  cursor-pointer gap-2 bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-600 transition-colors">
                <Save size={16} />
                Publish changes
              </button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-5xl p-5 flex flex-col gap-6">
          <CataegoryTable />
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
