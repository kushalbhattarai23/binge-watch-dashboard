
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';

interface NepaliDatePickerProps {
  label?: string;
  value?: string;
  onChange: (englishDate: string, nepaliDate: string) => void;
  required?: boolean;
  id?: string;
}

export const NepaliDatePicker: React.FC<NepaliDatePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  id
}) => {
  const nepaliInputRef = useRef<HTMLInputElement>(null);
  const [nepaliDate, setNepaliDate] = useState('');
  const [englishDate, setEnglishDate] = useState(value || '');

  // Convert AD date to BS date
  const convertADToBS = (adDate: string): string => {
    if (!adDate || !window.NepaliFunctions) return '';
    try {
      return window.NepaliFunctions.AD2BS(adDate);
    } catch (error) {
      console.error('Error converting AD to BS:', error);
      return '';
    }
  };

  // Convert BS date to AD date
  const convertBSToAD = (bsDate: string): string => {
    if (!bsDate || !window.NepaliFunctions) return '';
    try {
      return window.NepaliFunctions.BS2AD(bsDate);
    } catch (error) {
      console.error('Error converting BS to AD:', error);
      return '';
    }
  };

  // Initialize Nepali datepicker
  useEffect(() => {
    if (nepaliInputRef.current && window.$) {
      const $input = window.$(nepaliInputRef.current);
      
      $input.nepaliDatePicker({
        dateFormat: '%Y-%m-%d',
        ndpYear: true,
        ndpMonth: true,
        ndpYearCount: 10,
        closeOnDateSelect: true,
        onChange: function() {
          const selectedNepaliDate = $input.val();
          console.log('Nepali date selected:', selectedNepaliDate);
          setNepaliDate(selectedNepaliDate);
          
          // Convert Nepali date to English date
          if (window.NepaliFunctions && selectedNepaliDate) {
            try {
              const convertedEnglishDate = convertBSToAD(selectedNepaliDate);
              console.log('Converted to English date:', convertedEnglishDate);
              setEnglishDate(convertedEnglishDate);
              onChange(convertedEnglishDate, selectedNepaliDate);
            } catch (error) {
              console.error('Error converting Nepali date to English:', error);
            }
          }
        }
      });
    }

    return () => {
      if (nepaliInputRef.current && window.$) {
        const $input = window.$(nepaliInputRef.current);
        if ($input.data('nepaliDatePicker')) {
          $input.data('nepaliDatePicker').destroy();
        }
      }
    };
  }, [onChange]);

  // Convert English date to Nepali when value prop changes
  useEffect(() => {
    if (value && window.NepaliFunctions && value !== englishDate) {
      try {
        const convertedNepaliDate = convertADToBS(value);
        setNepaliDate(convertedNepaliDate);
        setEnglishDate(value);
        if (nepaliInputRef.current && window.$) {
          window.$(nepaliInputRef.current).val(convertedNepaliDate);
        }
      } catch (error) {
        console.error('Error converting English date to Nepali:', error);
      }
    }
  }, [value, englishDate]);

  const handleEnglishDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnglishDate = e.target.value;
    setEnglishDate(newEnglishDate);
    
    if (window.NepaliFunctions && newEnglishDate) {
      try {
        const convertedNepaliDate = convertADToBS(newEnglishDate);
        setNepaliDate(convertedNepaliDate);
        if (nepaliInputRef.current && window.$) {
          window.$(nepaliInputRef.current).val(convertedNepaliDate);
        }
        onChange(newEnglishDate, convertedNepaliDate);
      } catch (error) {
        console.error('Error converting English date to Nepali:', error);
      }
    } else {
      onChange(newEnglishDate, nepaliDate);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id} className="text-sm font-medium">{label}</Label>}
      
      {/* Primary Nepali Date Input */}
      <div className="relative">
        <input
          ref={nepaliInputRef}
          id={id}
          type="text"
          placeholder="Select Nepali date"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          readOnly
          required={required}
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      
      {/* Alternative English Date Input */}
      <div className="space-y-2">
        <Label htmlFor={`${id}-english`} className="text-xs text-muted-foreground">Alternative: English (AD) Date</Label>
        <Input
          id={`${id}-english`}
          type="date"
          value={englishDate}
          onChange={handleEnglishDateChange}
          className="text-sm"
        />
        {englishDate && (
          <div className="text-xs text-muted-foreground">
            {new Date(englishDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      </div>
    </div>
  );
};
