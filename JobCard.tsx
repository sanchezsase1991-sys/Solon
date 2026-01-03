
import React from 'react';
import { JobOpportunity } from '../types';

interface JobCardProps {
  job: JobOpportunity;
  isFavorableTime: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isFavorableTime }) => {
  return (
    <div className="glass-card rounded-[2rem] p-6 border-l-4 border-l-gold hover:shadow-xl hover:shadow-gold/10 transition-all flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 relative overflow-hidden group">
      {/* Indicador de System Day Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold gold-text leading-tight tracking-tight">{job.companyName}</h3>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
             <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Patrón Activo</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-[9px] font-bold px-3 py-1 rounded-full uppercase border ${
          job.applicationMethod === 'Presencial' 
            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
            : 'bg-gold/10 text-gold border-gold/30'
        }`}>
          <i className={job.applicationMethod === 'Presencial' ? 'fa-solid fa-door-open' : 'fa-solid fa-building-shield'}></i>
          {job.applicationMethod}
        </div>
      </div>

      {/* Daily Insight Box (System Day logic) */}
      {job.dailyInsight && (
        <div className="mb-6 p-4 bg-gold/5 rounded-2xl border border-gold/10 relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <i className="fa-solid fa-bolt gold-text text-[10px]"></i>
            <span className="text-[9px] font-bold gold-text uppercase tracking-widest">Sugerencia del Día</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed italic">
            "{job.dailyInsight}"
          </p>
        </div>
      )}

      <div className="space-y-4 mb-6 flex-grow relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
            <i className="fa-solid fa-location-dot gold-text text-xs"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Zona de Influencia</span>
            <span className="text-[12px] text-gray-200 leading-snug">{job.address}</span>
          </div>
        </div>

        {job.contactInfo && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/5 flex items-center justify-center shrink-0 border border-green-500/10">
              <i className="fa-solid fa-phone-volume text-green-500 text-xs"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Canal Directo</span>
              <span className="text-[12px] text-green-400 font-mono font-bold">{job.contactInfo}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
          <i className="fa-solid fa-signal gold-text text-[10px]"></i>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Urgencia: <span className="text-white">{job.urgency}</span></span>
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <div className="flex flex-wrap gap-1.5">
          {job.requirements?.map((req, i) => (
            <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-400">
              {req}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3 relative z-10">
        {job.applicationMethod === 'Presencial' ? (
          <div className="space-y-2">
            <a 
              href={`https://www.google.com/maps/search/${encodeURIComponent(job.companyName + ' ' + job.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center gold-gradient-bg text-black font-bold py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg shadow-gold/20"
            >
              <i className="fa-solid fa-compass mr-2"></i> Trazar Ruta Física
            </a>
          </div>
        ) : job.officialLink && (
          <a 
            href={job.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center border border-gold/40 gold-text font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-black transition-all"
          >
            <i className="fa-solid fa-link mr-2"></i> Nodo de Aplicación
          </a>
        )}
        
        {isFavorableTime && job.applicationMethod === 'Presencial' && (
          <div className="flex items-center justify-center gap-2 text-[9px] text-green-400 font-bold uppercase tracking-[0.3em] py-2 border-t border-white/5 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Hora de Máxima Sincronía
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
