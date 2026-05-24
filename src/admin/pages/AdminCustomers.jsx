import { Search, Mail, Phone, Calendar } from "lucide-react";

function AdminCustomers() {
  const customers = [
    { id: "C-209", name: "Sophia Sterling", email: "sophia@sterling.com", phone: "+94 77 000 0000", joined: "May 04, 2026", orders: 4, spent: "Rs. 38,500" },
    { id: "C-208", name: "Julian Mercer", email: "julian.mercer@gmail.com", phone: "+94 77 000 0001", joined: "Apr 28, 2026", orders: 2, spent: "Rs. 24,000" },
    { id: "C-207", name: "Clara Hawthorne", email: "clara.h@hawthorne.io", phone: "+94 77 000 0002", joined: "Apr 15, 2026", orders: 6, spent: "Rs. 42,800" },
    { id: "C-206", name: "Oliver Vance", email: "oliver@vance.net", phone: "+94 77 000 0003", joined: "Mar 30, 2026", orders: 1, spent: "Rs. 9,800" },
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex justify-between items-center pb-6 border-b border-neutral-900">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            CRM Directory
          </span>
          <h1 className="text-xl md:text-2xl font-light uppercase tracking-widest text-neutral-100">
            Registered Customers
          </h1>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center bg-[#111] border border-neutral-900 px-4 py-3 max-w-md rounded-full">
        <Search className="w-4.5 h-4.5 text-neutral-500 mr-2.5" />
        <input
          type="text"
          placeholder="Filter customers by identity..."
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
                <th className="px-6 py-4.5">Client ID</th>
                <th className="px-6 py-4.5">Customer Name</th>
                <th className="px-6 py-4.5">Email</th>
                <th className="px-6 py-4.5">Phone Number</th>
                <th className="px-6 py-4.5">Joined Date</th>
                <th className="px-6 py-4.5 text-center">Orders Count</th>
                <th className="px-6 py-4.5 text-right">Total Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-xs font-light text-neutral-300">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4.5 font-mono text-neutral-400">{c.id}</td>
                  <td className="px-6 py-4.5 font-medium text-neutral-200">{c.name}</td>
                  <td className="px-6 py-4.5 text-neutral-400 flex items-center gap-1.5 py-5.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-600" /> {c.email}
                  </td>
                  <td className="px-6 py-4.5 text-neutral-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-600" /> {c.phone}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-neutral-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-600" /> {c.joined}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-center text-neutral-200 font-medium">{c.orders}</td>
                  <td className="px-6 py-4.5 text-right text-neutral-200 font-semibold">{c.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCustomers;
