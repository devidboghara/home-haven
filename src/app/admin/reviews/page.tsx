"use client";

import { useEffect, useState } from "react";
import {
  Star, Search, Filter, Plus, ThumbsUp, ThumbsDown,
  MessageSquare, TrendingUp, Award, CheckCircle2,
  Clock, X, ChevronDown, Flag, Reply, MoreHorizontal,
  Building2, User, UserCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_type: "Buyer" | "Seller" | "Tenant" | "Investor";
  reviewer_initials: string;
  avatar_color: string;
  rating: number;
  title: string;
  body: string;
  agent_name: string;
  property_address: string;
  category: "Agent" | "Property" | "Process" | "Overall";
  status: "Published" | "Pending" | "Flagged" | "Hidden";
  helpful_count: number;
  created_at: string;
  reply?: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  Published: { color: "text-emerald-700", bg: "bg-emerald-100" },
  Pending:   { color: "text-amber-700",   bg: "bg-amber-100"   },
  Flagged:   { color: "text-rose-700",    bg: "bg-rose-100"    },
  Hidden:    { color: "text-slate-500",   bg: "bg-slate-100"   },
};

const CATEGORY_CFG: Record<string, { color: string; bg: string }> = {
  Agent:    { color: "text-indigo-700", bg: "bg-indigo-100" },
  Property: { color: "text-violet-700", bg: "bg-violet-100" },
  Process:  { color: "text-blue-700",   bg: "bg-blue-100"   },
  Overall:  { color: "text-emerald-700",bg: "bg-emerald-100"},
};

const AVATAR_COLORS = [
  "bg-indigo-500","bg-violet-500","bg-emerald-500",
  "bg-amber-500","bg-rose-500","bg-teal-500","bg-orange-500",
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  { id:"r1",  reviewer_name:"Thomas Morrison",  reviewer_type:"Buyer",    reviewer_initials:"TM", avatar_color:"bg-indigo-500",  rating:5, title:"Exceptional service from start to finish!", body:"Sarah Kim was absolutely incredible throughout our entire home buying journey. She found us the perfect property at 42 Maple Street and negotiated an amazing deal. Her knowledge of the Toronto market is unmatched. We closed 2 weeks early!", agent_name:"Sarah Kim",    property_address:"42 Maple Street",    category:"Agent",    status:"Published", helpful_count:14, created_at:new Date(Date.now()-2*86400000).toISOString(),  reply:"Thank you Thomas! It was a pleasure working with you and your family. Wishing you all the best in your new home!"   },
  { id:"r2",  reviewer_name:"Aisha Patel",      reviewer_type:"Investor", reviewer_initials:"AP", avatar_color:"bg-emerald-500", rating:5, title:"Best real estate team in Vancouver",        body:"I've worked with many real estate agencies across Canada and HomeHaven stands above all of them. Mike Roberts helped me close 3 deals this quarter. The process was seamless, communication was excellent, and the results spoke for themselves.", agent_name:"Mike Roberts",  property_address:"18 Lakeview Drive",  category:"Overall",  status:"Published", helpful_count:22, created_at:new Date(Date.now()-5*86400000).toISOString(),  reply:undefined },
  { id:"r3",  reviewer_name:"Marcus Reid",      reviewer_type:"Buyer",    reviewer_initials:"MR", avatar_color:"bg-rose-500",    rating:4, title:"Great experience as a first-time buyer",    body:"Nina Torres made the entire process so easy to understand. She was patient with all my questions and helped me navigate the paperwork. The only reason I'm not giving 5 stars is because the closing took slightly longer than expected, but overall a fantastic experience.", agent_name:"Nina Torres",   property_address:"5 Birchwood Court",  category:"Process",  status:"Published", helpful_count:8,  created_at:new Date(Date.now()-7*86400000).toISOString(),  reply:"Thank you Marcus! Congratulations on your first home, we are so proud of you!"  },
  { id:"r4",  reviewer_name:"Linda Cheng",      reviewer_type:"Buyer",    reviewer_initials:"LC", avatar_color:"bg-amber-500",   rating:3, title:"Good service but communication could improve", body:"The property itself at Harbor Blvd was great and James Liu was knowledgeable. However I found communication to be slow at times — sometimes waiting 2 days for a response. The deal ultimately fell through which was disappointing. Would consider using them again though.", agent_name:"James Liu",     property_address:"93 Harbor Blvd",     category:"Agent",    status:"Pending",   helpful_count:3,  created_at:new Date(Date.now()-1*86400000).toISOString(),  reply:undefined },
  { id:"r5",  reviewer_name:"Carlos Mendez",    reviewer_type:"Investor", reviewer_initials:"CM", avatar_color:"bg-orange-500",  rating:5, title:"Closed 5 deals this year with HomeHaven",   body:"As a real estate investor I need a team that moves fast and thinks strategically. Priya Sharma has been that agent for me. She understands wholesale deals, knows how to negotiate, and always has off-market opportunities lined up. Highly recommend for serious investors.", agent_name:"Priya Sharma",  property_address:"34 Cedar Hills Dr",  category:"Agent",    status:"Published", helpful_count:31, created_at:new Date(Date.now()-10*86400000).toISOString(), reply:"Carlos it has been an absolute pleasure! Here is to many more deals together!"  },
  { id:"r6",  reviewer_name:"Sophie Martin",    reviewer_type:"Tenant",   reviewer_initials:"SM", avatar_color:"bg-teal-500",    rating:2, title:"Below expectations for property management",  body:"While the initial rental process was smooth the maintenance response time has been very slow. It took over 3 weeks to fix a plumbing issue that I reported. The property itself is nice but the after-service needs significant improvement.", agent_name:"Mike Roberts",  property_address:"66 Willow Creek Rd", category:"Process",  status:"Flagged",   helpful_count:6,  created_at:new Date(Date.now()-3*86400000).toISOString(),  reply:undefined },
  { id:"r7",  reviewer_name:"Derek Walsh",      reviewer_type:"Seller",   reviewer_initials:"DW", avatar_color:"bg-violet-500",  rating:4, title:"Sold my property quickly and at asking price", body:"I was nervous about selling my home in Calgary but Priya made the process stress-free. She priced it right from day one and we had multiple offers within the first week. Final sale was at asking price which I was thrilled about. Would recommend!", agent_name:"Priya Sharma",  property_address:"7 Pine Avenue",      category:"Property", status:"Published", helpful_count:11, created_at:new Date(Date.now()-14*86400000).toISOString(), reply:undefined },
  { id:"r8",  reviewer_name:"Fatima Hassan",    reviewer_type:"Investor", reviewer_initials:"FH", avatar_color:"bg-rose-500",    rating:5, title:"Professional and knowledgeable team",        body:"HomeHaven has been my go-to for all investment properties in Winnipeg. The team understands the local market deeply and always provides solid ROI analysis before I make any decisions. Four deals closed this year alone.", agent_name:"Sarah Kim",    property_address:"Various Properties", category:"Overall",  status:"Published", helpful_count:18, created_at:new Date(Date.now()-20*86400000).toISOString(), reply:"Fatima we love working with you! Thank you for your continued trust in our team." },
];

// ── Star Rating Component ─────────────────────────────────────────────────────

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= rating ? "#F59E0B" : "none"}
          className={s <= rating ? "text-amber-400" : "text-[#D1D5DB]"}
        />
      ))}
    </div>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  onStatusChange,
  onReply,
}: {
  review: Review;
  onStatusChange: (id: string, status: string) => void;
  onReply: (review: Review) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CFG[review.status] || STATUS_CFG.Pending;
  const catCfg    = CATEGORY_CFG[review.category] || CATEGORY_CFG.Overall;
  const bodyPreview = review.body.slice(0, 120) + (review.body.length > 120 ? "..." : "");

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition-all hover:shadow-md ${
      review.status === "Flagged" ? "border-rose-200" : "border-[#E8E6E0] hover:border-indigo-200"
    }`}>
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${review.avatar_color} flex items-center justify-center text-white text-[12px] font-bold shrink-0`}>
              {review.reviewer_initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-bold text-[#111]">{review.reviewer_name}</p>
                <span className="text-[10px] font-semibold text-[#A8A49C] bg-[#F4F5F7] px-2 py-0.5 rounded-md border border-[#E8E6E0]">
                  {review.reviewer_type}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.rating} size={12} />
                <span className="text-[11px] text-[#A8A49C]">
                  {new Date(review.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catCfg.bg} ${catCfg.color}`}>
              {review.category}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
              {review.status}
            </span>
            <div className="relative group">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A8A49C] hover:bg-[#F4F5F7]">
                <MoreHorizontal size={14} />
              </button>
              <div className="absolute right-0 top-8 bg-white border border-[#E8E6E0] rounded-xl shadow-lg z-10 p-1.5 w-40 hidden group-hover:block">
                {["Published","Pending","Hidden","Flagged"].map((s) => (
                  <button key={s} onClick={() => onStatusChange(review.id, s)}
                    className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-[#7C7870] hover:bg-[#F4F5F7] rounded-lg transition-colors">
                    Set {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-bold text-[#111] mb-1.5">{review.title}</h3>

        {/* Body */}
        <p className="text-[13px] text-[#7C7870] leading-relaxed">
          {expanded ? review.body : bodyPreview}
        </p>
        {review.body.length > 120 && (
          <button onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 mt-1">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Property + Agent */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F0EDE6]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8A49C]">
            <Building2 size={11} />
            <span>{review.property_address}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8A49C]">
            <UserCheck size={11} />
            <span>{review.agent_name}</span>
          </div>
        </div>

        {/* Reply */}
        {review.reply && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-[#111] flex items-center justify-center text-white text-[9px] font-bold">HH</div>
              <span className="text-[11px] font-bold text-[#111]">HomeHaven Response</span>
            </div>
            <p className="text-[12px] text-indigo-800 leading-relaxed">{review.reply}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EDE6]">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-[#7C7870] hover:text-emerald-600 transition-colors">
              <ThumbsUp size={13} /> {review.helpful_count} helpful
            </button>
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-[#7C7870] hover:text-rose-500 transition-colors">
              <ThumbsDown size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {review.status === "Flagged" && (
              <button onClick={() => onStatusChange(review.id, "Hidden")}
                className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700">
                <Flag size={11} /> Flag reviewed
              </button>
            )}
            {!review.reply && (
              <button onClick={() => onReply(review)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
                <Reply size={11} /> Reply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reply Modal ───────────────────────────────────────────────────────────────

function ReplyModal({
  review,
  onClose,
  onSubmit,
}: {
  review: Review;
  onClose: () => void;
  onSubmit: (id: string, reply: string) => void;
}) {
  const [reply, setReply] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-[#F0EDE6] flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#111]">Reply to Review</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F5F7] text-[#A8A49C]"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          {/* Original review summary */}
          <div className="bg-[#FAFAF8] rounded-xl p-3 border border-[#F0EDE6]">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-6 h-6 rounded-full ${review.avatar_color} flex items-center justify-center text-white text-[9px] font-bold`}>
                {review.reviewer_initials}
              </div>
              <span className="text-[12px] font-semibold text-[#111]">{review.reviewer_name}</span>
              <StarRating rating={review.rating} size={11} />
            </div>
            <p className="text-[12px] text-[#7C7870] line-clamp-2">{review.body}</p>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#7C7870] uppercase tracking-wide mb-1">Your Response</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Write a professional, helpful response..."
              className="w-full bg-[#F4F5F7] border border-[#E8E6E0] rounded-xl px-3 py-2.5 text-[13px] text-[#111] outline-none focus:border-indigo-400 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { if (reply.trim()) onSubmit(review.id, reply); }}
              disabled={!reply.trim()}
              className="flex-1 bg-[#111] hover:bg-[#222] disabled:opacity-40 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
            >
              Post Reply
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const [reviews, setReviews]         = useState<Review[]>(MOCK_REVIEWS);
  const [search, setSearch]           = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy]           = useState<"newest"|"highest"|"lowest"|"helpful">("newest");
  const [replyTarget, setReplyTarget] = useState<Review | null>(null);

  const handleStatusChange = (id: string, status: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: status as Review["status"] } : r));
  };

  const handleReply = (id: string, reply: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, reply } : r));
    setReplyTarget(null);
  };

  // Filter + sort
  const filtered = reviews
    .filter((r) => {
      const s = search.toLowerCase();
      const matchSearch =
        r.reviewer_name.toLowerCase().includes(s) ||
        r.title.toLowerCase().includes(s) ||
        r.body.toLowerCase().includes(s) ||
        r.agent_name.toLowerCase().includes(s);
      const matchRating   = ratingFilter === 0 || r.rating === ratingFilter;
      const matchStatus   = statusFilter === "All"   || r.status   === statusFilter;
      const matchCategory = categoryFilter === "All" || r.category === categoryFilter;
      return matchSearch && matchRating && matchStatus && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest")  return a.rating - b.rating;
      if (sortBy === "helpful") return b.helpful_count - a.helpful_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Summary stats
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E8E6E0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] tracking-tight">Reviews</h1>
          <p className="text-[13px] text-[#A8A49C] mt-0.5">Dashboard › Reviews</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Star size={13} fill="#F59E0B" /> {avgRating} Average Rating
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Rating overview */}
          <div className="bg-white rounded-xl border border-[#E8E6E0] shadow-sm p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-[48px] font-bold text-[#111] tracking-tight leading-none">{avgRating}</p>
                <StarRating rating={Math.round(parseFloat(avgRating))} size={16} />
                <p className="text-[11px] text-[#A8A49C] mt-1">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingDist.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[11px] text-[#7C7870] w-4">{star}</span>
                    <Star size={10} fill="#F59E0B" className="text-amber-400 shrink-0" />
                    <div className="flex-1 h-2 bg-[#F0EDE6] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] text-[#A8A49C] w-4">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="xl:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Reviews",  value: reviews.length,                                            color: "bg-indigo-50 text-indigo-600"  },
              { label: "Published",      value: reviews.filter((r) => r.status === "Published").length,    color: "bg-emerald-50 text-emerald-600"},
              { label: "Pending Review", value: reviews.filter((r) => r.status === "Pending").length,      color: "bg-amber-50 text-amber-600"   },
              { label: "Flagged",        value: reviews.filter((r) => r.status === "Flagged").length,      color: "bg-rose-50 text-rose-600"     },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-xl p-4 ${color}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
                <p className="text-[26px] font-bold tracking-tight mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E8E6E0] p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 bg-[#F4F5F7] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-[#A8A49C] shrink-0" />
            <input type="text" placeholder="Search reviewer, title, agent..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#111] placeholder-[#C5BFB5] outline-none w-full" />
          </div>

          {/* Star filter */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            <button onClick={() => setRatingFilter(0)}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${ratingFilter === 0 ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
              All Stars
            </button>
            {[5,4,3,2,1].map((s) => (
              <button key={s} onClick={() => setRatingFilter(ratingFilter === s ? 0 : s)}
                className={`flex items-center gap-0.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${ratingFilter === s ? "bg-white text-amber-500 shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                <Star size={10} fill={ratingFilter === s ? "#F59E0B" : "none"} className={ratingFilter === s ? "text-amber-400" : "text-[#C5BFB5]"} />
                {s}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Published","Pending","Flagged","Hidden"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${statusFilter === s ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] rounded-xl p-1">
            {["All","Agent","Property","Process","Overall"].map((c) => (
              <button key={c} onClick={() => setCategoryFilter(c)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${categoryFilter === c ? "bg-white text-[#111] shadow-sm" : "text-[#7C7870] hover:text-[#111]"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[#F4F5F7] border-0 rounded-xl px-3 py-2 text-[12px] font-medium text-[#7C7870] outline-none ml-auto"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-[13px] text-[#A8A49C]">
          Showing <span className="font-semibold text-[#111]">{filtered.length}</span> reviews
        </p>

        {/* Reviews list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#A8A49C] bg-white rounded-xl border border-[#E8E6E0]">
              <Star size={36} className="mx-auto mb-3 opacity-25" />
              <p className="text-[14px] font-medium">No reviews found</p>
            </div>
          ) : (
            filtered.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onStatusChange={handleStatusChange}
                onReply={setReplyTarget}
              />
            ))
          )}
        </div>
      </div>

      {replyTarget && (
        <ReplyModal
          review={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSubmit={handleReply}
        />
      )}
    </div>
  );
}