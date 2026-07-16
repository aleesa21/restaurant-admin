import React, { useEffect, useState, useCallback } from "react";
import { RotateCcw, Save } from "lucide-react";
import CataegoryTable from "../../components/CataegoryTable";
import { transformFetchToState, buildSavePayload } from "../../utils/menuDiff";

// TODO: point these at your real endpoints.
const FETCH_MENU_URL = "/api/menu";
const SAVE_MENU_URL = "/api/menu/save";

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function AdminDashboard() {
  const [original, setOriginal] = useState({
    categories: [],
    items: [],
    addons: [],
  });
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(FETCH_MENU_URL);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const rows = await res.json();
      const state = transformFetchToState(rows);
      setOriginal(deepClone(state));
      setCategories(state.categories);
      setItems(state.items);
      setAddons(state.addons);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  function handleRevert() {
    setCategories(deepClone(original.categories));
    setItems(deepClone(original.items));
    setAddons(deepClone(original.addons));
  }

  async function handlePublish() {
    const current = { categories, items, addons };
    const payload = buildSavePayload(original, current);

    const isEmpty = Object.values(payload).every((arr) => arr.length === 0);
    if (isEmpty) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(SAVE_MENU_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);

      setOriginal(deepClone(current));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-dash flex justify-center bg-[#f7fbff] w-full min-h-screen">
      <div className="w-full max-w-5xl">
        <div className="w-full p-5">
          <div className="menu-header bg-white rounded-2xl p-6 flex justify-between items-center shadow-sm border border-gray-100">
            <div>
              <h1 className="font-bold text-2xl capitalize text-gray-900">
                menu dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {loading
                  ? "Loading…"
                  : error
                    ? `Error: ${error}`
                    : "Last published 2 hours ago"}
              </p>
            </div>

            <div className="m-h-btns flex gap-3">
              <button
                onClick={handleRevert}
                disabled={loading || saving}
                className="flex items-center cursor-pointer gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Revert
              </button>
              <button
                onClick={handlePublish}
                disabled={loading || saving}
                className="flex items-center cursor-pointer gap-2 bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Publishing…" : "Publish changes"}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-5xl p-5 flex flex-col gap-6">
          {!loading && (
            <CataegoryTable
              categories={categories}
              setCategories={setCategories}
              items={items}
              setItems={setItems}
              addons={addons}
              setAddons={setAddons}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
