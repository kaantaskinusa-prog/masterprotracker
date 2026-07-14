'use client';
import { useState, useMemo } from 'react';

const Calculator = () => {
  const [weeklyData, setWeeklyData] = useState<any>({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
  const [expenseList, setExpenseList] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [commissionRate, setCommissionRate] = useState(40); // Varsayılan %40
  const [miles, setMiles] = useState(0);

  const calc = useMemo(() => {
    const totalSales = Object.values(weeklyData).reduce((a: any, b: any) => a + Number(b || 0), 0);
    const commissionIncome = totalSales * (Number(commissionRate || 40) / 100);
    const manualExpenses = expenseList.reduce((acc, exp) => acc + Number(exp.amount || 0), 0);
    const mileageDeduction = Number(miles || 0) * 0.67;
    const totalExpenses = manualExpenses + mileageDeduction;
    
    const taxableIncome = Math.max(0, commissionIncome - totalExpenses);
    const selfEmploymentTax = taxableIncome * 0.153; 
    const fedTax = taxableIncome * 0.10;
    const totalTax = selfEmploymentTax + fedTax;

    const estimatedNet = commissionIncome - totalExpenses - totalTax;

    return { 
        commissionIncome: commissionIncome || 0,
        totalExpenses: totalExpenses || 0,
        estimatedNet: estimatedNet || 0,
        totalTax: totalTax || 0,
        fedTax: fedTax || 0,
        stateTax: 0
    };
  }, [weeklyData, expenseList, commissionRate, miles]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Master Pro Tracker</h2>
      <div className="space-y-2">
        <p>Komisyon Geliri: ${calc.commissionIncome.toFixed(2)}</p>
        <p>Toplam Gider: ${calc.totalExpenses.toFixed(2)}</p>
        <p className="text-green-400 font-bold text-lg">Tahmini Net: ${calc.estimatedNet.toFixed(2)}</p>
        <div className="border-t border-gray-700 pt-2 mt-2">
            <p className="text-red-400">Tahmini Vergi: ${calc.totalTax.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;