import Papa from 'papaparse';

export const fetchCsvData = async (filePath) => {
  const response = await fetch(filePath);
  const text = await response.text();
  const parsedData = Papa.parse(text, { header: true }); // Parse with headers
  return parsedData.data; // Return the data
};

export const fetchAllSurplusData = async (files) => {
  const allSurplusData = {};

  for (const file of files) {
    const data = await fetchCsvData(`../../streamlit/data/${file}`);
    
    data.forEach((item) => {
      const category = item.Category;
      const surplus = parseInt(item.Surplus, 10) || 0;

      if (!allSurplusData[category]) {
        allSurplusData[category] = 0; // Initialize if not already set
      }
      allSurplusData[category] += surplus; // Accumulate surplus
    });
  }

  return allSurplusData;
};
