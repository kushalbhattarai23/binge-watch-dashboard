
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

// Declare the nepali datepicker interface
declare global {
  interface HTMLInputElement {
    nepaliDatePicker: (config?: any) => void;
    value: string;
  }
}

// Declare the NepaliDateConverter which is available globally after loading the nepali datepicker script
declare global {
  interface Window {
    NepaliFunctions: {
      BS2AD: (bsDate: string) => string;
      AD2BS: (adDate: string) => string;
      ConvertDateFormat: (date: string, format: string) => string;
    };
  }
}

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
  const [englishDate, setEnglishDate] = useState<string>(value || '');
  const [nepaliDate, setNepaliDate] = useState<string>('');
  const nepaliInputRef = useRef<HTMLInputElement>(null);

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

  // Handle English date change
  const handleEnglishDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnglishDate = e.target.value;
    setEnglishDate(newEnglishDate);
    
    if (newEnglishDate && window.NepaliFunctions) {
      const bsDate = convertADToBS(newEnglishDate);
      setNepaliDate(bsDate);
      
      // Update nepali datepicker value
      if (nepaliInputRef.current) {
        nepaliInputRef.current.value = bsDate;
      }
    } else {
      setNepaliDate('');
      if (nepaliInputRef.current) {
        nepaliInputRef.current.value = '';
      }
    }
    
    onChange(newEnglishDate, nepaliDate);
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
          const bsDate = nepaliInputRef.current?.value || '';
          console.log('Nepali date selected:', bsDate);
          setNepaliDate(bsDate);
          
          if (bsDate && window.NepaliFunctions) {
            try {
              const adDate = convertBSToAD(bsDate);
              console.log('Converted to English date:', adDate);
              setEnglishDate(adDate);
              onChange(adDate, bsDate);
            } catch (error) {
              console.error('Error converting Nepali date to English:', error);
            }
          } else {
            setEnglishDate('');
            onChange('', bsDate);
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

  return (
    <div className="space-y-4">
      {label && <Label htmlFor={id} className="text-sm font-medium">{label}</Label>}
      
      {/* Primary English Date Input */}
      <div className="space-y-2">
        <Label htmlFor={`${id}-english`} className="text-sm font-medium">Date</Label>
        <Input
          id={`${id}-english`}
          type="date"
          value={englishDate}
          onChange={handleEnglishDateChange}
          required={required}
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

      {/* Alternative Nepali Date Input */}
      <div className="space-y-2">
        <Label htmlFor={`${id}-nepali`} className="text-xs text-muted-foreground">Alternative: Nepali (BS) Date</Label>
        <div className="relative">
          <input
            ref={nepaliInputRef}
            id={`${id}-nepali`}
            type="text"
            placeholder="Select Nepali date"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            readOnly
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {nepaliDate && (
          <div className="text-xs text-muted-foreground">
            Nepali Calendar: {nepaliDate}
          </div>
        )}
      </div>
    </div>
  );
};
