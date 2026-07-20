import { RotateCcw, Save } from "lucide-react";

import React, { useEffect, useState } from "react";
import { Trash, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";

import { createClient } from "@supabase/supabase-js";

const URL = "http://10.106.0.20:8000";
const KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";

const supabase = createClient(URL, KEY);
async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "test@example.com",
    password: "123456789",
  });
  if (error) {
    console.log("error");
    throw error;
  }
}
await login();

let fetcheddata = [];
function editMenu(payload) {}

// console.log(category);

function CategoryTable() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedItemId, setExpandedItemId] = useState(null);

  //trackingchanges tosendto backend
  const [pendingChanges, setPendingChanges] = useState({
    categories: [],
    menu_items: [],
    item_variants: [],
    addons: [],
    item_addons: [],
  });

  const fetchMenuData = async function getMenuView() {
    let { data, error } = await supabase.from("menu_view").select("*");
    fetcheddata = data;
    if (error) throw error;
    console.log(data);

    const categories = [
      ...new Map(
        data.map((item) => [
          item.category_id,
          {
            category_id: item.category_id,
            category: item.category,
          },
        ]),
      ).values(),
    ];
    const items = data
      .filter((i) => i?.item_id != null)
      .map((item) => {
        const { category, ...rest } = item;

        return rest;
      });
    setCategories(categories);
    setMenuItems(items);
  };

  //fetching and seperating categories and items
  useEffect(() => {
    fetchMenuData();
  }, []);

  console.log("menuitems ui ko:", menuItems);

  //handling onchange
  // Track item changes on-the-fly
  const handleChange = (itemId, field, value) => {
    // A. Update UI State
    setMenuItems((prev) =>
      prev.map((item) =>
        item.item_id === itemId ? { ...item, [field]: value } : item,
      ),
    );

    // B. Record Change
    setPendingChanges((prev) => {
      const updatedItems = [...prev.menu_items];
      const existingChangeIdx = updatedItems.findIndex((i) => i.id === itemId);

      const targetItemInUI = menuItems.find((i) => i.item_id === itemId);
      const isNewItem = !fetcheddata.some((orig) => orig.item_id === itemId);

      // // Cast base_price to Number if that's the field changing
      // const finalValue = field === "base_price" ? Number(value) : value;

      if (existingChangeIdx > -1) {
        // Update existing tracked change
        updatedItems[existingChangeIdx] = {
          ...updatedItems[existingChangeIdx],
          [field === "item_name" ? "name" : field]: value,
        };
      } else {
        // First change on a pre-existing DB item, log an 'update' action
        updatedItems.push({
          action: "update",
          id: itemId,
          [field === "item_name" ? "name" : field]: value,
        });
      }

      return { ...prev, menu_items: updatedItems };
    });
  };
  const additem = (cid) => {
    const newItemId = crypto.randomUUID();
    const newItem = {
      category_id: cid,
      item_id: newItemId,
      item_name: "",
      description: null,
      image_path: null,
      base_price: "",
      is_available: true,
      variants: [],
      addons: [],
    };

    // Update UI
    setMenuItems((prev) => [...prev, newItem]);

    // Track 'insert'
    setPendingChanges((prev) => ({
      ...prev,
      menu_items: [
        ...prev.menu_items,
        {
          action: "insert",
          id: newItemId,
          category_id: cid,
          name: "",
          description: null,
          image_path: null,
          base_price: 0,
        },
      ],
    }));
  };
  // deletions items
  const deleteItem = async (itemId, imagepath) => {
    // Update UI
    setMenuItems((prev) => prev.filter((item) => item.item_id !== itemId));

    const { data, error } = await supabase.storage
      .from("menu-images")
      .remove([imagepath]);
    // Track 'delete'
    setPendingChanges((prev) => {
      const isNewItem = !fetcheddata.some((orig) => orig.item_id === itemId);

      // Filter out any unsaved inserts/updates from our tracking queue
      let updatedItems = prev.menu_items.filter((i) => i.id !== itemId);

      // Only tell backend to 'delete' if it actually existed in the database
      if (!isNewItem) {
        updatedItems.push({
          action: "delete",
          id: itemId,
        });
      }

      return { ...prev, menu_items: updatedItems };
    });
  };

  //handling categoory change
  const handleCategoryChange = (categoryId, value) => {
    // A. Update UI State
    setCategories((prev) =>
      prev.map((cat) =>
        cat.category_id === categoryId ? { ...cat, category: value } : cat,
      ),
    );
    // B. Record Change
    setPendingChanges((prev) => {
      const updatedCategories = [...prev.categories];
      const existingChangeIdx = updatedCategories.findIndex(
        (c) => c.id === categoryId,
      );

      if (existingChangeIdx > -1) {
        // If it's already being tracked (as insert or update), update its name
        updatedCategories[existingChangeIdx] = {
          ...updatedCategories[existingChangeIdx],
          name: value,
        };
      } else {
        // If it's a pre-existing category, log an 'update' action
        updatedCategories.push({
          action: "update",
          id: categoryId,
          name: value,
        });
      }

      return { ...prev, categories: updatedCategories };
    });
  };
  const addCategory = () => {
    const newCatId = crypto.randomUUID();
    const newCategory = {
      category_id: newCatId,
      category: "New Category",
    };
    // Update UI
    setCategories((prev) => [...prev, newCategory]);
    // Track 'insert'
    setPendingChanges((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          action: "insert",
          id: newCatId,
          name: "New Category",
        },
      ],
    }));
  };
  const deleteCategory = (categoryId) => {
    //ui ma filter garera remove
    setCategories((prev) =>
      prev.filter((cat) => cat.category_id !== categoryId),
    );
    setMenuItems((prev) =>
      prev.filter((item) => item.category_id !== categoryId),
    );

    setPendingChanges((prev) => {
      //naya category jun chai backend masave vako xaina ho ki hoina checking
      const isNewCategory = !fetcheddata.some(
        (orig) => orig.category_id === categoryId,
      );

      // unsaved update,insert xa vane clean it
      let updatedCategories = prev.categories.filter(
        (c) => c.id !== categoryId,
      );

      //if in db,send it in pending changes
      if (!isNewCategory) {
        updatedCategories.push({
          action: "delete",
          id: categoryId,
        });
      }

      return { ...prev, categories: updatedCategories };
    });
  };

  //image change
  async function handleImageChange(imgitm, e) {
    console.log(imgitm);
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;

    const { imgdata, imgerror } = await supabase.storage
      .from("menu-images")
      .remove([imgitm.image_path]);

    // A. UPDATE THE UI STATE (Ensuring the specific item receives the new file)
    setMenuItems((prev) =>
      prev.map((item) =>
        item.item_id === imgitm.item_id
          ? { ...item, image_path: file.name }
          : item,
      ),
    );

    const { data, error } = await supabase.storage
      .from("menu-images")
      .upload(file.name, file, {
        cacheControl: "3600",
        upsert: true,
      });

    // B. TRACK THE PENDING CHANGES
    setPendingChanges((prev) => {
      const updatedItems = [...prev.menu_items];
      const existingChangeIdx = updatedItems.findIndex(
        (i) => i.id === imgitm.item_id,
      );

      if (existingChangeIdx > -1) {
        // If the item is already tracked, update it
        updatedItems[existingChangeIdx] = {
          ...updatedItems[existingChangeIdx],
          image_path: file.name, // Storing the raw file object directly
        };
      } else {
        // First edit on a pre-existing database item
        updatedItems.push({
          action: "update",
          id: imgitm.item_id,
          image_path: file.name, // Storing the raw file object directly
        });
      }

      return { ...prev, menu_items: updatedItems };
    });
  }

  //variant change
  const handleVariantChange = (itemId, variantId, field, value) => {
    // A. Update UI state (Nested inside menuItems)
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.item_id !== itemId) return item;
        return {
          ...item,
          variants: item.variants.map((v) =>
            v.id === variantId ? { ...v, [field]: value } : v,
          ),
        };
      }),
    );

    // B. Update Tracking Log
    setPendingChanges((prev) => {
      const updatedVariants = [...prev.item_variants];
      const existingChangeIdx = updatedVariants.findIndex(
        (v) => v.id === variantId,
      );

      const finalValue = field === "price" ? Number(value) : value;

      // BETTER WAY: Check if the variant existed in the original fetched data
      const isNewVariant = !fetcheddata.some((origItem) =>
        origItem.variants?.some((origVar) => origVar.id === variantId),
      );

      if (existingChangeIdx > -1) {
        updatedVariants[existingChangeIdx] = {
          ...updatedVariants[existingChangeIdx],
          [field]: finalValue,
        };
      } else {
        updatedVariants.push({
          action: isNewVariant ? "insert" : "update",
          id: variantId,
          ...(isNewVariant ? { item_id: itemId } : {}),
        });
      }

      return { ...prev, item_variants: updatedVariants };
    });
  };
  //add variant
  const addVariant = (itemId) => {
    const newVarId = crypto.randomUUID();
    const newVariant = { id: newVarId, label: "", price: "" };

    // Update UI State
    setMenuItems((prev) =>
      prev.map((item) =>
        item.item_id === itemId
          ? { ...item, variants: [...item.variants, newVariant] }
          : item,
      ),
    );

    // Track 'insert' log configuration
    setPendingChanges((prev) => ({
      ...prev,
      item_variants: [
        ...prev.item_variants,
        {
          action: "insert",
          id: newVarId,
          item_id: itemId,
          label: "",
          price: 0,
          is_default: false,
        },
      ],
    }));
  };
  //delete variant
  const deleteVariant = (itemId, variantId) => {
    //  Update UI State
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.item_id !== itemId) return item;
        return {
          ...item,
          variants: item.variants.filter((v) => v.id !== variantId),
        };
      }),
    );

    // B. Update Tracking Log (Push 'delete' to item_variants)
    setPendingChanges((prev) => {
      // Check if the variant existed in the original fetched data
      const isNewVariant = !fetcheddata.some((origItem) =>
        origItem.variants?.some((origVar) => origVar.id === variantId),
      );

      // Clean up any pending unsaved logs (inserts/updates) for this specific variant
      let updatedVariants = prev.item_variants.filter(
        (v) => v.id !== variantId,
      );

      // Only queue a delete action if it actually exists in the database
      if (!isNewVariant) {
        updatedVariants.push({
          action: "delete",
          id: variantId,
        });
      }

      return { ...prev, item_variants: updatedVariants };
    });
  };
  //adddon change
  // A. HANDLE ADDON CHANGE
  const handleAddonChange = (itemId, addonId, field, value) => {
    // Update UI (Matches your data structure)
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.item_id !== itemId) return item;
        return {
          ...item,
          addons: item.addons.map((a) =>
            a.id === addonId ? { ...a, [field]: value } : a,
          ),
        };
      }),
    );

    // Track in global pending changes
    setPendingChanges((prev) => {
      const updatedAddons = [...prev.addons];
      const existingIdx = updatedAddons.findIndex((a) => a.id === addonId);

      const finalValue = field === "price" ? Number(value) : value;
      const isNewAddon = !fetcheddata.some((origItem) =>
        origItem.addons?.some((origAddon) => origAddon.id === addonId),
      );

      if (existingIdx > -1) {
        updatedAddons[existingIdx] = {
          ...updatedAddons[existingIdx],
          [field]: finalValue,
        };
      } else {
        updatedAddons.push({
          action: isNewAddon ? "insert" : "update",
          id: addonId,
          [field]: finalValue,
        });
      }

      return { ...prev, addons: updatedAddons };
    });
  };

  // B. ADD ADDON TO ITEM
  const addAddonToItem = (itemId) => {
    const newAddonId = crypto.randomUUID();
    const newItemAddonId = crypto.randomUUID();

    // Consistent with database schema using .id
    const newAddonObj = { id: newAddonId, name: "", price: "" };

    setMenuItems((prev) =>
      prev.map((item) =>
        item.item_id === itemId
          ? { ...item, addons: [...item.addons, newAddonObj] }
          : item,
      ),
    );

    setPendingChanges((prev) => ({
      ...prev,
      addons: [
        ...prev.addons,
        {
          action: "insert",
          id: newAddonId,
          name: "",
          price: 0,
        },
      ],
      item_addons: [
        ...prev.item_addons,
        {
          action: "insert",
          id: newItemAddonId,
          item_id: itemId,
          addon_id: newAddonId,
        },
      ],
    }));
  };

  // C. DELETE ADDON
  const deleteAddon = (itemId, addonId) => {
    // Update UI State
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.item_id !== itemId) return item;
        return {
          ...item,
          addons: item.addons.filter((a) => a.id !== addonId),
        };
      }),
    );

    // Update Tracking Log
    setPendingChanges((prev) => {
      const isNewAddon = !fetcheddata.some((origItem) =>
        origItem.addons?.some((origAddon) => origAddon.id === addonId),
      );

      let updatedAddons = prev.addons.filter((a) => a.id !== addonId);
      let updatedItemAddons = prev.item_addons.filter(
        (ia) => ia.addon_id !== addonId,
      );

      if (!isNewAddon) {
        updatedAddons.push({
          action: "delete",
          id: addonId,
        });
      }

      return {
        ...prev,
        addons: updatedAddons,
        item_addons: updatedItemAddons,
      };
    });
  };

  //backend lai pathunedata:
  const handleSave = async () => {
    const payload = {
      categories: pendingChanges.categories,
      menu_items: pendingChanges.menu_items,
      item_variants: pendingChanges.item_variants,
      addons: pendingChanges.addons,
      item_addons: pendingChanges.item_addons,
    };

    try {
      // 1. Try to authenticate

      // 2. If login succeeds, proceed to save
      let { data, error } = await supabase.rpc("save_menu_batch", {
        payload: payload,
      });

      if (error) {
        const errbody = await error.context.json();
        console.log(errbody);
        return;
        // throw error;
      }

      // 3. Clear pending changes on success
      setPendingChanges({
        categories: [],
        menu_items: [],
        item_variants: [],
        addons: [],
        item_addons: [],
      });

      await fetchMenuData();
      alert("Changes published successfully!");
    } catch (err) {
      // 4. Catch both login failures and database failures here
      console.error("Failed to save:", err);
      alert(
        `Error: ${err.message || "Authentication failed. Check your password."}`,
      );
    }
  };

  // const handleSave = async () => {
  //   const payload = {
  //     categories: pendingChanges.categories,
  //     menu_items: pendingChanges.menu_items,
  //     item_variants: pendingChanges.item_variants,
  //     addons: pendingChanges.addons,
  //     item_addons: pendingChanges.item_addons,
  //   };
  //   await login();
  //   let { data, error } = await supabase.rpc("save_menu_batch", {
  //     payload: payload,
  //   });
  //   if (error){
  //     console.log("error");
  //     throw error;
  //   }

  //   setPendingChanges({
  //     categories: [],
  //     menu_items: [],
  //     item_variants: [],
  //     addons: [],
  //     item_addons: [],
  //   });

  //   fetchMenuData();
  //   console.log("Payload ready to send directly:", payload);
  // };

  const handleRevert = async () => {
    const { data, error } = await supabase.rpc("restore_from_backup");
    fetchMenuData();
  };

  console.log("pending item changes", pendingChanges.menu_items);
  console.log("pending category changes", pendingChanges.categories);
  console.log("pending variants changes", pendingChanges.item_variants);
  console.log("main addons changes", pendingChanges.addons);
  console.log("new addons changes:", pendingChanges.item_addons);

  return (
    <section
      className="admin-dash flex justify-center w-full min-h-screen font-sans antialiased text-[#EFE6DA]"
      style={{
        background:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 2px, transparent 2px, transparent 6px), #120D09",
      }}
    >
      <div className="w-full max-w-5xl">
        <div className="w-full p-5">
          <div className="menu-header bg-[#18110C]/90 backdrop-blur-xl rounded-lg p-6 flex justify-between items-center flex-wrap gap-4 border border-[#B8874F]/30 shadow-[0_8px_32px_0_rgba(8,5,3,0.5)]">
            <div>
              <h1 className="font-serif font-bold text-2xl capitalize text-[#EFE6DA] tracking-wide">
                Menu Dashboard
              </h1>
              <p className="text-xs font-medium text-[#B8874F]/75 mt-1 tracking-wider uppercase">
                Last published 2 hours ago
              </p>
            </div>

            <div className="m-h-btns flex gap-3">
              <button
                onClick={handleRevert}
                className="flex items-center cursor-pointer gap-2 border border-[#B8874F]/30 bg-white/[0.02] px-4 py-2 rounded-md text-sm font-medium text-[#EFE6DA] hover:bg-[#B8874F]/10 transition-colors"
              >
                <RotateCcw size={16} />
                Revert
              </button>

              <button
                onClick={handleSave}
                className="flex items-center cursor-pointer gap-2 bg-[#B8874F] hover:bg-[#CE9A5E] px-5 py-2 rounded-md text-sm font-bold text-[#12100D] shadow-md transition-colors tracking-wide uppercase"
              >
                <Save size={16} />
                Publish changes
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl p-5 flex flex-col gap-6">
          <div>
            {categories.map((c) => {
              return (
                <div
                  key={c.category_id}
                  className="category w-250 p-5 mt-5 rounded-2xl bg-[#18110C] border border-[#B8874F]/30 shadow-md"
                >
                  <div className="top flex justify-between items-center mb-4 gap-4 pb-4 border-b border-[#B8874F]/25">
                    <input
                      type="text"
                      name=""
                      id=""
                      value={c.category}
                      placeholder="category"
                      className="font-serif font-bold text-lg text-[#EFE6DA] focus:outline-none bg-transparent py-1 px-2 flex-1 max-w-xs rounded-md focus:bg-white/[0.03] transition-colors"
                      onChange={(e) =>
                        handleCategoryChange(c.category_id, e.target.value)
                      }
                    />
                    <div className="flex gap-3 items-center">
                      <div
                        className="bg-[#B8874F] hover:bg-[#CE9A5E] text-[#12100D] px-6 py-2.5 rounded-xl text-sm font-semibold tracking-wide capitalize shadow-sm transition-colors cursor-pointer"
                        onClick={() => {
                          additem(c.category_id);
                        }}
                      >
                        add item
                      </div>
                      <button
                        type="button"
                        className="bg-transparent border border-[#B8874F]/40 hover:bg-[#B8874F]/10 text-[#B8874F] px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide capitalize cursor-pointer transition-colors flex items-center justify-center"
                        onClick={() => deleteCategory(c.category_id)}
                      >
                        Delete Category
                      </button>
                    </div>
                  </div>
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="text-start border-b border-[#B8874F]/25">
                        <th className="w-20 text-start pb-2 font-serif font-medium text-sm text-[#B8874F]/75 capitalize">
                          image
                        </th>
                        <th className="text-start pb-2 font-serif font-medium text-sm text-[#B8874F]/75 capitalize">
                          name
                        </th>
                        <th className=" text-start pb-2 pr-4 font-serif font-medium text-sm text-[#B8874F]/75 capitalize">
                          price
                        </th>
                        <th className=" text-end pb-2 pr-12 font-serif font-medium text-sm text-[#B8874F]/75 capitalize">
                          actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems
                        .filter((f) => f.category_id === c.category_id)
                        .map((item) => {
                          const isExpanded = expandedItemId === item.item_id;
                          return (
                            <React.Fragment key={item.item_id}>
                              <tr
                                key={item.item_id}
                                className="hover:bg-[#B8874F]/[0.06] transition-colors"
                              >
                                <td className="py-3 border-t border-[#B8874F]/15">
                                  <label
                                    className={`w-10 h-10 rounded-lg bg-[#1C1410] border border-dashed border-[#B8874F]/30 flex items-center justify-center text-[#B8874F]/60 text-[10px] cursor-pointer hover:bg-[#B8874F]/10 hover:border-[#B8874F]/60 transition-colors overflow-hidden ${!item.is_available ? "opacity-40 line-through" : ""}`}
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) =>
                                        handleImageChange(item, e)
                                      }
                                    />
                                    {item.image_path ? (
                                      <img
                                        src={
                                          supabase.storage
                                            .from("menu-images")
                                            .getPublicUrl(item.image_path).data
                                            .publicUrl
                                        }
                                        alt="img"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      "img"
                                    )}
                                  </label>
                                </td>
                                <td className="py-3 border-t border-[#B8874F]/15">
                                  <input
                                    type="text"
                                    placeholder="name"
                                    className={`bg-transparent text-[#EFE6DA] border-b border-transparent focus:border-[#B8874F] focus:outline-none py-1 px-1 text-sm w-[90%] rounded ${!item.is_available ? "opacity-40 line-through text-[#8C7A6B]" : ""}`}
                                    value={item.item_name}
                                    onChange={(e) =>
                                      handleChange(
                                        item.item_id,
                                        "item_name",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </td>

                                <td className="py-3 border-t border-[#B8874F]/15 text-start pr-4">
                                  <input
                                    type="text"
                                    placeholder="price"
                                    value={item.base_price}
                                    className={`bg-transparent text-[#EFE6DA] border-b border-transparent focus:border-[#B8874F] focus:outline-none py-1 px-1 text-sm font-medium w-75%  ${!item.is_available ? "opacity-40 line-through text-[#8C7A6B]" : ""}`}
                                    onChange={(e) =>
                                      handleChange(
                                        item.item_id,
                                        "base_price",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </td>

                                <td className="text-end py-3 border-t border-[#B8874F]/15 pr-2">
                                  <button
                                    className="border border-[#B8874F]/30 text-[#B8874F] hover:bg-[#B8874F]/10 hover:border-[#B8874F]/60 p-2.5 mx-1 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                                    onClick={() =>
                                      setExpandedItemId(
                                        isExpanded ? null : item.item_id,
                                      )
                                    }
                                  >
                                    {isExpanded ? (
                                      <ChevronUp size={16} strokeWidth={1.5} />
                                    ) : (
                                      <ChevronDown
                                        size={16}
                                        strokeWidth={1.5}
                                      />
                                    )}
                                  </button>
                                  <button
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
                                    onClick={() => {
                                      deleteItem(item.item_id, item.image_path);
                                    }}
                                    className="border border-[#B8874F]/15 text-[#8C7A6B] hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/20 p-2.5 mx-1 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                                  >
                                    <Trash size={16} />
                                  </button>
                                </td>
                              </tr>

                              {isExpanded && (
                                <tr>
                                  <td
                                    colSpan="4"
                                    className="bg-[#0F0B08] p-5 border-t border-[#B8874F]/25 rounded-xl"
                                  >
                                    <div className="flex gap-8 text-[#EFE6DA]">
                                      {/* VARIANTS COLUMN */}
                                      <div className="flex-1">
                                        <div className="flex justify-between items-center mb-3">
                                          <h4 className="font-serif font-bold text-sm text-[#B8874F]">
                                            Variants
                                          </h4>
                                          <button
                                            className="text-xs bg-[#B8874F] text-[#12100D] font-semibold px-2.5 py-1 rounded hover:bg-[#CE9A5E] transition-colors"
                                            onClick={() =>
                                              addVariant(item.item_id)
                                            }
                                          >
                                            + Add Variant
                                          </button>
                                        </div>
                                        {item.variants.map((v) => (
                                          <div
                                            key={v.id}
                                            className="flex gap-2 mb-2"
                                          >
                                            <input
                                              type="text"
                                              placeholder="Label (e.g., Large)"
                                              className="bg-[#1C1410] text-[#EFE6DA] placeholder-[#8C7A6B] p-2 rounded text-xs w-1/2 border border-[#B8874F]/25 focus:outline-none focus:border-[#B8874F]"
                                              value={v.label}
                                              onChange={(e) =>
                                                handleVariantChange(
                                                  item.item_id,
                                                  v.id,
                                                  "label",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                            <input
                                              type="text"
                                              placeholder="Price"
                                              className="bg-[#1C1410] text-[#EFE6DA] placeholder-[#8C7A6B] p-2 rounded text-xs w-1/2 border border-[#B8874F]/25 focus:outline-none focus:border-[#B8874F]"
                                              value={v.price}
                                              onChange={(e) =>
                                                handleVariantChange(
                                                  item.item_id,
                                                  v.id,
                                                  "price",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                            <button
                                              type="button"
                                              className="p-2 text-[#8C7A6B] hover:text-red-400 border border-[#B8874F]/25 hover:border-red-900/50 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                                              onClick={() =>
                                                deleteVariant(
                                                  item.item_id,
                                                  v.id,
                                                  "price",
                                                )
                                              }
                                              title="Delete Variant"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"
                                                />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}
                                      </div>

                                      {/* ADDONS COLUMN */}
                                      <div className="flex-1">
                                        <div className="flex justify-between items-center mb-3">
                                          <h4 className="font-serif font-bold text-sm text-[#B8874F]">
                                            Addons
                                          </h4>
                                          <button
                                            type="button"
                                            className="text-xs bg-[#B8874F] text-[#12100D] font-semibold px-2.5 py-1 rounded hover:bg-[#CE9A5E] transition-colors"
                                            onClick={() =>
                                              addAddonToItem(item.item_id)
                                            }
                                          >
                                            + Add Addon
                                          </button>
                                        </div>

                                        {item.addons &&
                                        item.addons.length > 0 ? (
                                          item.addons.map((addon) => (
                                            <div
                                              key={addon.id}
                                              className="flex gap-2 mb-2"
                                            >
                                              <input
                                                type="text"
                                                placeholder="Name (e.g., Vanilla)"
                                                className="bg-[#1C1410] text-[#EFE6DA] placeholder-[#8C7A6B] p-2 rounded text-xs w-1/2 border border-[#B8874F]/25 focus:outline-none focus:border-[#B8874F]"
                                                value={addon.name || ""}
                                                onChange={(e) =>
                                                  handleAddonChange(
                                                    item.item_id,
                                                    addon.id,
                                                    "name",
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                              <input
                                                type="text"
                                                placeholder="Price"
                                                className="bg-[#1C1410] text-[#EFE6DA] placeholder-[#8C7A6B] p-2 rounded text-xs w-1/2 border border-[#B8874F]/25 focus:outline-none focus:border-[#B8874F]"
                                                value={addon.price || ""}
                                                onChange={(e) =>
                                                  handleAddonChange(
                                                    item.item_id,
                                                    addon.id,
                                                    "price",
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                              <button
                                                type="button"
                                                className="p-2 text-[#8C7A6B] hover:text-red-400 border border-[#B8874F]/25 hover:border-red-900/50 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                                                onClick={() =>
                                                  deleteAddon(
                                                    item.item_id,
                                                    addon.id,
                                                  )
                                                }
                                                title="Delete Addon"
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-4 w-4"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                  />
                                                </svg>
                                              </button>
                                            </div>
                                          ))
                                        ) : (
                                          <p className="text-xs text-[#8C7A6B] italic mt-2">
                                            No addons set for this item.
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
            })}

            <div className="flex gap-4 mt-6">
              <div
                className="bg-transparent border border-[#B8874F]/40 hover:bg-[#B8874F]/10 text-[#B8874F] px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide capitalize cursor-pointer transition-colors flex items-center justify-center"
                onClick={addCategory}
              >
                add category
              </div>
              {/* <button
                onClick={handleSave}
                className="bg-[#B8874F] hover:bg-[#CE9A5E] text-[#12100D] px-6 py-2.5 rounded-xl text-sm font-semibold tracking-wide capitalize shadow-sm transition-colors cursor-pointer"
              >
                save
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryTable;
