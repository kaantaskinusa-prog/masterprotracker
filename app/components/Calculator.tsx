'use client';
import { useState } from 'react';

const Calculator = () => {
  const [jobType, setJobType] = useState('Nail Technician');
  const [state, setState] = useState('FL');
  const [weeklyData, setWeeklyData] = useState<any>({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
  const [commissionRate, setCommissionRate] = useState(0);
  const [hours, setHours] = useState(0);
  const [expenses, setExpenses] = useState<{desc: string, amount: number}[]>([]);
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmt, setNewExpAmt] = useState('');

  // Toplam Gelir
  const totalGross = Object.values(weeklyData).reduce((a: any, b: any) => a + Number(b || 0), 0);
  
  // Basit Gider Hesabı
  const totalExpenses = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
  
  // Basit Net (Vergisiz)
  const estimatedNet = totalGross - totalExpenses;

  const addExpense = () => {
    if(newExpDesc && newExpAmt) {
      setExpenses([...expenses, {desc: newExpDesc, amount: Number(newExpAmt)}]);
      setNewExpDesc('');
      setNewExpAmt('');
    }
  };

  return (
    <div className="p-6 bg-gray-950 text-white min-h-screen">
      {/* Üst Dropdownlar */}
      <div className="flex gap-4 mb-6">
        <select className="bg-gray-800 p-2 rounded w-full" value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option>Nail Technician</option>
        </select>
        <select className="bg-gray-800 p-2 rounded w-full" value={state} onChange={(e) => setState(e.target.value)}>
          <option>FL</option>
        </select>
      </div>

      {/* Günlük Girişler */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {Object.keys(weeklyData).map((day) => (
          <div key={day}>
            <label className="text-[10px] uppercase text-gray-400">{day}</label>
            <input 
              type="number" className="w-full bg-gray-800 p-2 rounded text-center"
              value={weeklyData[day]} onChange={(e) => setWeeklyData({...weeklyData, [day]: e.target.value})}
            />
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div className="mb-6 space-y-4">
        <input type="number" placeholder="Commission Rate (%)" className="w-full bg-gray-800 p-2 rounded" onChange={(e) => setCommissionRate(Number(e.target.value))} />
        <input type="number" placeholder="Hours" className="w-full bg-gray-800 p-2 rounded" onChange={(e) => setHours(Number(e.target.value))} />
      </div>

      {/* Giderler */}
      <div className="bg-gray-900 p-4 rounded mb-6">
        <h3 className="mb-2 text-sm text-gray-400">EXPENSES</h3>
        <div className="flex gap-2">
          <input className="bg-gray-800 p-2 rounded w-full" placeholder="Description" value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} />
          <input className="bg-gray-800 p-2 rounded w-20" placeholder="$" type="number" value={newExpAmt} onChange={(e) => setNewExpAmt(e.target.value)} />
          <button onClick={addExpense} className="bg-blue-600 px-4 rounded">+</button>
        </div>
      </div>

      {/* Sonuç */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <p className="text-sm text-gray-400">ESTIMATED NET INCOME</p>
        <h1 className="text-4xl font-bold text-green-500 mb-4">${estimatedNet.toFixed(2)}</h1>
        <div className="text-sm space-y-2">
          <div className="flex justify-between"><span>Hourly Rate</span> <span>${(totalGross / (hours || 1)).toFixed(2)}/hr</span></div>
          <div className="flex justify-between text-gray-400"><span>Federal Tax</span> <span>$0.00</span></div>
          <div className="flex justify-between text-gray-400"><span>State Tax (FL)</span> <span>$0.00</span></div>
        </div>
      </div>

      <button className="w-full mt-6 bg-blue-600 p-3 rounded font-bold">SAVE TO ARCHIVE</button>
    </div>
  );
};

export default Calculator;