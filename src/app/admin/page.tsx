"use client";

const columns = [
  { title: "New", color: "border-purple-300" },
  { title: "Viewing Scheduled", color: "border-orange-300" },
  { title: "Negotiation", color: "border-blue-300" },
  { title: "Legal & Documentation", color: "border-green-300" },
];

export default function AdminPage() {
  return (
    <div>

      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-6">Deals pipeline</h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <Stat title="Total Asset Volume" value="24.5M AED" />
        <Stat title="Commission" value="490K AED" />
        <Stat title="Viewings Booked" value="20" />
        <Stat title="Win Rate" value="12%" />

      </div>

      {/* BOARD */}
      <div className="grid grid-cols-4 gap-6">

        {columns.map((col, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl p-4 border ${col.color}`}
          >
            <h3 className="text-sm font-semibold mb-4">{col.title}</h3>

            <div className="space-y-4">

              <Card />
              <Card />

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white border border-[#e5e7eb] p-4 rounded-xl">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-lg font-semibold mt-1">{value}</h2>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-3">

      <div className="flex gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded-md"></div>

        <div>
          <p className="text-xs text-gray-500">
            3-bedroom in UAE — Apartment
          </p>
          <p className="text-sm font-semibold mt-1">
            2,450,000 AED
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-3">
        Client: James O’Connor
      </div>
    </div>
  );
}