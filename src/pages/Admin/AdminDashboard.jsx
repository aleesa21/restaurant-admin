import React, { useEffect, useState } from "react";
import { X, Trash, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "../../supabaseClient";
import AdminHeader from "../../components/AdminHeader";
import CategoryTable from "../../components/CategoryTable";

let fetcheddata = [];
function editMenu(payload) {}

// console.log(category);

function AdminDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "" });

  const showAlert = (title, message) => {
    setModal({ isOpen: true, title, message });
  };

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

    const MAX_SIZE = 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      showAlert("Image Too Large", "Image file size must be less than 1MB.");
      e.target.value = "";
      return;
    }
    //clearing img-border:
    setErrors((prev) => ({ ...prev, [`item-image-${imgitm.item_id}`]: false }));

    const { imgdata, imgerror } = await supabase.storage
      .from("menu-images")
      .remove([imgitm.image_path]);

    const previewUrl = URL.createObjectURL(file);

    //  UPDATE THE UI STATE (Ensuring the specific item receives the new file)
    setMenuItems((prev) =>
      prev.map((item) =>
        item.item_id === imgitm.item_id
          ? { ...item, image_path: file.name, preview_url: previewUrl }
          : item,
      ),
    );

    const { data, error } = await supabase.storage
      .from("menu-images")
      .upload(file.name, file, {
        cacheControl: "3600",
        upsert: true,
      });

    //  TRACK THE PENDING CHANGES
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
    const hasChanges =
      pendingChanges.categories.length > 0 ||
      pendingChanges.menu_items.length > 0 ||
      pendingChanges.item_variants.length > 0 ||
      pendingChanges.addons.length > 0 ||
      pendingChanges.item_addons.length > 0;

    if (!hasChanges) {
      showAlert("No Changes", "Nothing has been changed to publish.");
      return;
    }
    const newErrors = {};
    const errorMessages = [];

    // 1. Validate Category Names
    const catMap = {};
    categories.forEach((cat) => {
      const trimmed = cat.category ? cat.category.trim().toLowerCase() : "";

      if (!trimmed) {
        newErrors[`cat-${cat.category_id}`] = true;
        errorMessages.push("Category name cannot be empty.");
      } else if (catMap[trimmed]) {
        // Highlight BOTH duplicate categories in red
        newErrors[`cat-${cat.category_id}`] = true;
        newErrors[`cat-${catMap[trimmed]}`] = true;
        errorMessages.push(`Duplicate category name found: "${cat.category}".`);
      } else {
        catMap[trimmed] = cat.category_id;
      }
    });

    // 2. Validate Menu Items & Nested Arrays
    menuItems.forEach((item) => {
      // Check Empty Name
      if (!item.item_name || !item.item_name.trim()) {
        newErrors[`item-name-${item.item_id}`] = true;
        errorMessages.push("Item name cannot be empty.");
      }

      // Check Base Price (Must be numeric and >= 0)
      const priceNum = Number(item.base_price);
      if (
        item.base_price === "" ||
        item.base_price === null ||
        isNaN(priceNum) ||
        priceNum < 0
      ) {
        newErrors[`item-price-${item.item_id}`] = true;
        errorMessages.push(
          `Price for "${item.item_name || "Item"}" must be a valid number.`,
        );
      }

      // Check Missing Image
      if (!item.image_path) {
        newErrors[`item-image-${item.item_id}`] = true;
        errorMessages.push(
          `Please upload an image for "${item.item_name || "Item"}".`,
        );
      }

      // Check Nested Variants
      if (item.variants && item.variants.length > 0) {
        item.variants.forEach((v) => {
          // Variant Label Check
          if (!v.label || !v.label.trim()) {
            newErrors[`variant-label-${v.id}`] = true;
            errorMessages.push(
              `Variant label cannot be empty in "${item.item_name || "Item"}".`,
            );
          }

          // Variant Price Check
          const varPrice = Number(v.price);
          if (
            v.price === "" ||
            v.price === null ||
            isNaN(varPrice) ||
            varPrice < 0
          ) {
            newErrors[`variant-price-${v.id}`] = true;
            errorMessages.push(
              `Variant price for "${v.label || "Variant"}" must be a valid number.`,
            );
          }
        });
      }

      // Check Nested Addons
      if (item.addons && item.addons.length > 0) {
        item.addons.forEach((a) => {
          // Addon Name Check
          if (!a.name || !a.name.trim()) {
            newErrors[`addon-name-${a.id}`] = true;
            errorMessages.push(
              `Addon name cannot be empty in "${item.item_name || "Item"}".`,
            );
          }

          // Addon Price Check
          const addonPrice = Number(a.price);
          if (
            a.price === "" ||
            a.price === null ||
            isNaN(addonPrice) ||
            addonPrice < 0
          ) {
            newErrors[`addon-price-${a.id}`] = true;
            errorMessages.push(
              `Addon price for "${a.name || "Addon"}" must be a valid number.`,
            );
          }
        });
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const uniqueMessages = [...new Set(errorMessages)];
      showAlert("Validation Error", `• ${uniqueMessages.join("\n• ")}`);
      return;
    }

    // Clear errors if all checks pass
    setErrors({});

    const payload = {
      categories: pendingChanges.categories,
      menu_items: pendingChanges.menu_items,
      item_variants: pendingChanges.item_variants,
      addons: pendingChanges.addons,
      item_addons: pendingChanges.item_addons,
    };

    try {
      let { data, error } = await supabase.rpc("save_menu_batch", {
        payload: payload,
      });

      if (error) {
        const errbody = await error.context.json();
        console.log(errbody);
        return;
      }

      // Clear pending changes on success
      setPendingChanges({
        categories: [],
        menu_items: [],
        item_variants: [],
        addons: [],
        item_addons: [],
      });

      await fetchMenuData();
      showAlert("Success", "Changes published successfully!");
    } catch (err) {
      console.error("Failed to save:", err);
      showAlert("Error", err.message || "Something went wrong while saving.");
    }
  };

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
      className="admin-dash  relative flex justify-center w-full min-h-screen font-sans antialiased text-[#EFE6DA]"
      style={{
        background:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 2px, transparent 2px, transparent 6px), #120D09",
      }}
    >
      <div className="w-full p-1  flex flex-col items-center ">
        <AdminHeader
          handleRevert={handleRevert}
          handleSave={handleSave}
          addCategory={addCategory}
        />

        <div className="table-content w-full max-w-5xl   p-5 flex flex-col gap-6">
          <div>
            {categories.map((c) => (
              <CategoryTable
                key={c.category_id}
                category={c}
                menuItems={menuItems}
                errors={errors}
                expandedItemId={expandedItemId}
                setExpandedItemId={setExpandedItemId}
                handleCategoryChange={handleCategoryChange}
                deleteCategory={deleteCategory}
                addItem={additem}
                handleImageChange={handleImageChange}
                handleChange={handleChange}
                deleteItem={deleteItem}
                addVariant={addVariant}
                handleVariantChange={handleVariantChange}
                deleteVariant={deleteVariant}
                addAddonToItem={addAddonToItem}
                handleAddonChange={handleAddonChange}
                deleteAddon={deleteAddon}
                setErrors={setErrors}
              />
            ))}
          </div>
        </div>
      </div>
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18110C] border border-[#B8874F]/40 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] p-6 max-w-md w-full">
            <h3 className="font-serif font-bold text-xl text-[#EFE6DA] mb-3">
              {modal.title}
            </h3>
            <p className="text-sm text-[#B8874F]/85 whitespace-pre-line leading-relaxed mb-6">
              {modal.message}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setModal({ isOpen: false, title: "", message: "" })
                }
                className="bg-[#B8874F] hover:bg-[#CE9A5E] text-[#12100D] font-bold px-5 py-2 rounded-xl text-sm transition-colors cursor-pointer uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
