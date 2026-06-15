"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onUpdate: (newAddress: string) => void;
}

export default function AddressModal({
  isOpen,
  onClose,
  currentAddress,
  onUpdate,
}: AddressModalProps) {
  const [address, setAddress] = useState<string>(currentAddress);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async () => {
    if (!address.trim()) return;

    setIsSaving(true);

    // Simulasi asinkron agar terkesan melakukan pemrosesan data real-time
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Kirim data alamat baru ke checkout page untuk di-commit ke localStorage & order payload
    onUpdate(address.trim());

    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-900 cursor-pointer bg-transparent border-none"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-black text-gray-900 mb-2">
          Change Delivery Address
        </h2>
        <p className="text-xs text-gray-400 font-bold mb-4">
          Update your delivery location
        </p>

        <textarea
          className="w-full h-28 border border-gray-200 rounded-2xl p-3.5 mb-4 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#C12116] bg-gray-50 resize-none"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Type your delivery address here..."
        />

        <button
          onClick={handleSave}
          disabled={isSaving || !address.trim()}
          className="w-full bg-[#C12116] hover:bg-[#961818] text-white font-black py-3.5 rounded-2xl cursor-pointer disabled:bg-gray-300 transition-all text-sm"
        >
          {isSaving ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
}
