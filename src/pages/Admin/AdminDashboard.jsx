import React from "react";

function AdminDashboard() {
  return (
    <section className="admin-dash  flex  justify-center bg-[#f7fbff] w-screen h-screen ">
      <div className="mt-5">
        <div className="menu-header w-225  bg-white rounded-2xl p-5 flex justify-between items-center">
          <div className="m-h-text ">menu dashboard</div>
          <div className="m-h-btns">
            <button>revert</button>
            <button>publish changes</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
