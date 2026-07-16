import React, { useState } from "react";
import {
  makeNewCategory,
  makeNewItem,
  makeNewVariant,
  makeNewAddon,
} from "../utils/menuDiff";

// Controlled component: all state (categories, items, addons) lives in the
// parent (AdminDashboard) so it can be diffed against the original snapshot.
function CataegoryTable({
  categories,
  setCategories,
  items,
  setItems,
  addons,
  setAddons,
}) {
  const [expandedId, setExpandedId] = useState(null);

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleAddCategory() {
    setCategories((prev) => [...prev, makeNewCategory()]);
  }

  function handleDeleteCategory(id) {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setItems((prev) => prev.filter((item) => item.categoryId !== id));
  }

  function handleAddItem(categoryId) {
    setItems((prev) => [...prev, makeNewItem(categoryId)]);
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

  // ---- variants (still per-item, unchanged from before) --------------------

  function handleAddVariant(itemId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, variants: [...item.variants, makeNewVariant()] }
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

  // ---- addons (now global — items only hold addonIds) -----------------------

  // Creates a brand new global addon AND links it to this item.
  function handleCreateAndAttachAddon(itemId) {
    const newAddon = makeNewAddon();
    setAddons((prev) => [...prev, newAddon]);
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, addonIds: [...item.addonIds, newAddon.id] }
          : item,
      ),
    );
  }

  // Links an existing global addon to this item (no new addon created).
  function handleAttachExistingAddon(itemId, addonId) {
    if (!addonId) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId && !item.addonIds.includes(addonId)
          ? { ...item, addonIds: [...item.addonIds, addonId] }
          : item,
      ),
    );
  }

  // Removes the link between this item and the addon — does NOT delete the
  // global addon, since other items may still use it.
  function handleUnlinkAddon(itemId, addonId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, addonIds: item.addonIds.filter((id) => id !== addonId) }
          : item,
      ),
    );
  }

  // Editing name/price here edits the SHARED addon record — every item
  // linking to this addon will see the update.
  function handleAddonFieldChange(addonId, e) {
    const { name, value } = e.target;
    setAddons((prev) =>
      prev.map((a) => (a.id === addonId ? { ...a, [name]: value } : a)),
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
      {categories.map((c) => {
        const categoryItems = items.filter((item) => item.categoryId === c.id);
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
              <button
                onClick={() => handleDeleteCategory(c.id)}
                className="text-xs font-medium text-gray-400 hover:text-red-500 px-2"
                title="Delete category"
              >
                ✕
              </button>
            </div>

            <table className="w-full table-fixed border-separate border-spacing-0">
              <thead>
                <tr className="text-start">
                  <th className="w-14 pb-2 text-xs font-medium text-gray-400"></th>
                  <th className="pb-2 text-xs font-medium text-gray-400 text-left">
                    Item
                  </th>
                  <th className="pb-2 text-xs font-medium text-gray-400 text-left">
                    Price
                  </th>
                  <th className="pb-2 text-xs font-medium text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td className="py-2.5 border-t border-gray-50 pr-3">
                        <label className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 cursor-pointer overflow-hidden">
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

                            {/* Add-ons — global, item only links */}
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                Add-ons{" "}
                                <span className="normal-case font-normal text-gray-400">
                                  (shared across items)
                                </span>
                              </p>
                              {item.addonIds.map((addonId) => {
                                const a = addons.find((x) => x.id === addonId);
                                if (!a) return null;
                                return (
                                  <div
                                    key={a.id}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <input
                                      type="text"
                                      name="name"
                                      value={a.name}
                                      onChange={(e) =>
                                        handleAddonFieldChange(a.id, e)
                                      }
                                      placeholder="Name (e.g. Vanilla)"
                                      className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 bg-white"
                                    />
                                    <input
                                      type="text"
                                      name="price"
                                      value={a.price}
                                      onChange={(e) =>
                                        handleAddonFieldChange(a.id, e)
                                      }
                                      placeholder="0"
                                      inputMode="decimal"
                                      className="w-20 text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-200 bg-white"
                                    />
                                    <button
                                      onClick={() =>
                                        handleUnlinkAddon(item.id, a.id)
                                      }
                                      className="text-xs text-gray-400 hover:text-gray-600 px-2"
                                      title="Remove from this item (keeps the add-on for others)"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}
                              <div className="flex items-center gap-3 mt-2">
                                <button
                                  onClick={() =>
                                    handleCreateAndAttachAddon(item.id)
                                  }
                                  className="text-xs font-medium text-blue-600 hover:underline"
                                >
                                  + New add-on
                                </button>
                                {addons.length > 0 && (
                                  <select
                                    value=""
                                    onChange={(e) =>
                                      handleAttachExistingAddon(
                                        item.id,
                                        e.target.value,
                                      )
                                    }
                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600"
                                  >
                                    <option value="">Attach existing…</option>
                                    {addons
                                      .filter(
                                        (a) => !item.addonIds.includes(a.id),
                                      )
                                      .map((a) => (
                                        <option key={a.id} value={a.id}>
                                          {a.name || "(unnamed)"}
                                        </option>
                                      ))}
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
