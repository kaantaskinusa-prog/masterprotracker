'use client';
import { useState, useMemo, useEffect } from 'react';

// --- SABİTLER (Hiçbiri silinmedi) ---
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

const CATEGORIES = ['Benzin', 'Yemek', 'Kira', 'Ekipman', 'Eğlence', 'Diğer']; // YENİ: Kategori listesi

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
  
  // Gider yönetimi
  const [expenseList, setExpenseList] = useState<any[]>([]);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]); // Yeni: Kategori state'i
  
  // Diğer veriler
  const [miles, setMiles] = useState('0');
  const [gasPrice, setGasPrice] = useState('3.50');
  const [mpg, setMpg] = useState('25');
  const [commissionRate, setCommissionRate] = useState('10');
  const [totalHours, setTotalHours] = useState('0');
  const [cogs, setCogs] = useState('0');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gig_final_v8');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch (e) { setHistory([]); } }
  }, []);

  const addExpense = () => {
    if (!newDesc || !newAmount) return;
    setExpenseList([...expenseList, { id: Date.now(), desc: newDesc, amount: newAmount, category: newCategory }]);
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
    
    const taxableIncome = Math.max(0, totalGross - irsDeduction - manualExpenses - costOfGoods - commissionAmt);
    const fedTax = taxableIncome * FEDERAL_TAX_RATE;
    const stateTax = taxableIncome * (STATE_TAX_RATES[selectedState] || 0);
    const totalTax = fedTax + stateTax;
    
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
      
      {/* ... (Geri kalan kod yapın aynı, buraya kategori eklenmiş hali gelecek) ... */}
      <div className="mb-6 bg-[#1e293b] p-4 rounded-xl border border-blue-900/50">
        <label className="text-[10px] text-zinc-500 uppercase block mb-2">Expenses</label>
        <div className="flex flex-col gap-2 mb-2">
            <div className="flex gap-2">
                <input type="text" placeholder="Desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="flex-1 bg-[#0f172a] p-2 rounded text-sm border border-blue-900" />
                <input type="number" placeholder="$" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-20 bg-[#0f172a] p-2 rounded text-sm border border-blue-900" />
            </div>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-[#0f172a] p-2 rounded text-sm border border-blue-900 text-zinc-400">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={addExpense} className="bg-blue-600 py-2 rounded font-bold w-full">+</button>
        </div>
        
        <div className="space-y-1">
            {expenseList.map(exp => (
                <div key={exp.id} className="flex justify-between items-center text-[10px] bg-[#0f172a] p-2 rounded border border-blue-900/30">
                    <div>
                        <span className="block font-bold text-white">{exp.desc}</span>
                        <span className="text-cyan-500 bg-cyan-900/20 px-1 rounded">{exp.category}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span>${exp.amount}</span>
                        <button onClick={() => removeExpense(exp.id)} className="text-rose-400">x</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
      {/* (Kalan kodun buraya devam ediyor...) */}
    </div>
  );
}