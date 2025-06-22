
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NepaliDatePicker } from '@/components/ui/nepali-date-picker';

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onDateRangeChange
}) => {
  const handleStartDateChange = (englishDate: string, nepaliDate: string) => {
    onDateRangeChange(englishDate ? new Date(englishDate) : null, endDate);
  };

  const handleEndDateChange = (englishDate: string, nepaliDate: string) => {
    onDateRangeChange(startDate, englishDate ? new Date(englishDate) : null);
  };

  const clearFilters = () => {
    onDateRangeChange(null, null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NepaliDatePicker
          label="Start Date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={handleStartDateChange}
          id="start-date"
        />
        <NepaliDatePicker
          label="End Date"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={handleEndDateChange}
          id="end-date"
        />
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
