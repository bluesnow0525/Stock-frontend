export const fetchStocksData = async (username?: string) => {
    const response = await fetch(`http://localhost:5000/api/stocks?username=${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stocks data');
    }
    return response.json();
  }
  