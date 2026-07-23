import React, { useEffect } from "react";
import { X, Trash, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useRef } from "react";
function CategoryTable({
  category,
  menuItems,
  errors,
  expandedItemId,
  setExpandedItemId,
  handleCategoryChange,
  deleteCategory,
  addItem,
  handleImageChange,
  handleChange,
  deleteItem,
  addVariant,
  handleVariantChange,
  deleteVariant,
  globalAddons,
  linkAddonToItem,
  unlinkAddonFromItem,
  setErrors,
}) {
  const newCatRef = useRef(null);
  const categoryItems = menuItems.filter(
    (item) => item.category_id === category.category_id,
  );

  useEffect(() => {
    if (category.category === "New Category" && newCatRef.current) {
      newCatRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const scrollToItem = (el, item) => {
    const isNewItem = item.item_name === "" || item.item_name.trim() === "";

    if (el && isNewItem && !el.dataset.scrolled) {
      el.dataset.scrolled = true;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = el.querySelector("input[type='text']");
      if (input) input.focus();
    }
  };

  return (
    <div
      ref={newCatRef}
      className="category  w-250 p-5 mt-5 rounded-2xl bg-[#18110C] border border-[#B8874F]/30 shadow-md"
    >
      <div className="top flex justify-between items-center mb-4 gap-4 pb-4 border-b border-[#B8874F]/25">
        <input
          type="text"
          value={category.category}
          placeholder="Category name"
          className={`font-serif font-bold text-lg focus:outline-none bg-transparent py-1 px-2 flex-1 max-w-xs rounded-md transition-colors ${
            errors[`cat-${category.category_id}`]
              ? "text-red-400 border border-red-500 bg-red-950/20"
              : "text-[#EFE6DA] focus:bg-white/3"
          }`}
          onChange={(e) => {
            handleCategoryChange(category.category_id, e.target.value);
            setErrors((prev) => ({
              ...prev,
              [`cat-${category.category_id}`]: false,
            }));
          }}
        />
        <div className="flex gap-3 items-center">
          <button
            type="button"
            className="bg-[#B8874F] hover:bg-[#CE9A5E] text-[#12100D] px-6 py-2.5 rounded-xl text-sm font-semibold tracking-wide capitalize shadow-sm transition-colors cursor-pointer"
            onClick={() => addItem(category.category_id)}
          >
            Add Item
          </button>
          <button
            type="button"
            className="bg-transparent border border-[#B8874F]/40 hover:bg-[#B8874F]/10 text-[#B8874F] px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide capitalize cursor-pointer transition-colors flex items-center justify-center"
            onClick={() => deleteCategory(category.category_id)}
          >
            Delete Category
          </button>
        </div>
      </div>

      <table className="w-full table-fixed">
        <thead>
          <tr className="text-start border-b border-[#B8874F]/25">
            <th className="w-20 text-start pb-2 font-serif font-medium text-sm text-[#B8874F]/75 capitalize">
              Image
            </th>
            <th className="text-start pb-2 font-serif font-medium text-sm text-[#B8874F]/75 capitalize">
              Name
            </th>
            <th className="text-start pb-2 pr-4 font-serif font-medium text-sm text-[#B8874F]/75 capitalize">
              Price
            </th>
            <th className="text-end pb-2 pr-12 font-serif font-medium text-sm text-[#B8874F]/75 capitalize">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categoryItems.map((item) => {
            const isExpanded = expandedItemId === item.item_id;
            return (
              <React.Fragment key={item.item_id}>
                <tr
                  ref={(el) => scrollToItem(el, item)}
                  className="hover:bg-[#B8874F]/6 transition-colors"
                >
                  <td className="py-3 border-t border-[#B8874F]/15">
                    <label
                      className={`w-10 h-10 rounded-lg bg-[#1C1410] border border-dashed flex items-center justify-center text-[#B8874F]/60 text-[10px] cursor-pointer hover:bg-[#B8874F]/10 transition-colors overflow-hidden ${
                        errors[`item-image-${item.item_id}`]
                          ? "border-red-500 bg-red-950/30"
                          : "border-[#B8874F]/30 hover:border-[#B8874F]/60"
                      } ${!item.is_available ? "opacity-40 line-through" : ""}`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(item, e)}
                      />
                      {item.preview_url || item.image_path ? (
                        <img
                          src={
                            item.preview_url ||
                            supabase.storage
                              .from("menu-images")
                              .getPublicUrl(item.image_path).data.publicUrl
                          }
                          alt="img"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "img"
                      )}
                    </label>
                  </td>

                  {/* Item Name */}
                  <td className="py-3 border-t border-[#B8874F]/15">
                    <input
                      type="text"
                      placeholder="Name"
                      className={`bg-transparent text-[#EFE6DA] border-b border-b-[#B8874F] focus:outline-none py-1 px-1 text-sm w-[90%] rounded transition-colors ${
                        errors[`item-name-${item.item_id}`]
                          ? "border-red-500 bg-red-950/20"
                          : "border-transparent focus:border-[#B8874F]"
                      } ${!item.is_available ? "opacity-40 line-through text-[#8C7A6B]" : ""}`}
                      value={item.item_name}
                      onChange={(e) => {
                        handleChange(item.item_id, "item_name", e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          [`item-name-${item.item_id}`]: false,
                        }));
                      }}
                    />
                  </td>

                  {/* Item Price */}
                  <td className="py-3 border-t border-[#B8874F]/15 text-start pr-4">
                    <input
                      type="text"
                      placeholder="Price"
                      value={item.base_price}
                      className={`bg-transparent text-[#EFE6DA] border-b border-b-[#B8874F] focus:outline-none py-1 px-1 text-sm font-medium w-[90%] rounded transition-colors ${
                        errors[`item-price-${item.item_id}`]
                          ? "border-red-500 bg-red-950/20 text-red-300"
                          : "border-transparent focus:border-[#B8874F]"
                      } ${!item.is_available ? "opacity-40 line-through text-[#8C7A6B]" : ""}`}
                      onChange={(e) => {
                        handleChange(
                          item.item_id,
                          "base_price",
                          e.target.value,
                        );
                        setErrors((prev) => ({
                          ...prev,
                          [`item-price-${item.item_id}`]: false,
                        }));
                      }}
                    />
                  </td>

                  {/* Actions */}
                  <td className="text-end py-3 border-t border-[#B8874F]/15 pr-2">
                    <button
                      type="button"
                      className="border border-[#B8874F]/30 text-[#B8874F] hover:bg-[#B8874F]/10 hover:border-[#B8874F]/60 p-2.5 mx-1 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedItemId(isExpanded ? null : item.item_id)
                      }
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} strokeWidth={1.5} />
                      ) : (
                        <ChevronDown size={16} strokeWidth={1.5} />
                      )}
                    </button>
                    <button
                      type="button"
                      className="border border-[#B8874F]/30 text-[#B8874F] hover:bg-[#B8874F]/10 hover:border-[#B8874F]/60 p-2.5 mx-1 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      onClick={() =>
                        handleChange(
                          item.item_id,
                          "is_available",
                          !item.is_available,
                        )
                      }
                    >
                      {item.is_available ? (
                        <Eye size={16} strokeWidth={1.5} />
                      ) : (
                        <EyeOff size={16} strokeWidth={1.5} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.item_id, item.image_path)}
                      className="border border-[#B8874F]/15 text-[#8C7A6B] hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/20 p-2.5 mx-1 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>

                {/* Expanded Row for Variants & Addons */}
                {isExpanded && (
                  <tr>
                    <td
                      colSpan="4"
                      className="bg-[#0F0B08] p-5 border-t border-[#B8874F]/25 rounded-xl"
                    >
                      <div className="flex gap-8 text-[#EFE6DA]">
                        {/* Variants Column */}
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-serif font-bold text-sm text-[#B8874F]">
                              Variants
                            </h4>
                            <button
                              type="button"
                              className="text-xs bg-[#B8874F] text-[#12100D] font-semibold px-2.5 py-1 rounded hover:bg-[#CE9A5E] transition-colors"
                              onClick={() => addVariant(item.item_id)}
                            >
                              + Add Variant
                            </button>
                          </div>
                          {item.variants && item.variants.length > 0 ? (
                            item.variants.map((v) => (
                              <div key={v.id} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  placeholder="Label"
                                  className={`bg-[#1C1410] text-[#EFE6DA] placeholder-[#8C7A6B] p-2 rounded text-xs w-1/2 border focus:outline-none transition-colors ${
                                    errors[`variant-label-${v.id}`]
                                      ? "border-red-500 bg-red-950/30"
                                      : "border-[#B8874F]/25 focus:border-[#B8874F]"
                                  }`}
                                  value={v.label}
                                  onChange={(e) => {
                                    handleVariantChange(
                                      item.item_id,
                                      v.id,
                                      "label",
                                      e.target.value,
                                    );
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`variant-label-${v.id}`]: false,
                                    }));
                                  }}
                                />
                                <input
                                  type="text"
                                  placeholder="Price"
                                  className={`bg-[#1C1410] text-[#EFE6DA] placeholder-[#8C7A6B] p-2 rounded text-xs w-1/2 border focus:outline-none transition-colors ${
                                    errors[`variant-price-${v.id}`]
                                      ? "border-red-500 bg-red-950/30 text-red-300"
                                      : "border-[#B8874F]/25 focus:border-[#B8874F]"
                                  }`}
                                  value={v.price}
                                  onChange={(e) => {
                                    handleVariantChange(
                                      item.item_id,
                                      v.id,
                                      "price",
                                      e.target.value,
                                    );
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`variant-price-${v.id}`]: false,
                                    }));
                                  }}
                                />
                                <button
                                  type="button"
                                  className="p-2 text-[#8C7A6B] hover:text-red-400 border border-[#B8874F]/25 hover:border-red-900/50 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                                  onClick={() =>
                                    deleteVariant(item.item_id, v.id)
                                  }
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-[#8C7A6B] italic mt-2">
                              No variants set for this item.
                            </p>
                          )}
                        </div>

                        {/* Addons Column */}
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-serif font-bold text-sm text-[#B8874F]">
                              Linked Addons
                            </h4>

                            {/* Master Addons Dropdown Selector */}
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  linkAddonToItem(item.item_id, e.target.value);
                                }
                              }}
                              className="bg-[#1C1410] text-[#EFE6DA] border border-[#B8874F]/30 rounded-lg text-xs py-1 px-2 focus:outline-none focus:border-[#B8874F] transition-colors cursor-pointer"
                            >
                              <option value="" disabled>
                                + Add existing addon...
                              </option>
                              {globalAddons
                                // Exclude add-ons already linked to this item
                                ?.filter(
                                  (gAddon) =>
                                    !item.addons?.some(
                                      (a) => a.id === gAddon.id,
                                    ),
                                )
                                .map((gAddon) => (
                                  <option key={gAddon.id} value={gAddon.id}>
                                    {gAddon.name} ({gAddon.price})
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* Currently Linked Addons Display */}
                          {item.addons && item.addons.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {item.addons.map((addon) => (
                                <div
                                  key={addon.id}
                                  className="flex items-center gap-2 bg-[#1C1410] border border-[#B8874F]/30 text-[#EFE6DA] px-3 py-1.5 rounded-xl text-xs shadow-sm"
                                >
                                  <span className="font-medium">
                                    {addon.name}
                                  </span>
                                  <span className="text-[#B8874F]/80 text-[11px]">
                                    ({addon.price})
                                  </span>
                                  <button
                                    type="button"
                                    className="text-[#8C7A6B] hover:text-red-400 ml-1 transition-colors cursor-pointer"
                                    onClick={() =>
                                      unlinkAddonFromItem(
                                        item.item_id,
                                        addon.id,
                                      )
                                    }
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-[#8C7A6B] italic mt-2">
                              No addons linked to this item. Select one from the
                              dropdown above.
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(CategoryTable);
