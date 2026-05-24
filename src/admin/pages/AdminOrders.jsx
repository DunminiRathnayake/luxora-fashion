import { Search, Eye, ExternalLink } from "lucide-react";

function AdminOrders() {
  const orders = [
    { id: "LX-9082", customer: "Sophia Sterling", items: "Midnight Satin Dress (S) x1", status: "Completed", amount: "Rs. 8,500", date: "May 24, 2026", whatsapp: "+94770000000" },
    { id: "LX-9081", customer: "Julian Mercer", items: "Classic Black Blazer (M) x1", status: "In Route", amount: "Rs. 12,000", date: "May 23, 2026", whatsapp: "+94770000001" },
    { id: "LX-9080", customer: "Clara Hawthorne", items: "Elegant White Top (XS) x2", status: "Processing", amount: "Rs. 8,400", date: "May 22, 2026", whatsapp: "+94770000002" },
    { id: "LX-9079", customer: "Oliver Vance", items: "Chiffon Maxi Dress (L) x1", status: "Completed", amount: "Rs. 9,800", date: "May 21, 2026", whatsapp: "+94770000003" },
    { id: "LX-9078", customer: "Emily Vance", items: "Camel Tailored Blazer (S) x1", status: "Pending WhatsApp", amount: "Rs. 13,500", date: "May 20, 2026", whatsapp: "+94770000004" },
  ];

  return (
    <div className="space-y-8">
      {/* Title Block */}
      <div className="flex justify-between items-center pb-6 border-b border-neutral-900">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            Sales Monitor
          </span>
          <h1 className="text-xl md:text-2xl font-light uppercase tracking-widest text-neutral-100">
            Order Inquiries
          </h1>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center bg-[#111] border border-neutral-900 px-4 py-3 max-w-md rounded-full">
        <Search className="w-4.5 h-4.5 text-neutral-500 mr-2.5" />
        <input
          type="text"
          placeholder="Filter orders by ID or customer..."
          className="bg-transparent text-sm text-white focus:outline-none w-full font-light"
          disabled
        />
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-neutral-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-900 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold bg-[#161616]/40">
                <th className="px-6 py-4.5">Order ID</th>
                <th className="px-6 py-4.5">Date</th>
                <th className="px-6 py-4.5">Customer</th>
                <th className="px-6 py-4.5">Items Ordered</th>
                <th className="px-6 py-4.5">Total Bill</th>
                <th className="px-6 py-4.5">Workflow Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-xs font-light text-neutral-300">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-900/30 transition-colors group">
                  <td className="px-6 py-4.5 font-mono text-neutral-200">{o.id}</td>
                  <td className="px-6 py-4.5 text-neutral-400">{o.date}</td>
                  <td className="px-6 py-4.5">
                    <div>
                      <div className="font-medium text-neutral-200">{o.customer}</div>
                      <div className="text-[10px] text-neutral-500">{o.whatsapp}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-neutral-300 truncate max-w-[200px]" title={o.items}>{o.items}</td>
                  <td className="px-6 py-4.5 text-neutral-200 font-medium">{o.amount}</td>
                  <td className="px-6 py-4.5">
                    <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold rounded-full border ${
                      o.status === "Completed"
                        ? "bg-green-950/20 text-green-400 border-green-900/40"
                        : o.status === "Processing" || o.status === "In Route"
                        ? "bg-neutral-800/40 text-neutral-400 border-neutral-800"
                        : "bg-amber-950/20 text-amber-400 border-amber-900/40"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => window.open(`https://wa.me/${o.whatsapp.replace("+", "")}`, "_blank")}
                        title="Chat on WhatsApp"
                        className="p-2 text-neutral-500 hover:text-green-400 hover:bg-green-950/20 rounded transition-all cursor-pointer inline-flex"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded transition-all cursor-pointer inline-flex">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
