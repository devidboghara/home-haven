"use client";

const columns = [
  {
    title: "New",
    count: 14,
    color: "border-purple-300",
  },
  {
    title: "Viewing Scheduled",
    count: 1,
    color: "border-orange-300",
  },
  {
    title: "Negotiation",
    count: 6,
    color: "border-blue-300",
  },
  {
    title: "Legal & Documentation",
    count: 1,
    color: "border-green-300",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-6">Deals pipeline</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Asset Volume" value="24.5M AED" />
        <StatCard title="Commission" value="490K AED" />
        <StatCard title="Viewings Booked" value="20" />
      </div>

      {/* BOARD */}
      <div className="grid grid-cols-4 gap-6">
        {columns.map((col, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl p-4 border ${col.color}`}
          >
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-sm">
                {col.title} ({col.count})
              </h3>
            </div>

            {/* CARD */}
            <div className="space-y-4">
              <DealCard />
              <DealCard />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-lg font-semibold mt-1">{value}</h2>
    </div>
  );
}

function DealCard() {
  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded-md"></div>

        <div className="flex-1">
          <p className="text-xs text-gray-500">
            3-bedroom apartment in UAE
          </p>
          <h4 className="font-semibold text-sm mt-1">
            2,450,000 AED
          </h4>
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-3">
        Client: James O’Connor
      </div>
    </div>
  );
}