
import React, { useState } from 'react';
import { InvestmentStrategy } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InvestmentViewProps {
  strategy: InvestmentStrategy;
}

const InvestmentView: React.FC<InvestmentViewProps> = ({ strategy }) => {
  const [selectedCapital, setSelectedCapital] = useState<number>(10);
  
  const capitalTiers = [10, 20, 50, 100];

  const getChartData = (cap: number) => [
    { name: 'Día 1', val: cap },
    { name: 'Semana 2', val: cap * 1.5 },
    { name: 'Mes 1', val: cap * 2.8 },
    { name: 'Mes 2', val: cap * 5.2 },
    { name: 'Mes 3', val: cap * 12.0 },
    { name: 'Mes 6', val: cap * 32.0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Selector de Capital */}
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border-gold/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <i className="fa-solid fa-coins text-9xl"></i>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                <i className="fa-solid fa-chess-king gold-text"></i>
              </div>
              <h2 className="cinzel text-3xl gold-text font-bold tracking-tighter uppercase">Arquitectura de Capital</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed italic">
              "Incluso la montaña más alta comenzó como un pequeño grano de arena. Elige tu semilla para iniciar el patrón de crecimiento."
            </p>
          </div>

          <div className="w-full md:w-auto">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-bold mb-4 text-center">Inversión Inicial Sugerida (USD)</p>
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
              {capitalTiers.map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedCapital(tier)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                    selectedCapital === tier 
                    ? 'bg-gold text-black shadow-lg shadow-gold/20' 
                    : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  ${tier}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de 4 Pilares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategy.sectors?.map((sector, sIdx) => (
          <div key={sIdx} className="glass-card rounded-3xl p-8 border-t-2 border-t-gold/20 hover:border-t-gold/60 transition-all duration-500 group flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center border border-gold/10 group-hover:scale-110 group-hover:bg-gold/10 transition-all">
                <i className={`${sector.icon} gold-text text-xl`}></i>
              </div>
              <div>
                <h3 className="cinzel text-xl font-bold gold-text tracking-tight uppercase">{sector.sector}</h3>
                <div className="h-[1px] w-12 bg-gold/30 mt-1"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 flex-grow">
              {sector.tips.map((tip, tIdx) => (
                <div key={tIdx} className="flex gap-4 group/tip relative">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gold/40 font-mono group-hover/tip:border-gold/40 group-hover/tip:text-gold transition-all">
                    {tIdx + 1}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-200 uppercase tracking-widest mb-1.5">{tip.title}</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed font-light">{tip.advice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Proyección Visual */}
      <div className="glass-card rounded-[2.5rem] p-8 border-gold/10 overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="cinzel text-lg gold-text font-bold uppercase tracking-widest">Algoritmo de Proyección</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 italic">Visualización de crecimiento basado en interés compuesto</p>
          </div>
          <div className="px-6 py-3 bg-gold/10 rounded-xl border border-gold/20 flex flex-col items-center">
            <span className="text-[9px] text-gold/60 uppercase font-bold tracking-tighter">Potencial a 180 días</span>
            <span className="text-xl gold-text font-bold tracking-tighter">${(selectedCapital * 32).toLocaleString()} USD</span>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getChartData(selectedCapital)}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c5a059" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #c5a059', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#c5a059' }}
                cursor={{ stroke: '#c5a059', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="val" stroke="#c5a059" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Aviso */}
      <div className="text-center pb-8">
        <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 rounded-full border border-white/10 shadow-lg">
          <i className="fa-solid fa-shield-halved text-gold/50 text-xs"></i>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            Estas estrategias son de carácter educativo. La responsabilidad del destino financiero recae en tu ejecución.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentView;
