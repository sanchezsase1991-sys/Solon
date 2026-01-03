
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { JobOpportunity } from '../types';

interface JobMapProps {
  jobs: JobOpportunity[];
  center: { lat: number, lng: number };
}

const JobMap: React.FC<JobMapProps> = ({ jobs, center }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([center.lat, center.lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView([center.lat, center.lng], 13);
    }

    // Limpiar marcadores existentes
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Marcador del usuario (Casa/Origen)
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px #3b82f6;"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
    L.marker([center.lat, center.lng], { icon: userIcon }).addTo(mapRef.current).bindPopup('<b>Tu Ubicación de Origen</b>');

    // Icono personalizado dorado para los empleos
    const goldIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #c5a059; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #c5a059;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    jobs.forEach(job => {
      if (job.coords) {
        const marker = L.marker([job.coords.lat, job.coords.lng], { icon: goldIcon }).addTo(mapRef.current!);
        marker.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; min-width: 150px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
               <b style="color: #c5a059; font-size: 13px; text-transform: uppercase; letter-spacing: -0.02em;">${job.companyName}</b>
               <span style="font-size: 9px; background: rgba(197, 160, 89, 0.1); color: #c5a059; padding: 1px 4px; border-radius: 4px; font-weight: bold;">${job.urgency}</span>
            </div>
            <p style="font-size: 10px; color: #888; margin: 0 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 4px;">${job.jobType || 'Vacante General'}</p>
            <p style="font-size: 11px; color: #444; margin: 0 0 8px 0; font-style: italic;">"${job.dailyInsight || 'Oportunidad activa hoy.'}"</p>
            <a href="https://www.google.com/maps/search/${encodeURIComponent(job.companyName + ' ' + job.address)}" target="_blank" style="display: block; width: 100%; text-align: center; background: #c5a059; color: white; padding: 6px; border-radius: 6px; font-size: 10px; font-weight: bold; text-decoration: none; text-transform: uppercase;">Cómo llegar</a>
          </div>
        `, {
          className: 'custom-leaflet-popup'
        });
      }
    });

    return () => {};
  }, [jobs, center]);

  return (
    <div className="w-full h-[600px] rounded-[2rem] overflow-hidden relative shadow-2xl border border-gold/20 animate-in fade-in duration-1000">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Overlay de información del Mapa */}
      <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
        <div className="glass-card px-6 py-4 rounded-2xl border-gold/30 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
            <h4 className="cinzel text-[11px] gold-text font-bold uppercase tracking-[0.2em]">Red de Patrones Activos</h4>
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Mostrando todas las vacantes del System Day</p>
          <div className="mt-3 flex items-center gap-4 border-t border-white/5 pt-3">
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gold"></div>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Empleo</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Tú</span>
             </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-[1000]">
        <div className="glass-card px-4 py-2 rounded-xl text-[9px] text-gold/60 font-mono border-none bg-black/60 backdrop-blur-md">
          SISTEMA SIN FILTROS: VISUALIZACIÓN GLOBAL
        </div>
      </div>
    </div>
  );
};

export default JobMap;
