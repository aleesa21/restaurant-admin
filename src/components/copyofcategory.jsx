import React, { useState } from "react";

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function CataegoryTable() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  console.log("categories", categories);
  console.log("items", items);

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleAddCategory() {
    setCategories((prev) => [...prev, { id: makeId(), name: "" }]);
  }
  function handleAddItem(categoryId) {
    setItems((prev) => [
      ...prev,
      {
        id: makeId(),
        categoryId,
        image: "",
        name: "",
        price: "",
        visible: true,
        variants: [],
        addons: [],
      },
    ]);
  }
  function handleItemChange(id, e) {
    const { name, value } = e.target;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [name]: value } : item)),
    );
  }
  function handleCategoryChange(id, e) {
    const { name, value } = e.target;
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [name]: value } : cat)),
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

  function handleToggleVisibility(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item,
      ),
    );
  }

  function handleDeleteItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }
  // function handleDeleteCategory(id){
  //   setCategories((prev)=>prev.filter((category)=> category.id !==id))
  // }

  //variants adn addons

  function handleAddVariant(itemId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              variants: [
                ...item.variants,
                { id: makeId(), label: "", price: "" },
              ],
            }
          : item,
      ),
    );
  }

  function handleVariantChange(itemId, variantId, e) {
    const { name, value } = e.target;
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              variants: item.variants.map((v) =>
                v.id === variantId ? { ...v, [name]: value } : v,
              ),
            }
          : item,
      ),
    );
  }

  function handleAddAddon(itemId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              addons: [...item.addons, { id: makeId(), name: "", price: "" }],
            }
          : item,
      ),
    );
  }

  function handleAddonChange(itemId, addonId, e) {
    const { name, value } = e.target;
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              addons: item.addons.map((a) =>
                a.id === addonId ? { ...a, [name]: value } : a,
              ),
            }
          : item,
      ),
    );
  }

  function handleDeleteVariant(itemId, variantId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              variants: item.variants.filter((v) => v.id !== variantId),
            }
          : item,
      ),
    );
  }

  function handleDeleteAddon(itemId, addonId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, addons: item.addons.filter((a) => a.id !== addonId) }
          : item,
      ),
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
      {categories.map((c) => {
        return (
          <div
            key={c.id}
            className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="top-div flex items-center gap-5 mb-4 pb-4 border-b border-gray-100">
              <input
                type="text"
                value={c.name}
                onChange={(e) => handleCategoryChange(c.id, e)}
                className="flex-1 text-sm font-semibold px-2 py-1.5 rounded-lg tracking-wide text-gray-800 uppercase bg-transparent border border-transparent outline-none focus:ring-0 focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-colors placeholder:text-gray-300 placeholder:normal-case placeholder:font-normal w-40"
                placeholder="Category name"
              />
              <button
                onClick={() => handleAddItem(c.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-dashed border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors"
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
                  <th className="w-45  text-right text-[11px] font-medium text-gray-400 uppercase tracking-wide pb-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter((item) => item.categoryId === c.id)
                  .map((item) => (
                    <>
                      <tr key={item.id} className="text-start group  ">
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
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, e)}
                            placeholder="Item name"
                            className={`w-full text-sm text-gray-800 bg-transparent border border-transparent rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-color ${!item.visible ? "opacity-50 line-through" : ""} `}
                          />
                        </td>
                        <td className="py-2.5 border-t border-gray-50 pr-3">
                          <input
                            type="text"
                            name="price"
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, e)}
                            placeholder="0"
                            inputMode="decimal"
                            className={`w-15 text-sm text-gray-700 bg-transparent border border-transparent rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 focus:bg-blue-50/40 hover:bg-gray-50 transition-colors ${!item.visible ? "opacity-50 line-through" : ""} `}
                          />
                        </td>
                        <td className="py-2.5 border-t border-gray-50">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                              {expandedId === item.id ? "Close" : "Details"}
                            </button>

                            <button
                              onClick={() => handleToggleVisibility(item.id)}
                              className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                              {item.visible ? "Hide" : "Show"}
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                              delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === item.id && (
                        <tr>
                          <td
                            colSpan={4}
                            className="bg-gray-50 border-t border-gray-50 px-4 py-4"
                          >
                            <div className="grid grid-cols-2 gap-6">
                              {/* Variants */}
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                  Variants
                                </p>
                                {item.variants.map((v) => (
                                  <div
                                    key={v.id}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <input
                                      type="text"
                                      name="label"
                                      value={v.label}
                                      onChange={(e) =>
                                        handleVariantChange(item.id, v.id, e)
                                      }
                                      placeholder="Label (e.g. Hot)"
                                      className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 bg-white"
                                    />
                                    <input
                                      type="text"
                                      name="price"
                                      value={v.price}
                                      onChange={(e) =>
                                        handleVariantChange(item.id, v.id, e)
                                      }
                                      placeholder="0"
                                      inputMode="decimal"
                                      className="w-20 text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 bg-white"
                                    />
                                    <button
                                      onClick={() =>
                                        handleDeleteVariant(item.id, v.id)
                                      }
                                      className="text-xs text-gray-400 hover:text-gray-600 px-2"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => handleAddVariant(item.id)}
                                  className="text-xs font-medium text-blue-600 hover:underline"
                                >
                                  + Add variant
                                </button>
                              </div>

                              {/* Add-ons */}
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                  Add-ons
                                </p>
                                {item.addons.map((a) => (
                                  <div
                                    key={a.id}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <input
                                      type="text"
                                      name="name"
                                      value={a.name}
                                      onChange={(e) =>
                                        handleAddonChange(item.id, a.id, e)
                                      }
                                      placeholder="Name (e.g. Vanilla)"
                                      className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 bg-white"
                                    />
                                    <input
                                      type="text"
                                      name="price"
                                      value={a.price}
                                      onChange={(e) =>
                                        handleAddonChange(item.id, a.id, e)
                                      }
                                      placeholder="0"
                                      inputMode="decimal"
                                      className="w-20 text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 bg-white"
                                    />
                                    <button
                                      onClick={() =>
                                        handleDeleteAddon(item.id, a.id)
                                      }
                                      className="text-xs text-gray-400 hover:text-gray-600 px-2"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => handleAddAddon(item.id)}
                                  className="text-xs font-medium text-blue-600 hover:underline"
                                >
                                  + Add add-on
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        );
      })}

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
