"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, Building2, User, GitBranch, X } from "lucide-react";

interface SearchResult {
  type: "property" | "contact" | "deal";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const TYPE_CFG = {
  property: {
    icon: Building2,
    label: "Properties",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  contact: {
    icon: User,
    label: "Contacts",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  deal: {
    icon: GitBranch,
    label: "Deals",
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
} as const;

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const algoliaSearchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

  // ── Search via Algolia ──────────────────────────────────────────────────────

  const searchAlgolia = useCallback(
    async (q: string): Promise<SearchResult[]> => {
      const res = await fetch(
        `https://${algoliaAppId}-dsn.algolia.net/1/indexes/*/queries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Algolia-Application-Id": algoliaAppId!,
            "X-Algolia-API-Key": algoliaSearchKey!,
          },
          body: JSON.stringify({
            requests: [
              { indexName: "properties", query: q },
              { indexName: "contacts", query: q },
              { indexName: "deals", query: q },
            ],
          }),
        }
      );

      if (!res.ok) throw new Error("Algolia search failed");
      const json = await res.json();
      const [propResults, contactResults, dealResults] = json.results ?? [];

      const mapped: SearchResult[] = [
        ...(propResults?.hits ?? []).map((h: Record<string, unknown>) => ({
          type: "property" as const,
          id: String(h.objectID),
          title: String(h.address ?? h.title ?? "Property"),
          subtitle: String(h.city ?? h.status ?? ""),
          href: `/admin/properties/${h.objectID}`,
        })),
        ...(contactResults?.hits ?? []).map((h: Record<string, unknown>) => ({
          type: "contact" as const,
          id: String(h.objectID),
          title: String(h.full_name ?? h.name ?? "Contact"),
          subtitle: String(h.email ?? h.contact_type ?? ""),
          href: `/admin/contacts`,
        })),
        ...(dealResults?.hits ?? []).map((h: Record<string, unknown>) => ({
          type: "deal" as const,
          id: String(h.objectID),
          title: String(h.pipeline_stage ?? "Deal"),
          subtitle: String(h.deal_type ?? ""),
          href: `/admin/leads`,
        })),
      ];

      return mapped;
    },
    [algoliaAppId, algoliaSearchKey]
  );

  // ── Search via local API fallback ───────────────────────────────────────────

  const searchLocal = useCallback(async (q: string): Promise<SearchResult[]> => {
    const lower = q.toLowerCase();

    const [propRes, contactRes, dealRes] = await Promise.allSettled([
      fetch("/api/properties").then((r) => r.json()),
      fetch("/api/contacts").then((r) => r.json()),
      fetch("/api/deals").then((r) => r.json()),
    ]);

    const results: SearchResult[] = [];

    if (propRes.status === "fulfilled") {
      const props: Record<string, unknown>[] = propRes.value?.data ?? [];
      props
        .filter(
          (p) =>
            String(p.address ?? "").toLowerCase().includes(lower) ||
            String(p.city ?? "").toLowerCase().includes(lower) ||
            String(p.status ?? "").toLowerCase().includes(lower)
        )
        .slice(0, 5)
        .forEach((p) =>
          results.push({
            type: "property",
            id: String(p.id),
            title: String(p.address ?? "Property"),
            subtitle: [p.city, p.status].filter(Boolean).join(" · "),
            href: `/admin/properties/${p.id}`,
          })
        );
    }

    if (contactRes.status === "fulfilled") {
      const contacts: Record<string, unknown>[] = contactRes.value?.data ?? [];
      contacts
        .filter(
          (c) =>
            String(c.full_name ?? "").toLowerCase().includes(lower) ||
            String(c.email ?? "").toLowerCase().includes(lower) ||
            String(c.contact_type ?? "").toLowerCase().includes(lower)
        )
        .slice(0, 5)
        .forEach((c) =>
          results.push({
            type: "contact",
            id: String(c.id),
            title: String(c.full_name ?? "Contact"),
            subtitle: String(c.email ?? c.contact_type ?? ""),
            href: `/admin/contacts`,
          })
        );
    }

    if (dealRes.status === "fulfilled") {
      const deals: Record<string, unknown>[] = dealRes.value?.data ?? [];
      deals
        .filter(
          (d) =>
            String(d.pipeline_stage ?? "").toLowerCase().includes(lower) ||
            String(d.deal_type ?? "").toLowerCase().includes(lower)
        )
        .slice(0, 5)
        .forEach((d) =>
          results.push({
            type: "deal",
            id: String(d.id),
            title: String(d.pipeline_stage ?? "Deal"),
            subtitle: String(d.deal_type ?? ""),
            href: `/admin/leads`,
          })
        );
    }

    return results;
  }, []);

  // ── Debounced search trigger ────────────────────────────────────────────────

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setOpen(true);
      try {
        const res =
          algoliaAppId && algoliaSearchKey
            ? await searchAlgolia(query)
            : await searchLocal(query);
        setResults(res);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, algoliaAppId, algoliaSearchKey, searchAlgolia, searchLocal]);

  // ── Close on Escape / outside click ────────────────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  // ── Group results by type ───────────────────────────────────────────────────

  const grouped = (["property", "contact", "deal"] as const).reduce(
    (acc, type) => {
      const items = results.filter((r) => r.type === type);
      if (items.length > 0) acc[type] = items;
      return acc;
    },
    {} as Partial<Record<"property" | "contact" | "deal", SearchResult[]>>
  );

  const hasResults = results.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      {/* Input */}
      <div className="flex items-center gap-2 bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2 focus-within:border-indigo-400 focus-within:bg-white transition-colors">
        <Search size={14} className="text-[#A8A49C] shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search properties, contacts, deals…"
          className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="text-[#A8A49C] hover:text-[#374151] transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E8E6E0] rounded-xl shadow-xl z-50 overflow-hidden max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-[#A8A49C]">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-[13px]">Searching…</span>
            </div>
          ) : !hasResults ? (
            <div className="flex flex-col items-center justify-center py-8 text-[#A8A49C]">
              <Search size={20} className="opacity-30 mb-2" />
              <p className="text-[13px]">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <div className="py-1">
              {(Object.entries(grouped) as [keyof typeof TYPE_CFG, SearchResult[]][]).map(
                ([type, items]) => {
                  const cfg = TYPE_CFG[type];
                  const Icon = cfg.icon;
                  return (
                    <div key={type}>
                      {/* Group header */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#F9F8F6]">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${cfg.bg}`}>
                          <Icon size={11} className={cfg.color} />
                        </div>
                        <span className="text-[10px] font-bold text-[#7C7870] uppercase tracking-wide">
                          {cfg.label}
                        </span>
                      </div>

                      {/* Results */}
                      {items.map((result) => (
                        <a
                          key={result.id}
                          href={result.href}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F4F5F7] transition-colors"
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                            <Icon size={13} className={cfg.color} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-[#111] truncate">
                              {result.title}
                            </p>
                            {result.subtitle && (
                              <p className="text-[11px] text-[#A8A49C] truncate">
                                {result.subtitle}
                              </p>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
