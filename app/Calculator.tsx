<Analytics history={history} />
'use client';
import { useState, useMemo, useEffect } from 'react';

const INDUSTRIES = {
    'Delivery': { label: 'Delivery (Uber/DoorDash)' },
    'Rideshare': { label: 'Rideshare (Uber/Lyft)' },
    'Freelance': { label: 'Freelance (Software/Design)' },
    'Consulting': { label: 'Consulting/Professional' },
    'Handyman': { label: 'Handyman/Home Services' },
    'PetCare': { label: 'Pet Care' },
    'Ecommerce': { label: 'E-Commerce (Amazon/Etsy)' },
    'NailTech': { label: 'Nail Technician' },
    'Cleaning': { label: 'Cleaning Services' },
    'Tutoring': { label: 'Tutoring/Teaching' },
    'Photography': { label: 'Photography/Video' },
    'PersonalTraining': { label: 'Personal Training' }
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const STATE_TAX_RATES: { [key: string]: number } = {
    "AL": 0.05, "AK": 0.00, "AZ": 0.025, "AR": 0.044, "CA": 0.08, "CO": 0.044, "CT": 0.05, "DE": 0.066, "FL": 0.00, "GA": 0.055,
    "HI": 0.08, "ID": 0.058, "IL": 0.0495, "IN": 0.03, "IA": 0.057, "KS": 0.057, "KY": 0.04, "LA": 0.0425, "ME": 0.07, "MD": 0.05,
    "MA": 0.05, "MI": 0.0425, "MN": 0.098, "MS": 0.047, "MO": 0.048, "MT": 0.06, "NE": 0.058, "NV": 0.00, "NH": 0.00, "NJ": 0.08,
    "NM": 0.047, "NY": 0.065, "NC": 0.045, "ND": 0.025, "OH": 0.03, "OK": 0.047, "OR": 0.087, "PA": 0.03, "RI": 0.059, "SC": 0.065,
    "SD": 0.00, "TN": 0.00, "TX": 0.00, "UT": 0.046, "VT": 0.087, "VA": 0.05, "WA": 0.00, "WV": 0.065, "WI": 0.076, "WY": 0.00
};

const FEDERAL_TAX_RATE = 0.253;

export default function Calculator() {
  const [industry, setIndustry] = useState('Delivery');
  const [selectedState, setSelectedState] = useState('FL');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [weeklyData, setWeeklyData] = useState<any>({ Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' });
  const [expenseList, setExpenseList] = useState<any[]>([]);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  
  // States
  const [miles, setMiles] = useState('0');
  const [gasPrice, setGasPrice] = useState('3.50');
  const [mpg, setMpg] = useState('25');
  const [commissionRate, setCommissionRate] = useState('10'); // Nail Tech için
  
  const [totalHours, setTotalHours] = useState('0');
  const [cogs, setCogs] = useState('0');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gig_final_v8');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch (e) { setHistory([]); } }
  }, []);

  const addExpense = () => {
    if (!newDesc || !newAmount) return;
    setExpenseList([...expenseList, { id: Date.now(), desc: newDesc, amount: newAmount }]);
    setNewDesc('');
    setNewAmount('');
  };

  const removeExpense = (id: number) => {
    setExpenseList(expenseList.filter(e => e.id !== id));
  };

  const calc = useMemo(() => {
    const totalGross = Object.values(weeklyData).reduce((a: any, b: any) => a + Number(b || 0), 0);
    const m = Number(miles || 0);
    const h = Number(totalHours || 1);
    const isNailTech = industry === 'NailTech';
    
    // Nail Tech için özel hesaplama
    let commissionAmt = 0;
    let fuelCost = 0;
    let irsDeduction = 0;

    if (isNailTech) {
        commissionAmt = totalGross * (Number(commissionRate) / 100);
    } else {
        const drivingIndustries = ['Delivery', 'Rideshare', 'Handyman', 'PetCare', 'Cleaning', 'Photography'];
        fuelCost = drivingIndustries.includes(industry) ? (m / (Number(mpg) || 1)) * Number(gasPrice) : 0;
        irsDeduction = m * 0.67;
    }
    
    const manualExpenses = expenseList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const costOfGoods = industry === 'Ecommerce' ? Number(cogs) : 0;
    
    // Vergi matrahı
    const taxableIncome = Math.max(0, totalGross - irsDeduction - manualExpenses - costOfGoods - commissionAmt);
    const fedTax = taxableIncome * FEDERAL_TAX_RATE;
    const stateTax = taxableIncome * (STATE_TAX_RATES[selectedState] || 0);
    const totalTax = fedTax + stateTax;
    
    // Net Kazanç
    const estimatedNet = totalGross - fuelCost - manualExpenses - totalTax - costOfGoods - commissionAmt;
    
    return { totalGross, fuelCost, irsDeduction, manualExpenses, estimatedNet, totalTax, fedTax, stateTax, hourlyRate: totalGross / (h || 1), commissionAmt };
  }, [weeklyData, miles, gasPrice, mpg, selectedState, industry, expenseList, totalHours, cogs, commissionRate]);

  const handleSave = () => {
    const entry = { id: Date.now(), month: selectedMonth, industry, gross: calc.totalGross, net: calc.estimatedNet, tax: calc.totalTax };
    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem('gig_final_v8', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0f172a] text-zinc-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">MASTER PRO TRACKER</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
            <label className="text-[10px] text-zinc-500 uppercase">Industry</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-[#1e293b] p-3 rounded-xl border border-blue-900 font-bold">{Object.keys(INDUSTRIES).map(i => <option key={i} value={i}>{INDUSTRIES[i as keyof typeof INDUSTRIES].label}</option>)}</select>
        </div>
        <div>
            <label className="text-[10px] text-zinc-500 uppercase">State</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full bg-[#1e293b] p-3 rounded-xl border border-blue-900 font-bold">{Object.keys(STATE_TAX_RATES).map(s => <option key={s} value={s}>{s}</option>)}</select>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1 mb-6 items-end">
        <div>
            <label className="text-[8px] text-zinc-500 uppercase text-center block">Month</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full bg-[#1e293b] p-2 rounded text-center text-xs border border-blue-900/50">{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select>
        </div>
        {Object.keys(weeklyData).map((d) => (
            <div key={d} className="flex flex-col">
                <label className="text-[8px] text-zinc-500 uppercase text-center">{d}</label>
                <input type="number" className="bg-[#1e293b] p-2 rounded text-center text-sm" value={weeklyData[d]} onChange={(e) => setWeeklyData({...weeklyData, [d]: e.target.value})} />
            </div>
        ))}
      </div>

      {/* DİNAMİK GİRİŞ ALANI (NAIL TECH İSE KOMİSYON, DEĞİLSE MİL) */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {industry === 'NailTech' ? (
             <div className="col-span-4"><label className="text-[10px] text-zinc-500 uppercase">Commission Rate (%)</label><input type="number" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} className="w-full bg-[#1e293b] p-2 rounded text-sm" /></div>
        ) : (
            <>
                <div><label className="text-[10px] text-zinc-500 uppercase">Miles</label><input type="number" value={miles} onChange={(e) => setMiles(e.target.value)} className="w-full bg-[#1e293b] p-2 rounded text-sm" /></div>
                <div><label className="text-[10px] text-zinc-500 uppercase">Gas $</label><input type="number" value={gasPrice} onChange={(e) => setGasPrice(e.target.value)} className="w-full bg-[#1e293b] p-2 rounded text-sm" /></div>
                <div><label className="text-[10px] text-zinc-500 uppercase">MPG</label><input type="number" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full bg-[#1e293b] p-2 rounded text-sm" /></div>
            </>
        )}
        <div><label className="text-[10px] text-zinc-500 uppercase">Hours</label><input type="number" value={totalHours} onChange={(e) => setTotalHours(e.target.value)} className="w-full bg-[#1e293b] p-2 rounded text-sm" /></div>
      </div>

      <div className="mb-6 bg-[#1e293b] p-4 rounded-xl border border-blue-900/50">
        <label className="text-[10px] text-zinc-500 uppercase block mb-2">Expenses</label>
        <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="flex-1 bg-[#0f172a] p-2 rounded text-sm border border-blue-900" />
            <input type="number" placeholder="$" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-20 bg-[#0f172a] p-2 rounded text-sm border border-blue-900" />
            <button onClick={addExpense} className="bg-blue-600 px-4 rounded font-bold">+</button>
        </div>
        <div className="space-y-1">
            {expenseList.map(exp => (
                <div key={exp.id} className="flex justify-between text-[10px] bg-[#0f172a] p-2 rounded border border-blue-900/30">
                    <span>{exp.desc}</span>
                    <div className="flex gap-2">
                        <span>${exp.amount}</span>
                        <button onClick={() => removeExpense(exp.id)} className="text-rose-400">x</button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-[#1e293b] border border-blue-900 rounded-xl p-6 mb-6">
        <div className="text-zinc-500 text-xs uppercase font-bold">Estimated Net Income</div>
        <div className="text-5xl font-black text-emerald-400 mb-6">${calc.estimatedNet.toFixed(2)}</div>
        
        <div className="space-y-3 text-sm border-t border-blue-900/30 pt-4">
            <div className="flex justify-between"><span>Hourly Rate</span> <span className="font-bold text-cyan-400">${calc.hourlyRate.toFixed(2)}/hr</span></div>
            {industry === 'NailTech' ? (
                <div className="flex justify-between"><span>Commission Deducted</span> <span className="font-bold text-rose-400">-${calc.commissionAmt.toFixed(2)}</span></div>
            ) : (
                <div className="flex justify-between"><span>IRS Tax Deduction</span> <span className="font-bold text-emerald-500">+${calc.irsDeduction.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between"><span>Federal Tax</span> <span className="font-bold text-rose-400">-${calc.fedTax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>State Tax ({selectedState})</span> <span className="font-bold text-rose-400">-${calc.stateTax.toFixed(2)}</span></div>
        </div>
      </div>

      <button onClick={handleSave} className="w-full bg-blue-600 py-3 rounded-xl font-bold mb-6 hover:bg-blue-700">SAVE TO ARCHIVE</button>

      <div className="space-y-4">
        <h3 className="font-bold text-blue-300 uppercase text-xs">History for {selectedMonth}</h3>
        {history.filter(h => h.month === selectedMonth).map((h: any) => (
            <div key={h.id} className="bg-[#1e293b] p-4 rounded-xl border border-blue-900/30 flex justify-between">
                <span className="font-bold text-zinc-300">{h.industry}</span>
                <span className="text-emerald-400 font-bold">Net: ${h.net.toFixed(0)}</span>
                <span className="text-rose-400">Tax: ${(h.tax || 0).toFixed(0)}</span>
            </div>
        ))}
      </div>
    </div>
  );
}