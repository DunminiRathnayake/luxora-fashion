import { BarChart3, TrendingUp, Compass, Target } from "lucide-react";

function AdminAnalytics() {
  const metrics = [
    { title: "Average Order Value", value: "Rs. 9,450", change: "+4.2% vs last month" },
    { title: "Conversion Ratio", value: "3.24%", change: "+0.18% vs last month" },
    { title: "Traffic Visitors", value: "14,820", change: "+12.5% vs last month" },
    { title: "Abandonment Rate", value: "54.12%", change: "-2.4% vs last month" },
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex justify-between items-center pb-6 border-b border-neutral-900">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            Data Room
          </span>
          <h1 className="text-xl md:text-2xl font-light uppercase tracking-widest text-neutral-100">
            Advanced Analytics
          </h1>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.title} className="bg-[#111] border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-800 transition-colors">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block mb-4">{m.title}</span>
            <div>
              <h3 className="text-2xl font-light tracking-tight text-white mb-2">{m.value}</h3>
              <p className="text-[10px] text-green-400 font-light uppercase tracking-wider">{m.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Analytics visual breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Share */}
        <div className="bg-[#111] border border-neutral-900 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-light uppercase tracking-widest text-neutral-200">Catalog Conversion Share</h2>
            <Compass className="w-4 h-4 text-neutral-500" />
          </div>

          <div className="space-y-4">
            {[
              { category: "Dresses", percent: 45 },
              { category: "Blazers", percent: 25 },
              { category: "Tops", percent: 18 },
              { category: "Evening Wear", percent: 12 },
            ].map((c) => (
              <div key={c.category} className="space-y-2">
                <div className="flex justify-between text-xs font-light text-neutral-300">
                  <span>{c.category}</span>
                  <span className="font-semibold text-white">{c.percent}%</span>
                </div>
                <div className="w-full bg-[#0C0C0C] h-1 rounded-full overflow-hidden">
                  <div className="bg-white h-full" style={{ width: `${c.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="bg-[#111] border border-neutral-900 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-light uppercase tracking-widest text-neutral-200">Funnel Performance</h2>
            <Target className="w-4 h-4 text-neutral-500" />
          </div>

          <div className="space-y-4">
            {[
              { stage: "Catalog Views", count: "14,820", percent: 100 },
              { stage: "Added to Bag", count: "2,350", percent: 15.8 },
              { stage: "Initiated Inquiry", count: "542", percent: 3.6 },
              { stage: "WhatsApp Confirmed", count: "142", percent: 0.95 },
            ].map((f) => (
              <div key={f.stage} className="space-y-2">
                <div className="flex justify-between text-xs font-light text-neutral-300">
                  <span>{f.stage} <span className="text-[10px] text-neutral-500">({f.count})</span></span>
                  <span className="font-semibold text-white">{f.percent}%</span>
                </div>
                <div className="w-full bg-[#0C0C0C] h-1 rounded-full overflow-hidden">
                  <div className="bg-white/70 h-full" style={{ width: `${f.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminAnalytics;
