import { API_BASE_URL } from "../assets/apiurl";

export const fetchStocksData = async (username?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/stocks?username=${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stocks data');
    }
    return response.json();
  }
  