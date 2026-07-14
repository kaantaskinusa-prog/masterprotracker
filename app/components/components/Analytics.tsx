'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

export default function Analytics({ history }: { history: any[] }) {
  
  // Excel'e Aktarma Fonksiyonu
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(history);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GelirGider");
    XLSX.writeFile(wb, "MasterPro_Rapor.xlsx");
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-blue-900 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-cyan-400">Analizler & Raporlar</h2>
        <button 
          onClick={exportToExcel}
          className="bg-emerald-600 text-xs px-4 py-2 rounded-lg font-bold hover:bg-emerald-700"
        >
          EXCEL'E AKTAR
        </button>
      </div>

      {/* Grafik */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={history.slice(0, 6).reverse()}>
            <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
            <Bar dataKey="net" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}