"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus, Search, Filter, Download, Eye, Trash2,
  FileText, Image, File, FolderOpen, Upload,
  X, ChevronDown, Lock, Unlock, Star, Grid3X3,
  List, Building2, User, Briefcase, Shield,
  Clock, HardDrive, Tag, MoreHorizontal,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type DocCategory =
  | "Contract" | "Inspection Report" | "Title Deed"
  | "Photo" | "Floor Plan" | "Invoice"
  | "ID Verification" | "Insurance" | "Other";

interface Document {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size_kb: number;
  doc_category: DocCategory;
  property_id: string | null;
  contact_id: string | null;
  deal_id: string | null;
  uploaded_by: string | null;
  is_private: boolean;
  created_at: string;
  // extended
  property_address?: string | null;
  contact_name?: string | null;
  uploader_name?: string | null;
  starred?: boolean;
}

// ── Config ────────────────────────────────────────────────────────────────────

const CATEGORY_CFG: Record<DocCategory, { color: string; bg: string; icon: React.ElementType }> = {
  "Contract":          { color: "text-indigo-700",  bg: "bg-indigo-100",  icon: FileText  },
  "Inspection Report": { color: "text-amber-700",   bg: "bg-amber-100",   icon: Shield    },
  "Title Deed":        { color: "text-violet-700",  bg: "bg-violet-100",  icon: Briefcase },
  "Photo":             { color: "text-rose-700",    bg: "bg-rose-100",    icon: Image     },
  "Floor Plan":        { color: "text-blue-700",    bg: "bg-blue-100",    icon: Grid3X3   },
  "Invoice":           { color: "text-emerald-700", bg: "bg-emerald-100", icon: FileText  },
  "ID Verification":   { color: "text-orange-700",  bg: "bg-orange-100",  icon: User      },
  "Insurance":         { color: "text-teal-700",    bg: "bg-teal-100",    icon: Shield    },
  "Other":             { color: "text-slate-600",   bg: "bg-slate-100",   icon: File      },
};

const FILE_TYPE_ICON: Record<string, { icon: React.ElementType; color: string }> = {
  pdf:  { icon: FileText, color: "text-rose-500"   },
  doc:  { icon: FileText, color: "text-blue-500"   },
  docx: { icon: FileText, color: "text-blue-500"   },
  jpg:  { icon: Image,    color: "text-amber-500"  },
  jpeg: { icon: Image,    color: "text-amber-500"  },
  png:  { icon: Image,    color: "text-emerald-500"},
  xls:  { icon: FileText, color: "text-emerald-600"},
  xlsx: { icon: FileText, color: "text-emerald-600"},
};

const CATEGORIES: DocCategory[] = [
  "Contract","Inspection Report","Title Deed","Photo",
  "Floor Plan","Invoice","ID Verification","Insurance","Other",
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DOCS: Document[] = [
  { id:"d1",  name:"Purchase Agreement — 42 Maple Street.pdf",     file_url:"#", file_type:"pdf",  file_size_kb:245,  doc_category:"Contract",          property_id:"p1", contact_id:null, deal_id:null, uploaded_by:null, is_private:false, created_at:new Date(Date.now()-2*86400000).toISOString(),  property_address:"42 Maple Street",    contact_name:"Thomas Morrison", uploader_name:"Sarah Kim",    starred:true  },
  { id:"d2",  name:"Home Inspection Report — 42 Maple.pdf",        file_url:"#", file_type:"pdf",  file_size_kb:1840, doc_category:"Inspection Report",  property_id:"p1", contact_id:null, deal_id:null, uploaded_by:null, is_private:false, created_at:new Date(Date.now()-5*86400000).toISOString(),  property_address:"42 Maple Street",    contact_name:"Thomas Morrison", uploader_name:"Sarah Kim",    starred:false },
  { id:"d3",  name:"Title Deed — Lakeview Drive.pdf",              file_url:"#", file_type:"pdf",  file_size_kb:892,  doc_category:"Title Deed",         property_id:"p2", contact_id:null, deal_id:null, uploaded_by:null, is_private:true,  created_at:new Date(Date.now()-7*86400000).toISOString(),  property_address:"18 Lakeview Drive",  contact_name:"Aisha Patel",     uploader_name:"Mike Roberts", starred:false },
  { id:"d4",  name:"Property Photos — Lakeview Drive.zip",         file_url:"#", file_type:"jpg",  file_size_kb:24500,doc_category:"Photo",              property_id:"p2", contact_id:null, deal_id:null, uploaded_by:null, is_private:false, created_at:new Date(Date.now()-3*86400000).toISOString(),  property_address:"18 Lakeview Drive",  contact_name:null,              uploader_name:"Mike Roberts", starred:true  },
  { id:"d5",  name:"Floor Plan — Birchwood Court.pdf",             file_url:"#", file_type:"pdf",  file_size_kb:560,  doc_category:"Floor Plan",         property_id:"p5", contact_id:null, deal_id:null, uploaded_by:null, is_private:false, created_at:new Date(Date.now()-10*86400000).toISOString(), property_address:"5 Birchwood Court",  contact_name:"Marcus Reid",     uploader_name:"Nina Torres",  starred:false },
  { id:"d6",  name:"Commission Invoice INV-2026-001.pdf",          file_url:"#", file_type:"pdf",  file_size_kb:128,  doc_category:"Invoice",            property_id:"p1", contact_id:null, deal_id:null, uploaded_by:null, is_private:false, created_at:new Date(Date.now()-6*86400000).toISOString(),  property_address:"42 Maple Street",    contact_name:"Thomas Morrison", uploader_name:"Admin User",   starred:false },
  { id:"d7",  name:"Thomas Morrison — Passport Copy.pdf",          file_url:"#", file_type:"pdf",  file_size_kb:340,  doc_category:"ID Verification",    property_id:null, contact_id:"c1", deal_id:null, uploaded_by:null, is_private:true,  created_at:new Date(Date.now()-4*86400000).toISOString(),  property_address:null,                 contact_name:"Thomas Morrison", uploader_name:"Sarah Kim",    starred:false },
  { id:"d8",  name:"Home Insurance — Pine Avenue.pdf",             file_url:"#", file_type:"pdf",  file_size_kb:678,  doc_category:"Insurance",          property_id:"p3", contact_id:null, deal_id:null, uploaded_by:null, is_private:false, created_at:new Date(Date.now()-12*86400000).toISOString(), property_address:"7 Pine Avenue",      contact_name:"Derek Walsh",     uploader_name:"Priya Sharma", starred:false },
  { id:"d9",  name:"Listing Agreement — Cedar Hills.docx",         file_url:"#", file_type:"docx", file_size_kb:198,  doc_category:"Contract",          property_id:"p4", contact_id:null, deal_id:null, uploaded_by:null, is_private:false, created_at:new Date(Date.now()-1*86400000).toISOString(),  property_address:"34 Cedar Hills Dr",  contact_name:"Carlos Mendez",   uploader_name:"Priya Sharma", starred:true  },
  { id:"d10", name:"NDA — Carlos Mendez Investment.pdf",           file_url:"#", file_type:"pdf",  file_size_kb:156,  doc_category:"Contract",          property_id:null, contact_id:"c7", deal_id:null, uploaded_by:null, is_private:true,  created_at:new Date(Date.now()-8*86400000).toISOString(),  property_address:null,                 contact_name:"Carlos Mendez",   uploader_name:"Admin User",   starred:false },
  { id:"d11", name:"Aerial Photos — Harbor Blvd.jpg",              file_url:"#", file_type:"jpg",  file_size_kb:4200, doc_category:"Photo",              property_id:"p4", contact_id:null, deal_id:null, uploaded_by:null, is_private:false, created_at:new Date(Date.now()-15*86400000).toISOString(), property_address:"93 Harbor Blvd",     contact_name:null,              uploader_name:"James Liu",    starred:false },
  { id:"d12", name:"Aisha Patel — ID Verification.pdf",            file_url:"#", file_type:"pdf",  file_size_kb:290,  doc_category:"ID Verification",    property_id:null, contact_id:"c2", deal_id:null, uploaded_by:null, is_private:true,  created_at:new Date(Date.now()-9*86400000).toISOString(),  property_address:null,                 contact_name:"Aisha Patel",     uploader_name:"Mike Roberts", starred:false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSize(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

// ── Upload Modal ──────────────────────────────────────────────────────────────

function UploadModal({ onClose, onUpload }: {
  onClose: () => void;
  onUpload: (doc: Partial<Document>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging]     = useState(false);
  const [file, setFile]             = useState<File | null>(null);
  const [form, setForm]             = useState({
    doc_category: "Contract" as DocCategory,
    is_private:   false,
    property_address: "",
    contact_name:     "",
  });

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (f: File) => setFile(f);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0EDE6]">
          <h2 className="text-[16px] font-bold text-[#111]">Upload Document</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragging ? "border-indigo-400 bg-indigo-50" : "border-[#E8E6E0] hover:border-indigo-300 hover:bg-[#FAFAF8]"
            }`}
          >
            <input ref={fileRef} type="file" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText size={24} className="text-indigo-500" />
                <div className="text-left">
                  <p className="text-[13px] font-bold text-[#111]">{file.name}</p>
                  <p className="text-[11px] text-[#A8A49C]">{formatSize(Math.round(file.size / 1024))}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-2 text-[#A8A49C] hover:text-rose-500"><X size={14} /></button>
              </div>
            ) : (
              <>
                <Upload size={28} className="mx-auto mb-2 text-[#C5BFB5]" />
                <p className="text-[13px] font-semibold text-[#7C7870]">Drag & drop or click to upload</p>
                <p className="text-[11px] text-[#C5BFB5] mt-1">PDF, DOC, DOCX, JPG, PNG, XLS — max 50MB</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Category</label>
              <select value={form.doc_category} onChange={(e) => set("doc_category", e.target.value as DocCategory)}
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#7C7870] outline-none">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Visibility</label>
              <div className="flex gap-2">
                {[{ label: "Public", val: false, icon: Unlock }, { label: "Private", val: true, icon: Lock }].map(({ label, val, icon: Icon }) => (
                  <button key={label} onClick={() => set("is_private", val)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                      form.is_private === val ? "bg-[#111] text-white border-[#111]" : "border-[#E8E6E0] text-[#7C7870] hover:bg-[#F4F5F7]"
                    }`}>
                    <Icon size={12} />{label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Property (optional)</label>
              <input value={form.property_address} onChange={(e) => set("property_address", e.target.value)}
                placeholder="Property address"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Contact (optional)</label>
              <input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)}
                placeholder="Contact name"
                className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400" />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!file) return;
                onUpload({
                  name: file.name,
                  file_url: URL.createObjectURL(file),
                  file_type: file.name.split(".").pop() || "other",
                  file_size_kb: Math.round(file.size / 1024),
                  doc_category: form.doc_category,
                  is_private: form.is_private,
                  property_address: form.property_address || undefined,
                  contact_name: form.contact_name || undefined,
                  uploader_name: "Admin User",
                });
              }}
              disabled={!file}
              className="flex-1 flex items-center justify-center gap-2 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
            >
              <Upload size={14} /> Upload Document
            </button>
            <button onClick={onClose} className="flex-1 bg-[#F4F5F7] text-[#7C7870] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[#EDEAE3]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Document Card ─────────────────────────────────────────────────────────────

function DocCard({ doc, view, onStar, onDelete, onSelect }: {
  doc: Document;
  view: "grid" | "list";
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (doc: Document) => void;
}) {
  const catCfg  = CATEGORY_CFG[doc.doc_category] || CATEGORY_CFG.Other;
  const fileCfg = FILE_TYPE_ICON[doc.file_type] || { icon: File, color: "text-[#A8A49C]" };
  const CatIcon = catCfg.icon;
  const FileIcon = fileCfg.icon;

  if (view === "list") {
    return (
      <tr className="hover:bg-[#FAFAF8] transition-colors group cursor-pointer" onClick={() => onSelect(doc)}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${catCfg.bg}`}>
              <FileIcon size={14} className={fileCfg.color} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#111] max-w-[260px] truncate">{doc.name}</p>
              <p className="text-[11px] text-[#A8A49C]">{doc.file_type.toUpperCase()} · {formatSize(doc.file_size_kb)}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catCfg.bg} ${catCfg.color}`}>
            {doc.doc_category}
          </span>
        </td>
        <td className="px-4 py-3 text-[12px] text-[#7C7870]">
          {doc.property_address || doc.contact_name || "—"}
        </td>
        <td className="px-4 py-3 text-[12px] text-[#7C7870]">{doc.uploader_name || "—"}</td>
        <td className="px-4 py-3 text-[12px] text-[#A8A49C]">{timeAgo(doc.created_at)}</td>
        <td className="px-4 py-3">
          {doc.is_private
            ? <Lock size={13} className="text-amber-500" />
            : <Unlock size={13} className="text-[#C5BFB5]" />}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onStar(doc.id); }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${doc.starred ? "text-amber-400" : "text-[#C5BFB5] hover:text-amber-400"}`}>
              <Star size={13} fill={doc.starred ? "#F59E0B" : "none"} />
            </button>
            <a href={doc.file_url} download onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-indigo-50 hover:text-indigo-600">
              <Download size={13} />
            </a>
            <button onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600">
              <Trash2 size={13} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group cursor-pointer p-4"
      onClick={() => onSelect(doc)}>
      {/* Top */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${catCfg.bg}`}>
          <FileIcon size={20} className={fileCfg.color} />
        </div>
        <div className="flex items-center gap-1">
          {doc.is_private && <Lock size={12} className="text-amber-500" />}
          <button onClick={(e) => { e.stopPropagation(); onStar(doc.id); }}
            className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${doc.starred ? "text-amber-400" : "text-[#D1CDC8] hover:text-amber-400"}`}>
            <Star size={13} fill={doc.starred ? "#F59E0B" : "none"} />
          </button>
        </div>
      </div>

      {/* Name */}
      <p className="text-[13px] font-bold text-[#111] line-clamp-2 mb-1 leading-tight">{doc.name}</p>

      {/* Category badge */}
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catCfg.bg} ${catCfg.color}`}>
        {doc.doc_category}
      </span>

      {/* Meta */}
      <div className="mt-3 pt-3 border-t border-[#F0EDE6] space-y-1.5">
        {(doc.property_address || doc.contact_name) && (
          <p className="text-[11px] text-[#A8A49C] truncate flex items-center gap-1">
            {doc.property_address
              ? <><Building2 size={10} />{doc.property_address}</>
              : <><User size={10} />{doc.contact_name}</>}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-[#C5BFB5]">{doc.file_type.toUpperCase()} · {formatSize(doc.file_size_kb)}</p>
          <p className="text-[10px] text-[#C5BFB5]">{timeAgo(doc.created_at)}</p>
        </div>
      </div>

      {/* Hover actions */}
      <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <a href={doc.file_url} download onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-1 bg-[#F4F5F7] hover:bg-indigo-50 hover:text-indigo-600 text-[#7C7870] text-[11px] font-semibold py-1.5 rounded-lg transition-colors">
          <Download size={11} /> Download
        </a>
        <button onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
          className="w-8 flex items-center justify-center text-[#A8A49C] hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const [docs, setDocs]         = useState<Document[]>(MOCK_DOCS);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter]     = useState("All");
  const [privFilter, setPrivFilter]   = useState("All");
  const [view, setView]         = useState<"grid"|"list">("grid");
  const [sortBy, setSortBy]     = useState<"newest"|"oldest"|"name"|"size">("newest");
  const [showUpload, setShowUpload]   = useState(false);
  const [selected, setSelected] = useState<Document | null>(null);

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) setDocs(data as Document[]);
    setLoading(false);
  };

  const handleUpload = (doc: Partial<Document>) => {
    const newDoc: Document = {
      ...doc as Document,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      starred: false,
    };
    setDocs((prev) => [newDoc, ...prev]);
    setShowUpload(false);
  };

  const handleStar = (id: string) => {
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, starred: !d.starred } : d));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("documents").delete().eq("id", id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  // Filter + sort
  const filtered = docs
    .filter((d) => {
      const s = search.toLowerCase();
      const matchSearch =
        d.name.toLowerCase().includes(s) ||
        (d.property_address || "").toLowerCase().includes(s) ||
        (d.contact_name || "").toLowerCase().includes(s) ||
        (d.uploader_name || "").toLowerCase().includes(s);
      const matchCat  = catFilter === "All"     || d.doc_category === catFilter;
      const matchPriv = privFilter === "All"
        ? true : privFilter === "Private" ? d.is_private : !d.is_private;
      return matchSearch && matchCat && matchPriv;
    })
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "name")   return a.name.localeCompare(b.name);
      if (sortBy === "size")   return b.file_size_kb - a.file_size_kb;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Storage stats
  const totalSizeKb = docs.reduce((s, d) => s + d.file_size_kb, 0);
  const byCat       = CATEGORIES.map((c) => ({
    cat: c,
    count: docs.filter((d) => d.doc_category === c).length,
  })).filter((x) => x.count > 0);

  const starredDocs = docs.filter((d) => d.starred);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Document Vault</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Documents</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-[#111] hover:bg-[#222] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <Upload size={15} /> Upload Document
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[220px] min-w-[220px] border-r border-[#E8E6E0] bg-white p-4 overflow-y-auto space-y-5">
          {/* Storage */}
          <div>
            <p className="text-[10px] font-bold text-[#C5BFB5] uppercase tracking-widest mb-2">Storage</p>
            <div className="bg-[#F4F5F7] rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-semibold text-[#111]">{formatSize(totalSizeKb)}</span>
                <span className="text-[11px] text-[#A8A49C]">/ 5 GB</span>
              </div>
              <div className="h-2 bg-[#E8E6E0] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${Math.min((totalSizeKb / (5 * 1024 * 1024)) * 100, 100)}%` }} />
              </div>
              <p className="text-[10px] text-[#A8A49C] mt-1">{docs.length} files stored</p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[10px] font-bold text-[#C5BFB5] uppercase tracking-widest mb-2">Categories</p>
            <button onClick={() => setCatFilter("All")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-medium mb-0.5 transition-colors ${catFilter === "All" ? "bg-[#111] text-white" : "text-[#7C7870] hover:bg-[#F4F5F7]"}`}>
              <span>All Files</span>
              <span className="text-[10px]">{docs.length}</span>
            </button>
            {byCat.map(({ cat, count }) => {
              const cfg = CATEGORY_CFG[cat];
              const Icon = cfg.icon;
              return (
                <button key={cat} onClick={() => setCatFilter(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-medium mb-0.5 transition-colors ${catFilter === cat ? "bg-[#111] text-white" : "text-[#7C7870] hover:bg-[#F4F5F7]"}`}>
                  <span className="flex items-center gap-2">
                    <Icon size={12} className={catFilter === cat ? "text-white" : cfg.color} />
                    {cat}
                  </span>
                  <span className="text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Starred */}
          {starredDocs.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-[#C5BFB5] uppercase tracking-widest mb-2">Starred</p>
              <div className="space-y-1">
                {starredDocs.slice(0, 4).map((d) => (
                  <button key={d.id} onClick={() => setSelected(d)}
                    className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-medium text-[#7C7870] hover:bg-[#F4F5F7] transition-colors flex items-center gap-2">
                    <Star size={10} fill="#F59E0B" className="text-amber-400 shrink-0" />
                    <span className="truncate">{d.name.split(".")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] p-3 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
              <Search size={13} className="text-[#A8A49C] shrink-0" />
              <input type="text" placeholder="Search documents..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
            </div>

            <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
              {["All","Public","Private"].map((p) => (
                <button key={p} onClick={() => setPrivFilter(p)}
                  className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${privFilter === p ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                  {p}
                </button>
              ))}
            </div>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-[#F4F5F7] border-0 rounded-xl px-3 py-2 text-[12px] font-medium text-[#7C7870] outline-none">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A–Z</option>
              <option value="size">Largest First</option>
            </select>

            <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1 ml-auto">
              <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg ${view==="grid" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}><Grid3X3 size={14} /></button>
              <button onClick={() => setView("list")} className={`p-1.5 rounded-lg ${view==="list" ? "bg-white shadow-sm text-[#111]" : "text-[#A8A49C]"}`}><List size={14} /></button>
            </div>
          </div>

          <p className="text-[13px] text-[#A8A49C]">
            <span className="font-semibold text-[#111]">{filtered.length}</span> documents · {formatSize(filtered.reduce((s, d) => s + d.file_size_kb, 0))} total
          </p>

          {/* Grid view */}
          {view === "grid" && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((doc) => (
                <DocCard key={doc.id} doc={doc} view="grid" onStar={handleStar} onDelete={handleDelete} onSelect={setSelected} />
              ))}
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EDE6] bg-[#FAFAF8]">
                    {["Name","Category","Related To","Uploaded By","Date","Access",""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#A8A49C] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F9F8F6]">
                  {filtered.map((doc) => (
                    <DocCard key={doc.id} doc={doc} view="list" onStar={handleStar} onDelete={handleDelete} onSelect={setSelected} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#A8A49C] bg-white rounded-xl border border-[#E8E6E0]">
              <FolderOpen size={40} className="mx-auto mb-3 opacity-25" />
              <p className="text-[14px] font-medium">No documents found</p>
              <button onClick={() => setShowUpload(true)}
                className="mt-3 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700">
                Upload your first document →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Document detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F0EDE6] flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#111]">Document Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={14} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* File icon + name */}
              <div className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-xl border border-[#F0EDE6]">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${(CATEGORY_CFG[selected.doc_category] || CATEGORY_CFG.Other).bg}`}>
                  <FileText size={22} className={(FILE_TYPE_ICON[selected.file_type] || { color: "text-[#A8A49C]" }).color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#111] line-clamp-2">{selected.name}</p>
                  <p className="text-[11px] text-[#A8A49C] mt-0.5">
                    {selected.file_type.toUpperCase()} · {formatSize(selected.file_size_kb)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:"Category",   value:selected.doc_category           },
                  { label:"Access",     value:selected.is_private ? "Private 🔒" : "Public 🔓" },
                  { label:"Property",   value:selected.property_address        },
                  { label:"Contact",    value:selected.contact_name            },
                  { label:"Uploaded By",value:selected.uploader_name           },
                  { label:"Uploaded",   value:timeAgo(selected.created_at)     },
                ].map(({ label, value }) => value ? (
                  <div key={label}>
                    <p className="text-[10px] font-semibold text-[#A8A49C] uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-[13px] font-semibold text-[#111]">{value}</p>
                  </div>
                ) : null)}
              </div>

              <div className="flex gap-2 pt-1">
                <a href={selected.file_url} download
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors">
                  <Download size={14} /> Download
                </a>
                <button onClick={() => handleStar(selected.id)}
                  className={`flex-1 flex items-center justify-center gap-2 border text-[13px] font-semibold py-2.5 rounded-xl transition-colors ${
                    selected.starred ? "border-amber-300 bg-amber-50 text-amber-600" : "border-[#E8E6E0] text-[#7C7870] hover:bg-[#F4F5F7]"
                  }`}>
                  <Star size={14} fill={selected.starred ? "#F59E0B" : "none"} />
                  {selected.starred ? "Starred" : "Star"}
                </button>
                <button onClick={() => handleDelete(selected.id)}
                  className="w-11 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}
    </div>
  );
}