import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const CSV_FILES = [
  'file1.csv', 
  'file2.csv', 
  'file3.csv', 
  'file4.csv', 
  'file5.csv', 
  'file6.csv', 
  'file7.csv', 
  'file8.csv', 
  'file9.csv'
];

const CsvDataFetcher = ({ onDataFetched }: { onDataFetched: (data: any) => void }) => {
  const fetchCsvData = async (filePath: string) => {
    const response = await fetch(filePath);
    const text = await response.text();
    const parsedData = Papa.parse(text, { header: true });
    return parsedData.data;
  };

  const fetchAllSurplusData = async () => {
    const allSurplusData: Record<string, number> = {};

    for (const file of CSV_FILES) {
      const data = await fetchCsvData(`/data/${file}`);

      data.forEach((item: any) => {
        const category = item.Category;
        const surplus = parseInt(item.Surplus, 10) || 0;

        if (!allSurplusData[category]) {
          allSurplusData[category] = 0; // Initialize if not already set
        }
        allSurplusData[category] += surplus; // Accumulate surplus
      });
    }

    const formattedData = Object.entries(allSurplusData).map(([category, quantity]) => ({
      category,
      quantity,
    }));

    onDataFetched(formattedData); // Pass the data to the parent component
  };

  useEffect(() => {
    fetchAllSurplusData();
  }, []);

  return null; // This component doesn't render anything itself
};

export default CsvDataFetcher;
