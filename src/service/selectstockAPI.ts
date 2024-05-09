export const fetchStocksData = async () => {
    const response = await fetch('http://localhost:5000/api/stocks');
    if (!response.ok) {
      throw new Error('Failed to fetch stocks data');
    }
    return response.json();
  }
  