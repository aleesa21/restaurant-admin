import React from "react";
import { X, Plus, Trash } from "lucide-react";

function AddonsModal({
  isOpen,
  onClose,
  globalAddons,
  addGlobalAddon,
  handleGlobalAddonChange,
  deleteGlobalAddon,
  errors,
  setErrors,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#18110C] border border-[#B8874F]/40 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] p-6 max-w-xl w-full flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#B8874F]/25">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#EFE6DA]">
              Manage Global Addons
            </h3>
            <p className="text-xs text-[#B8874F]/75 mt-0.5">
              Add or modify addons available across all menu items.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C7A6B] hover:text-[#EFE6DA] hover:bg-[#B8874F]/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Header */}
        <div className="flex justify-between items-center mb-3 px-1">
          <h4 className="font-serif font-bold text-sm text-[#B8874F]">
            Master Addons List
          </h4>
          <button
            type="button"
            className="text-xs bg-[#B8874F] text-[#12100D] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#CE9A5E] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            onClick={addGlobalAddon}
          >
            <Plus size={14} />
            Add Addon
          </button>
        </div>

        {/* Addons List Container */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {globalAddons && globalAddons.length > 0 ? (
            globalAddons.map((addon) => (
              <div key={addon.id} className="flex gap-2 mb-2.5 items-center">
                {/* Name Input */}
                <input
                  type="text"
                  placeholder="Addon Name"
                  className={`bg-[#1C1410] text-[#EFE6DA] placeholder-[#8C7A6B] p-2.5 rounded-xl text-xs w-1/2 border focus:outline-none transition-colors ${
                    errors[`global-addon-name-${addon.id}`]
                      ? "border-red-500 bg-red-950/30"
                      : "border-[#B8874F]/25 focus:border-[#B8874F]"
                  }`}
                  value={addon.name || ""}
                  onChange={(e) => {
                    handleGlobalAddonChange(addon.id, "name", e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      [`global-addon-name-${addon.id}`]: false,
                    }));
                  }}
                />

                {/* Price Input */}
                <input
                  type="text"
                  placeholder="Price"
                  className={`bg-[#1C1410] text-[#EFE6DA] placeholder-[#8C7A6B] p-2.5 rounded-xl text-xs w-1/2 border focus:outline-none transition-colors ${
                    errors[`global-addon-price-${addon.id}`]
                      ? "border-red-500 bg-red-950/30 text-red-300"
                      : "border-[#B8874F]/25 focus:border-[#B8874F]"
                  }`}
                  value={addon.price ?? ""}
                  onChange={(e) => {
                    handleGlobalAddonChange(addon.id, "price", e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      [`global-addon-price-${addon.id}`]: false,
                    }));
                  }}
                />

                {/* Delete Button */}
                <button
                  type="button"
                  className="p-2.5 text-[#8C7A6B] hover:text-red-400 border border-[#B8874F]/25 hover:border-red-900/50 hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  onClick={() => deleteGlobalAddon(addon.id)}
                >
                  <Trash size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-[#B8874F]/20 rounded-xl my-2">
              <p className="text-xs text-[#8C7A6B] italic">
                No global addons created yet. Click "+ Add Addon" above to start.
              </p>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-4 mt-2 border-t border-[#B8874F]/25">
          <button
            onClick={onClose}
            className="bg-[#B8874F] hover:bg-[#CE9A5E] text-[#12100D] font-bold px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddonsModal;