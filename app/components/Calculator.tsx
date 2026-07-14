'use client';
import { useState, useMemo } from 'react';

const Calculator = () => {
  const [weeklyData, setWeeklyData] = useState<any>({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
  const [commissionRate, setCommissionRate] = useState(40);
  const [miles, setMiles] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const calc = useMemo(() => {
    const totalSales = Object.values(weeklyData).reduce((a: any, b: any) => a + Number(b || 0), 0);
    const commissionIncome = totalSales * (Number(commissionRate) / 100);
    const mileageDeduction = Number(miles) * 0.67;
    const totalExpenses = Number(expenses) + mileageDeduction;
    
    const taxableIncome = Math.max(0, commissionIncome - totalExpenses);
    const totalTax = (taxableIncome * 0.153) + (taxableIncome * 0.10); // %15.3 SE + %10 Fed
    const estimatedNet = commissionIncome - totalExpenses - totalTax;

    return { commissionIncome, totalExpenses, estimatedNet, totalTax };
  }, [weeklyData, commissionRate, miles, expenses]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Master Pro Tracker</h2>
      
      {/* Günlük Girişler */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.keys(weeklyData).map((day) => (
          <div key={day}>
            <label className="text-xs uppercase">{day}</label>
            <input 
              type="number" className="w-full bg-gray-800 p-2 rounded text-white"
              value={weeklyData[day]} onChange={(e) => setWeeklyData({...weeklyData, [day]: e.target.value})}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <input type="number" placeholder="Komisyon Oranı (%)" className="w-full bg-gray-800 p-2 rounded" onChange={(e) => setCommissionRate(Number(e.target.value))} />
        <input type="number" placeholder="Toplam Mil" className="w-full bg-gray-800 p-2 rounded" onChange={(e) => setMiles(Number(e.target.value))} />
        <input type="number" placeholder="Diğer Giderler ($)" className="w-full bg-gray-800 p-2 rounded" onChange={(e) => setExpenses(Number(e.target.value))} />
      </div>

      {/* Sonuç Ekranı */}
      <div className="border-t border-gray-700 pt-4">
        <p>Komisyon Geliri: ${calc.commissionIncome.toFixed(2)}</p>
        <p>Toplam Gider: ${calc.totalExpenses.toFixed(2)}</p>
        <p className="text-green-400 font-bold text-lg">Tahmini Net: ${calc.estimatedNet.toFixed(2)}</p>
        <p className="text-red-400">Tahmini Vergi: ${calc.totalTax.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Calculator;