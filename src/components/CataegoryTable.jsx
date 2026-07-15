import React, { useState } from "react";

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const fakeCategories = [
  { cid: "cat-1", cname: "Electronics" },
  { cid: "cat-2", cname: "Clothing" },
  { cid: "cat-3", cname: "Home & Kitchen" },
];

const fakeItems = [
  {
    id: "item-101",
    name: "Wireless Headphones",
    price: "99.99",
    cid: "cat-1",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
    visible: true,
  },
  {
    id: "item-102",
    name: "Mechanical Keyboard",
    price: "129.50",
    cid: "cat-1",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150",
    visible: true,
  },
  {
    id: "item-201",
    name: "Oversized Hoodie",
    price: "45.00",
    cid: "cat-2",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150",
    visible: true,
  },
  {
    id: "item-202",
    name: "Denim Jacket",
    price: "79.99",
    cid: "cat-2",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=150",
    visible: true,
  },
  {
    id: "item-301",
    name: "Chef's Knife",
    price: "49.99",
    cid: "cat-3",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=150",
    visible: true,
  },
];

function CataegoryTable() {
  const [hideitems, setHideitems] = useState("hide");
  const [items, setItems] = useState(fakeItems);
  const [categories, setCategories] = useState(fakeCategories);

  console.log("items:", items);
  console.log("categories", categories);
  function handleAddCategory() {
    setCategories((prev) => [...prev, { cid: makeId(), cname: "" }]);
  }

  function handleAddItem(cid) {
    setItems((prev) => [
      ...prev,
      { id: makeId(), cid, image: "", name: "", price: "", visible: true },
    ]);
  }

  function handleCategoryChange(cid, e) {
    const { value } = e.target;
    setCategories((prev) =>
      prev.map((cat) => (cat.cid === cid ? { ...cat, cname: value } : cat)),
    );
  }

  function handleItemChange(id, e) {
    const { name, value } = e.target;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [name]: value } : item)),
    );
  }
  function handleImageChange(id, e) {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, image: file, imagePreview: previewUrl }
          : item,
      ),
    );
  }
  function handleHideChange() {
    setHideitems("show");
  }
  function handleToggleVisibility(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item,
      ),
    );
  }
  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
      {categories.map((c) => (
        <div
          key={c.cid}
          className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="top-div flex items-center gap-5 mb-4 pb-4 border-b border-gray-100">
            <input
              type="text"
              className="flex-1 text-sm font-semibold px-2 py-1.5 rounded-lg tracking-wide text-gray-800 uppercase bg-transparent border border-transparent outline-none focus:ring-0 focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-colors placeholder:text-gray-300 placeholder:normal-case placeholder:font-normal w-40"
              value={c.cname}
              placeholder="Category name"
              onChange={(e) => handleCategoryChange(c.cid, e)}
            />
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-dashed border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors"
              onClick={() => handleAddItem(c.cid)}
            >
              <span className="text-sm leading-none">+</span> Add new item
            </button>
          </div>

          <table className="w-full table-fixed border-separate border-spacing-0">
            <thead>
              <tr className="text-start">
                <th className="w-20  text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                  Image
                </th>
                <th className="text-left  text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                  Name
                </th>
                <th className="w-24  text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                  Price
                </th>
                <th className="w-28  text-right text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items
                .filter((item) => item.cid === c.cid)
                .map((item) => (
                  <tr key={item.id} className="text-start group ">
                    <td className="py-2.5 border-t border-gray-50">
                      <label
                        className={`w-9 h-9 rounded-lg bg-gray-300 border border-gray-400 flex items-center justify-center text-gray-700 text-xs cursor-pointer hover:bg-gray-400 hover:border-gray-500 transition-colors overflow-hidden ${!item.visible ? "opacity-50 line-through" : ""}`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(item.id, e)}
                        />
                        {item.imagePreview || item.image ? (
                          <img
                            src={item.imagePreview || item.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "img"
                        )}
                      </label>
                    </td>
                    <td className="py-2.5 border-t border-gray-50 pr-3">
                      <input
                        type="text"
                        name="name"
                        placeholder="Item name"
                        value={item.name}
                        className={`w-full text-sm text-gray-800 bg-transparent border border-transparent rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-color ${!item.visible ? "opacity-50 line-through" : ""}`}
                        onChange={(e) => handleItemChange(item.id, e)}
                      />
                    </td>
                    <td className="py-2.5 border-t border-gray-50 pr-3">
                      <input
                        type="text"
                        name="price"
                        placeholder="0"
                        inputMode="decimal"
                        value={item.price}
                        className={`w-15 text-sm text-gray-700 bg-transparent border border-transparent rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-colors ${!item.visible ? "opacity-50 line-through " : ""} `}
                        onChange={(e) => handleItemChange(item.id, e)}
                      />
                    </td>
                    <td className="py-2.5 border-t border-gray-50">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleVisibility(item.id)}
                          className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          {item.visible ? "Hide" : "Show"}
                        </button>
                        <button className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                          delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}

      <button
        onClick={handleAddCategory}
        className="border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
      >
        + Add new category
      </button>
    </div>
  );
}

export default CataegoryTable;
