'use client';
import { useState, useMemo } from 'react';

const Calculator = () => {
  // Gerekli State tanımları (Bunlar senin önceki kodunda da vardır)
  const [weeklyData, setWeeklyData] = useState<any>({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
  const [expenseList, setExpenseList] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);

  // Hesaplama Mantığı (GÜNCELLENMİŞ VERSİYON)
  const calc = useMemo(() => {
    const totalGross = Object.values(weeklyData).reduce((a: any, b: any) => a + Number(b || 0), 0);
    const totalExpenses = expenseList.reduce((acc, exp) => acc + Number(exp.amount || 0), 0);
    
    // Florida'da eyalet vergisi %0. 
    // %15.3 Serbest Meslek Vergisi + %10 Federal Vergi Tahmini = %25.3 Toplam Vergi
    const taxableIncome = Math.max(0, totalGross - totalExpenses);
    const selfEmploymentTax = taxableIncome * 0.153; 
    const fedTax = taxableIncome * 0.10;
    const totalTax = selfEmploymentTax + fedTax;

    const estimatedNet = totalGross - totalExpenses - totalTax;
    const commissionAmt = (totalGross * (Number(commissionRate) || 0)) / 100;

    return { 
        totalGross: totalGross || 0,
        totalExpenses: totalExpenses || 0,
        estimatedNet: estimatedNet || 0,
        totalTax: totalTax || 0,
        fedTax: fedTax || 0,
        stateTax: 0,
        hourlyRate: totalGross / (Number(totalHours) || 1),
        commissionAmt: commissionAmt || 0
    };
  }, [weeklyData, expenseList, totalHours, commissionRate]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Master Pro Tracker</h2>
      
      <div className="mb-4">
        <p>Toplam Kazanç: ${calc.totalGross.toFixed(2)}</p>
        <p>Toplam Gider: ${calc.totalExpenses.toFixed(2)}</p>
        <p className="text-green-400 font-bold">Tahmini Net: ${calc.estimatedNet.toFixed(2)}</p>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <p>Vergi (Self-Emp + Fed): ${calc.totalTax.toFixed(2)}</p>
        <p>Eyalet Vergisi: $0.00 (Florida)</p>
      </div>
    </div>
  );
};

export default Calculator;