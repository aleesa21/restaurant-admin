// menuDiff.js
//
// Single source of truth for:
//   1. transformFetchToState(rows) -> { categories, items, addons }
//   2. makeNew*()                  -> factory functions for rows created in the browser
//   3. buildSavePayload(original, current) -> the insert/update/delete payload
//
// All ids (category, item, variant, addon) are now assumed to be real,
// stable backend ids present on every fetched row.

function uid() {
  return crypto.randomUUID();
}

/**
 * Converts the flat fetch response into { categories, items, addons }.
 * Addons are deduped by id into one global list; each item keeps only
 * addonIds (references), not full addon objects.
 */
export function transformFetchToState(rows) {
  const categoriesById = new Map();
  const addonsById = new Map();
  const items = [];

  for (const row of rows) {
    if (!categoriesById.has(row.category_id)) {
      categoriesById.set(row.category_id, {
        id: row.category_id,
        name: row.category,
        _fromServer: true,
      });
    }

    for (const a of row.addons || []) {
      if (!addonsById.has(a.addon_id)) {
        addonsById.set(a.addon_id, {
          id: a.addon_id,
          name: a.name,
          price: a.price,
          _fromServer: true,
        });
      }
    }

    items.push({
      id: row.item_id,
      categoryId: row.category_id,
      image: row.image_path || "",
      imagePreview: row.image_path || "",
      name: row.item_name,
      description: row.description || "",
      price: row.base_price ?? "",
      visible: row.is_available ?? true,
      variants: (row.variants || []).map((v) => ({
        id: v.variant_id,
        label: v.label,
        price: v.price,
        _fromServer: true,
      })),
      addonIds: (row.addons || []).map((a) => a.addon_id),
      _fromServer: true,
    });
  }

  return {
    categories: Array.from(categoriesById.values()),
    items,
    addons: Array.from(addonsById.values()),
  };
}

export function makeNewCategory() {
  return { id: uid(), name: "", _fromServer: false };
}

export function makeNewItem(categoryId) {
  return {
    id: uid(),
    categoryId,
    image: "",
    imagePreview: "",
    name: "",
    description: "",
    price: "",
    visible: true,
    variants: [],
    addonIds: [],
    _fromServer: false,
  };
}

export function makeNewVariant() {
  return { id: uid(), label: "", price: "", _fromServer: false };
}

export function makeNewAddon() {
  return { id: uid(), name: "", price: "", _fromServer: false };
}

// ---------------------------------------------------------------------------
// Diffing
// ---------------------------------------------------------------------------

function byId(list) {
  return new Map(list.map((row) => [row.id, row]));
}

export function buildSavePayload(original, current) {
  const payload = {
    categories: [],
    menu_items: [],
    item_variants: [],
    addons: [],
    item_addons: [],
  };

  // ---- categories ---------------------------------------------------------
  const origCats = byId(original.categories);
  const currCats = byId(current.categories);

  for (const cat of current.categories) {
    if (!cat._fromServer) {
      payload.categories.push({ action: "insert", id: cat.id, name: cat.name });
      continue;
    }
    const orig = origCats.get(cat.id);
    if (orig && orig.name !== cat.name) {
      payload.categories.push({ action: "update", id: cat.id, name: cat.name });
    }
  }
  for (const cat of original.categories) {
    if (!currCats.has(cat.id)) {
      payload.categories.push({ action: "delete", id: cat.id });
    }
  }

  // ---- menu_items -----------------------------------------------------------
  const origItems = byId(original.items);
  const currItems = byId(current.items);

  for (const item of current.items) {
    if (!item._fromServer) {
      payload.menu_items.push({
        action: "insert",
        id: item.id,
        category_id: item.categoryId,
        name: item.name,
        description: item.description,
        image_path: item.image || null,
        base_price: Number(item.price) || 0,
      });
    } else {
      const orig = origItems.get(item.id);
      if (!orig) continue;
      const changes = {};
      if (orig.name !== item.name) changes.name = item.name;
      if (orig.description !== item.description) changes.description = item.description;
      if (String(orig.price) !== String(item.price)) changes.base_price = Number(item.price) || 0;
      if (orig.visible !== item.visible) changes.is_available = item.visible;
      if (orig.categoryId !== item.categoryId) changes.category_id = item.categoryId;
      if (Object.keys(changes).length > 0) {
        payload.menu_items.push({ action: "update", id: item.id, ...changes });
      }
    }
  }
  for (const item of original.items) {
    if (!currItems.has(item.id)) {
      payload.menu_items.push({ action: "delete", id: item.id });
    }
  }

  // ---- item_variants ----------------------------------------------------
  for (const item of current.items) {
    const origItem = origItems.get(item.id);
    const origVariants = byId(origItem ? origItem.variants : []);
    const currVariantIds = new Set(item.variants.map((v) => v.id));

    for (const v of item.variants) {
      if (!v._fromServer) {
        payload.item_variants.push({
          action: "insert",
          id: v.id,
          item_id: item.id,
          label: v.label,
          price: Number(v.price) || 0,
        });
      } else {
        const orig = origVariants.get(v.id);
        if (orig && (orig.label !== v.label || String(orig.price) !== String(v.price))) {
          payload.item_variants.push({
            action: "update",
            id: v.id,
            label: v.label,
            price: Number(v.price) || 0,
          });
        }
      }
    }
    for (const v of origItem ? origItem.variants : []) {
      if (!currVariantIds.has(v.id)) {
        payload.item_variants.push({ action: "delete", id: v.id });
      }
    }
  }

  // ---- addons (global) ------------------------------------------------------
  const origAddons = byId(original.addons);
  const currAddons = byId(current.addons);

  for (const a of current.addons) {
    if (!a._fromServer) {
      payload.addons.push({ action: "insert", id: a.id, name: a.name, price: Number(a.price) || 0 });
      continue;
    }
    const orig = origAddons.get(a.id);
    if (orig && (orig.name !== a.name || String(orig.price) !== String(a.price))) {
      payload.addons.push({ action: "update", id: a.id, name: a.name, price: Number(a.price) || 0 });
    }
  }
  for (const a of original.addons) {
    if (!currAddons.has(a.id)) {
      payload.addons.push({ action: "delete", id: a.id });
    }
  }

  // ---- item_addons (join) -------------------------------------------------
  const origLinks = new Set();
  for (const item of original.items) {
    for (const addonId of item.addonIds) origLinks.add(`${item.id}::${addonId}`);
  }
  const currLinks = new Set();
  for (const item of current.items) {
    for (const addonId of item.addonIds) currLinks.add(`${item.id}::${addonId}`);
  }

  for (const key of currLinks) {
    if (!origLinks.has(key)) {
      const [item_id, addon_id] = key.split("::");
      payload.item_addons.push({ action: "insert", item_id, addon_id });
    }
  }
  for (const key of origLinks) {
    if (!currLinks.has(key)) {
      const [item_id, addon_id] = key.split("::");
      payload.item_addons.push({ action: "delete", item_id, addon_id });
    }
  }

  return payload;
}
