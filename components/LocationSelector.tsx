
import React, { useMemo } from 'react';
import { DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';
import { LocationInfo } from '../types';
import { useTranslation } from '../App';
import { ChevronDown } from 'lucide-react';

interface LocationSelectorProps {
  value: Partial<LocationInfo>;
  onChange: (location: LocationInfo) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ value, onChange }) => {
  const { t, lang } = useTranslation();

  const filteredDistricts = useMemo(() => 
    DISTRICTS.filter(d => d.divisionId === value.divisionId),
    [value.divisionId]
  );

  const filteredUpazilas = useMemo(() => 
    UPAZILAS.filter(u => u.districtId === value.districtId),
    [value.districtId]
  );

  const updateLocation = (updates: Partial<LocationInfo>) => {
    const newLocation = { ...value, ...updates } as LocationInfo;
    
    if (updates.divisionId) {
      const division = DIVISIONS.find(d => d.id === updates.divisionId);
      newLocation.divisionName = division?.name || '';
      newLocation.districtId = '';
      newLocation.districtName = '';
      newLocation.upazilaId = '';
      newLocation.upazilaName = '';
    }
    if (updates.districtId) {
      const district = DISTRICTS.find(d => d.id === updates.districtId);
      newLocation.districtName = district?.name || '';
      newLocation.upazilaId = '';
      newLocation.upazilaName = '';
    }
    if (updates.upazilaId) {
      const upazila = UPAZILAS.find(u => u.id === updates.upazilaId);
      newLocation.upazilaName = upazila?.name || '';
    }

    onChange(newLocation);
  };

  const selectClasses = "w-full px-6 py-6 bg-[#f0fdf4] border border-emerald-50 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-black text-black text-lg transition-all appearance-none cursor-pointer group-hover:bg-emerald-100/50";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Division */}
      <div className="relative group">
        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-zinc-300">
          <ChevronDown className="w-5 h-5" />
        </div>
        <select 
          value={value.divisionId || ''}
          onChange={(e) => updateLocation({ divisionId: e.target.value })}
          className={selectClasses}
        >
          <option value="">{t('selectDivision')}</option>
          {DIVISIONS.map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
        </select>
      </div>

      {/* District */}
      <div className="relative group">
        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-zinc-300">
          <ChevronDown className="w-5 h-5" />
        </div>
        <select 
          disabled={!value.divisionId}
          value={value.districtId || ''}
          onChange={(e) => updateLocation({ districtId: e.target.value })}
          className={`${selectClasses} disabled:opacity-30 disabled:bg-zinc-50 disabled:cursor-not-allowed`}
        >
          <option value="">{t('selectDistrict')}</option>
          {filteredDistricts.map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
        </select>
      </div>

      {/* Upazila */}
      <div className="relative group">
        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-zinc-300">
          <ChevronDown className="w-5 h-5" />
        </div>
        <select 
          disabled={!value.districtId}
          value={value.upazilaId || ''}
          onChange={(e) => updateLocation({ upazilaId: e.target.value })}
          className={`${selectClasses} disabled:opacity-30 disabled:bg-zinc-50 disabled:cursor-not-allowed`}
        >
          <option value="">{t('selectUpazila')}</option>
          {filteredUpazilas.map(u => <option key={u.id} value={u.id}>{lang === 'bn' ? u.nameBn : u.name}</option>)}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;
