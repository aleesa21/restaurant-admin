import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const fetcheddata = [
  {
    category_id: "eb988d41-87c7-4fff-8894-9a06b0cde31e",
    category: "Coffee",
    item_id: "4478dab1-44ec-4ea3-bb4a-c9e32072113e",
    item_name: "Espresso / Macchiato",
    description: null,
    image_path: "expresso-macchiato.png",
    base_price: 200.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "eb988d41-87c7-4fff-8894-9a06b0cde31e",
    category: "Coffee",
    item_id: "91417c8c-ebdb-4356-9765-4bb58f254c8e",
    item_name: "Americano",
    description: "Hot / Iced",
    image_path: "americano.png",
    base_price: 200.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "eb988d41-87c7-4fff-8894-9a06b0cde31e",
    category: "Coffee",
    item_id: "d18aa0cf-881f-4013-aa9a-7a777de94293",
    item_name: "Piccolo / Cortado",
    description: null,
    image_path: "piccolo-cortado.png",
    base_price: 220.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "eb988d41-87c7-4fff-8894-9a06b0cde31e",
    category: "Coffee",
    item_id: "b15894f1-54b8-4f79-993b-21d3b778c99c",
    item_name: "Flat White",
    description: null,
    image_path: "flat-white.png",
    base_price: 240.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "eb988d41-87c7-4fff-8894-9a06b0cde31e",
    category: "Coffee",
    item_id: "078bce5f-33c7-4ca8-9b22-98214df15461",
    item_name: "Mocha Latte",
    description: null,
    image_path: "mocha-latte.png",
    base_price: 340.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "eb988d41-87c7-4fff-8894-9a06b0cde31e",
    category: "Coffee",
    item_id: "40a3d8c9-63fc-41a6-a0be-d22f0f69ea07",
    item_name: "Espresso Affogato",
    description: null,
    image_path: "espresso-affogato.png",
    base_price: 250.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "eb988d41-87c7-4fff-8894-9a06b0cde31e",
    category: "Coffee",
    item_id: "abc8415b-c258-4b1e-98bc-832312f582c2",
    item_name: "Cappuccino / Latte",
    description: "Hot / Iced",
    image_path: "cappuccino-latte.png",
    base_price: 240.0,
    is_available: true,
    variants: [
      {
        id: "7d15a5c1-6c42-4ef0-b912-5dc0d2bc53c6",
        label: "Hot",
        price: 240.0,
      },
      {
        id: "72f00e86-2863-4601-87ca-fac53e332f9b",
        label: "Iced",
        price: 260.0,
      },
    ],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "eb988d41-87c7-4fff-8894-9a06b0cde31e",
    category: "Coffee",
    item_id: "67d90891-3d3b-4abf-8e20-a3886f649cb1",
    item_name: "Spanish Latte",
    description: null,
    image_path: "spanish-latte.png",
    base_price: 320.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "33889efd-7a0f-461f-a21d-557450f52ad1",
    category: "Coffee Alternatives",
    item_id: "57d38dd4-7f92-4171-bad9-24b91eecf497",
    item_name: "Lemon Iced Tea",
    description: null,
    image_path: "lemon-iced-tea.png",
    base_price: 250.0,
    is_available: true,
    variants: [],
    addons: [],
  },
  {
    category_id: "33889efd-7a0f-461f-a21d-557450f52ad1",
    category: "Coffee Alternatives",
    item_id: "bb3615b1-4d42-4124-aaa9-4c3673e48209",
    item_name: "Peach Iced Tea",
    description: null,
    image_path: "peach-iced-tea.png",
    base_price: 280.0,
    is_available: true,
    variants: [],
    addons: [],
  },
  {
    category_id: "33889efd-7a0f-461f-a21d-557450f52ad1",
    category: "Coffee Alternatives",
    item_id: "9870d2a3-8dfe-4360-ba67-3e2eb16ab6d2",
    item_name: "Hot Chocolate",
    description: null,
    image_path: "hot-chocolate.png",
    base_price: 250.0,
    is_available: true,
    variants: [],
    addons: [],
  },
  {
    category_id: "33889efd-7a0f-461f-a21d-557450f52ad1",
    category: "Coffee Alternatives",
    item_id: "bb8c77b8-ebb6-47d7-8af1-74fb87980cda",
    item_name: "Milkshakes",
    description: null,
    image_path: "milkshakes.png",
    base_price: 320.0,
    is_available: true,
    variants: [],
    addons: [],
  },
  {
    category_id: "541c1a2f-d484-4fd2-88e8-4331633de32f",
    category: "Matcha",
    item_id: "f7065abd-25c1-4cb2-93a5-fdbd4d8812ad",
    item_name: "Matcha Latte",
    description: "Hot / Iced",
    image_path: "matcha-latte.png",
    base_price: 250.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "541c1a2f-d484-4fd2-88e8-4331633de32f",
    category: "Matcha",
    item_id: "e7d02b8f-f3dc-4ac8-9f1c-772f9bd67bb3",
    item_name: "Vanilla Matcha Latte",
    description: null,
    image_path: "vanilla-matcha-latte.png",
    base_price: 300.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "541c1a2f-d484-4fd2-88e8-4331633de32f",
    category: "Matcha",
    item_id: "ddebb919-a8c2-4d24-afc3-a7308d3d2580",
    item_name: "Strawberry Matcha",
    description: null,
    image_path: "strawberry-matcha.png",
    base_price: 350.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "541c1a2f-d484-4fd2-88e8-4331633de32f",
    category: "Matcha",
    item_id: "28b60fc0-7ee1-460a-91f2-c323789f341b",
    item_name: "Blueberry Matcha",
    description: null,
    image_path: "blueberry-matcha.png",
    base_price: 350.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "541c1a2f-d484-4fd2-88e8-4331633de32f",
    category: "Matcha",
    item_id: "d6918fb2-1097-45ce-a240-1630cc87ca63",
    item_name: "Oreo Matcha",
    description: null,
    image_path: "oreo-matcha.png",
    base_price: 350.0,
    is_available: true,
    variants: [],
    addons: [
      {
        id: "9b78eb45-8dee-4b77-bc98-d30f7126c7c3",
        name: "Vanilla",
        price: 100.0,
      },
      {
        id: "e6b1dabd-e14d-4df1-8e72-d8776b584d6c",
        name: "Caramel",
        price: 100.0,
      },
      {
        id: "f3ae1e87-9732-48a7-b18b-787cea77b6a5",
        name: "Hazelnut",
        price: 100.0,
      },
    ],
  },
  {
    category_id: "f98851ab-60f5-47eb-88ef-cc5b374c976f",
    category: "Brew Bar",
    item_id: "731f5144-f181-4a38-89c9-beb9db760b4f",
    item_name: "V60",
    description: null,
    image_path: "v60.png",
    base_price: 400.0,
    is_available: true,
    variants: [],
    addons: [],
  },
  {
    category_id: "f98851ab-60f5-47eb-88ef-cc5b374c976f",
    category: "Brew Bar",
    item_id: "7bfb64a7-8af5-4463-95b8-6397c9d4d8c4",
    item_name: "Cold Brew",
    description: null,
    image_path: "cold-brew.png",
    base_price: 500.0,
    is_available: true,
    variants: [],
    addons: [],
  },
];
// {
//   category: "Coffee",
//   category_id: "cat-coffee-1",
//   item_id: "item-cappuccino-1",
//   item_name: "Cappuccino / Latte",
//   description: "Hot / Iced",
//   image_path: null,
//   base_price: 240,
//   is_available: true,
//   variants: [
//     { variant_id: "var-hot-1", label: "Hot", price: 240 },
//     { variant_id: "var-iced-1", label: "Iced", price: 260 },
//   ],
//   addons: [
//     { addon_id: "addon-vanilla-1", name: "Vanilla", price: 100 },
//     { addon_id: "addon-caramel-1", name: "Caramel", price: 100 },
//   ],
// },
// {
//   category: "Coffee",
//   category_id: "cat-coffee-1",
//   item_id: "item-spanish-latte-1",
//   item_name: "Spanish Latte",
//   description: null,
//   image_path: null,
//   base_price: 250,
//   is_available: true,
//   variants: [],
//   addons: [{ addon_id: "addon-vanilla-1", name: "Vanilla", price: 100 }],
// },
// {
//   category: "Brew Bar",
//   category_id: "cat-brewbar-1",
//   item_id: "item-v60-1",
//   item_name: "V60",
//   description: null,
//   image_path: null,
//   base_price: 400,
//   is_available: true,
//   variants: [],
//   addons: [],
// },

// const URL = "http://10.106.0.20:8000";
// const KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";

// const supabase = createClient(URL, KEY);
// async function login() {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: "test@example.com",
//     password: "123456789",
//   });
//   if (error) {
//     console.log("error");
//     throw error;
//   }
// }
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

  //fetching and seperating categories and items
  useEffect(() => {
    const categories = [
      ...new Map(
        fetcheddata.map((item) => [
          item.category_id,
          {
            category_id: item.category_id,
            category: item.category,
          },
        ]),
      ).values(),
    ];
    const items = fetcheddata.map((item) => {
      const { category, ...rest } = item;

      return rest;
    });
    setCategories(categories);
    setMenuItems(items);
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

      // Cast base_price to Number if that's the field changing
      const finalValue = field === "base_price" ? Number(value) : value;

      if (existingChangeIdx > -1) {
        // Update existing tracked change
        updatedItems[existingChangeIdx] = {
          ...updatedItems[existingChangeIdx],
          [field === "item_name" ? "name" : field]: finalValue,
        };
      } else {
        // First change on a pre-existing DB item, log an 'update' action
        updatedItems.push({
          action: "update",
          id: itemId,
          [field === "item_name" ? "name" : field]: finalValue,
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
  const deleteItem = (itemId) => {
    // Update UI
    setMenuItems((prev) => prev.filter((item) => item.item_id !== itemId));

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
  function handleImageChange(id, e) {
    const file = e.target.files[0];
    if (!file) return;

    // Create local preview URL for instant rendering on screen
    const previewUrl = URL.createObjectURL(file);

    // A. UPDATE THE UI STATE (For previewing)
    setMenuItems((prev) =>
      prev.map((item) =>
        item.item_id === id ? { ...item, imagePreview: previewUrl } : item,
      ),
    );

    // Read file as Base64 text string
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result; // This looks like "data:image/png;base64,iVBORw..."

      // B. UPDATE THE TRACKING LOG WITH THE TEXT STRING
      setPendingChanges((prev) => {
        const updatedItems = [...prev.menu_items];
        const existingChangeIdx = updatedItems.findIndex((i) => i.id === id);

        if (existingChangeIdx > -1) {
          // If the item is already tracked (insert or update), append/update the string
          updatedItems[existingChangeIdx] = {
            ...updatedItems[existingChangeIdx],
            image_path: base64String, // Passes the file string directly inside the JSON schema
          };
        } else {
          // First edit on a pre-existing database item
          updatedItems.push({
            action: "update",
            id: id,
            image_path: base64String, // Passes the file string directly inside the JSON schema
          });
        }

        return { ...prev, menu_items: updatedItems };
      });
    };
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
            v.variant_id === variantId ? { ...v, [field]: value } : v,
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

      const finalValue =
        field === "price" || field === "sort_order" ? Number(value) : value;

      // BETTER WAY: Check if the variant existed in the original fetched data
      const isNewVariant = !fetcheddata.some((origItem) =>
        origItem.variants?.some((origVar) => origVar.variant_id === variantId),
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
    const newVariant = { variant_id: newVarId, label: "", price: "" };

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
          sort_order: 1,
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
          variants: item.variants.filter((v) => v.variant_id !== variantId),
        };
      }),
    );

    // B. Update Tracking Log (Push 'delete' to item_variants)
    setPendingChanges((prev) => {
      // Check if the variant existed in the original fetched data
      const isNewVariant = !fetcheddata.some((origItem) =>
        origItem.variants?.some((origVar) => origVar.variant_id === variantId),
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
    // await login();
    // let { data, error } = await supabase.rpc("save_menu_batch", {
    //   payload: payload,
    // });
    // if (error) throw error;

    setPendingChanges({
      categories: [],
      menu_items: [],
      item_variants: [],
      addons: [],
      item_addons: [],
    });

    console.log("Payload ready to send directly:", payload);
  };

  console.log("pending item changes", pendingChanges.menu_items);
  console.log("pending category changes", pendingChanges.categories);
  console.log("pending variants changes", pendingChanges.item_variants);
  console.log("main addons changes", pendingChanges.addons);
  console.log("new addons changes:", pendingChanges.item_addons);

  return (
    <div >
      {categories.map((c) => {
        return (
          <div
            key={c.category_id}
            className=" category w-250 p-5 mt-5 rounded-2xl bg-white"
          >
            <div className="top flex justify-between">
              <input
                type="text"
                name=""
                id=""
                value={c.category}
                placeholder="category"
                onChange={(e) =>
                  handleCategoryChange(c.category_id, e.target.value)
                }
              />
              <div
                className=""
                onClick={() => {
                  additem(c.category_id);
                }}
              >
                add item
              </div>
              <button
                type="button"
                className="bg-transparent border border-gray-800 hover:border-red-900/50 text-gray-500 hover:text-red-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                onClick={() => deleteCategory(c.category_id)}
              >
                Delete Category
              </button>
            </div>
            <table className="w-full table-fixed">
              <thead>
                <tr className="text-start">
                  <th className="text-start">image</th>
                  <th className="text-start">name</th>
                  <th className="text-start">price</th>
                  <th className="text-start">actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems
                  .filter((f) => f.category_id === c.category_id)
                  .map((item) => {
                    const isExpanded = expandedItemId === item.item_id;
                    return (
                      <React.Fragment key={item.item_id}>
                        <tr key={item.item_id}>
                          <td className="py-2.5 border-t border-gray-50">
                            <label
                              className={`w-9 h-9 rounded-lg bg-gray-300 border border-gray-400 flex items-center justify-center text-gray-700 text-xs cursor-pointer hover:bg-gray-400 hover:border-gray-500 transition-colors overflow-hidden ${!item.is_available ? "opacity-50 line-through" : ""}`}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageChange(item.item_id, e)
                                }
                              />
                              {item.imagePreview || item.image_path ? (
                                <img
                                  src={item.imagePreview || item.image_path}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                "img"
                              )}
                            </label>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="name"
                              className={`${!item.is_available ? "opacity-50 line-through" : ""}`}
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

                          <td>
                            <input
                              type="text"
                              placeholder="price"
                              value={item.base_price}
                              className={`${!item.is_available ? "opacity-50 line-through" : ""}`}
                              onChange={(e) =>
                                handleChange(
                                  item.item_id,
                                  "base_price",
                                  e.target.value,
                                )
                              }
                            />
                          </td>

                          <td className="text-start">
                            <button
                              className="border border-gray-300 p-2 m-2 rounded-lg"
                              onClick={() =>
                                setExpandedItemId(
                                  isExpanded ? null : item.item_id,
                                )
                              }
                            >
                              {isExpanded ? "close" : "details"}
                            </button>
                            <button
                              className="border border-gray-300 p-2 m-2 rounded-lg transition-colors"
                              onClick={() =>
                                handleChange(
                                  item.item_id,
                                  "is_available",
                                  !item.is_available,
                                )
                              }
                            >
                              {item.is_available ? "hide" : "show"}
                            </button>
                            <button
                              onClick={() => {
                                deleteItem(item.item_id);
                              }}
                              className="border border-gray-300 p-2 m-2 rounded-lg"
                            >
                              delete
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr>
                            <td
                              colSpan="4"
                              className="bg-gray-800 p-4 border-t border-gray-700"
                            >
                              <div className="flex gap-8 text-white">
                                {/* VARIANTS COLUMN */}
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-sm text-gray-300">
                                      Variants
                                    </h4>
                                    <button
                                      className="text-xs bg-blue-600 px-2 py-1 rounded"
                                      onClick={() => addVariant(item.item_id)}
                                    >
                                      + Add Variant
                                    </button>
                                  </div>
                                  {item.variants.map((v) => (
                                    <div
                                      key={v.variant_id}
                                      className="flex gap-2 mb-2"
                                    >
                                      <input
                                        type="text"
                                        placeholder="Label (e.g., Large)"
                                        className="bg-gray-700 text-white p-1 rounded text-xs w-1/2"
                                        value={v.label}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            item.item_id,
                                            v.variant_id,
                                            "label",
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <input
                                        type="text"
                                        placeholder="Price"
                                        className="bg-gray-700 text-white p-1 rounded text-xs w-1/2"
                                        value={v.price}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            item.item_id,
                                            v.variant_id,
                                            "price",
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <button
                                        type="button"
                                        className="p-2 text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-900/50 rounded-lg transition-colors cursor-pointer"
                                        onClick={() =>
                                          deleteVariant(
                                            item.item_id,
                                            v.variant_id,
                                          )
                                        }
                                        title="Delete Variant"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5"
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
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-sm text-gray-300">
                                      Addons
                                    </h4>
                                    <button
                                      type="button"
                                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                                      onClick={() =>
                                        addAddonToItem(item.item_id)
                                      }
                                    >
                                      + Add Addon
                                    </button>
                                  </div>

                                  {/* Map through item.addons here similar to variants */}
                                  {item.addons && item.addons.length > 0 ? (
                                    item.addons.map((addon) => (
                                      <div
                                        key={addon.id}
                                        className="flex gap-2 mb-2"
                                      >
                                        <input
                                          type="text"
                                          placeholder="Name (e.g., Vanilla)"
                                          className="bg-gray-700 text-white p-1 rounded text-xs w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                          className="bg-gray-700 text-white p-1 rounded text-xs w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                          className="p-2 text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-900/50 rounded-lg transition-colors cursor-pointer"
                                          onClick={() =>
                                            deleteAddon(item.item_id, addon.id)
                                          }
                                          title="Delete Addon"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
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
                                    <p className="text-xs text-gray-500 italic">
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

      <div
        className="text-white border border-white px-2 py-2 mt-3"
        onClick={addCategory}
      >
        add category
      </div>
      <button
        onClick={handleSave}
        className="p-3 border border-white text-white"
      >
        save
      </button>
    </div>
  );
}

export default CategoryTable;
