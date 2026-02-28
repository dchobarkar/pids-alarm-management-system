"use client";

import { useEffect, useRef, useState } from "react";
import type { Chainage } from "@/lib/generated/prisma";

interface MultiSelectProps {
  chainages: Chainage[];
  /** When a user is selected, pass chainage IDs they are already assigned to so only unassigned chainages are shown. */
  excludeChainageIds?: string[];
}

const ChainageMultiSelect = ({
  chainages,
  excludeChainageIds = [],
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableChainages = excludeChainageIds.length
    ? chainages.filter((c) => !excludeChainageIds.includes(c.id))
    : chainages;

  // when excluded list changes, drop any selected IDs that are now excluded (already assigned to this user)
  useEffect(() => {
    if (excludeChainageIds.length === 0) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIds((prev) =>
      prev.filter((id) => !excludeChainageIds.includes(id)),
    );
  }, [excludeChainageIds]);

  // close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filtered = availableChainages.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-(--border-default) rounded px-3 py-2 flex justify-between items-center"
      >
        {selectedIds.length
          ? `${selectedIds.length} selected`
          : "Select chainages…"}
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-(--border-default) rounded shadow max-h-60 overflow-auto">
          {/* Search */}
          <div className="p-2">
            <input
              type="text"
              className="w-full border px-2 py-1 rounded text-sm"
              placeholder="Search chainages…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="divide-y divide-(--border-default)">
            {filtered.map((c) => (
              <label
                key={c.id}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer max-w-60"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onChange={() => toggleSelect(c.id)}
                  className="max-w-5"
                />

                <span className="text-sm min-w-30">
                  {c.label} ({c.startKm}–{c.endKm} km)
                </span>
              </label>
            ))}
            {filtered.length === 0 && (
              <div className="p-2 text-xs text-center text-(--text-secondary)">
                {availableChainages.length === 0
                  ? "No unassigned chainages for this user"
                  : "No matches"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden inputs for form submit */}
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="chainageIds" value={id} />
      ))}
    </div>
  );
};

export default ChainageMultiSelect;
