import React, { useState } from "react";

// const initialitems = {
//   id: "",
//   cid: "",
//   image: "",
//   name: "",
//   price: "",
// };
// const initialcategories = {
//   cid: "",
//   cname: "",
// };

function CataegoryTable() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  console.log("category", categories);
  console.log("items", items);

  function handleCategoryChange(e) {
    const { name, value } = e.target;
    setCategories((prev) => ({ ...prev, [name]: value }));
  }

  function handleItemChange(e) {
    const { name, value } = e.target;
    setItems((prev) => ({ ...prev, [name]: value }));
  }
  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function handleAddCategory() {
    const newCategory = { cid: makeId(), cname: "" };
    setCategories((prev) => [...prev, newCategory]);
  }
  function handleAddItem(cid) {
    const newItem = { id: makeId(), cid, image: "", name: "", price: "" };
    setItems((prev) => [...prev, newItem]);
  }

  return (
    <>
      {categories.map((c) => {
        return (
          <div key={c.cid} className="max-w-5xl mx-auto p-6">
            <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="top-div flex items-center gap-5 mb-4 pb-4 border-b border-gray-100">
                <input
                  type="text"
                  className=" flex-1 text-sm font-semibold px-2 py-1.5 rounded-lg tracking-wide text-gray-800 uppercase bg-transparent border border-transparent outline-none focus:ring-0 focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-colors placeholder:text-gray-300 placeholder:normal-case placeholder:font-normal w-40"
                  name="cname"
                  id="cname"
                  placeholder="Category name"
                  onChange={handleCategoryChange}
                />
                <button
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-dashed border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors"
                  onClick={handleAddItem}
                >
                  <span className="text-sm leading-none">+</span> Add new item
                </button>
              </div>

              <table className="w-full table-fixed border-separate border-spacing-0">
                <thead>
                  <tr className="text-start">
                    <th className="w-14 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                      Image
                    </th>
                    <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                      Name
                    </th>
                    <th className="w-24 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                      Price
                    </th>
                    <th className="w-28 text-right text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-start group">
                    <td className="py-2.5 border-t border-gray-50">
                      <label className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 text-xs cursor-pointer hover:bg-gray-100 hover:border-gray-200 transition-colors overflow-hidden">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          name="image"
                          id="image"
                          onChange={() => {
                            handleItemChange(c.cid);
                          }}
                        ></input>
                      </label>
                    </td>
                    <td className="py-2.5 border-t border-gray-50 pr-3">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Item name"
                        className="w-full text-sm text-gray-800 bg-transparent border border-transparent rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-colors"
                        onChange={() => {
                          handleItemChange(c.cid);
                        }}
                      />
                    </td>
                    <td className="py-2.5 border-t border-gray-50 pr-3">
                      <input
                        type="text"
                        name="price"
                        id="price"
                        placeholder="0"
                        inputMode="decimal"
                        className="w-full text-sm text-gray-700 bg-transparent border border-transparent rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-colors"
                        onChange={() => {
                          handleItemChange(c.cid);
                        }}
                      />
                    </td>
                    <td className="py-2.5 border-t border-gray-50">
                      <div className="flex justify-end gap-2">
                        <button className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                          Show
                        </button>
                        <button className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                          delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <button
        onClick={handleAddCategory}
        className="border border-gray-400 rounded-lg px-2 py-1.5 bg-gray-40 text-gray-800 font-bold "
      >
        add new categoory
      </button>
    </>
  );
}

export default CataegoryTable;
