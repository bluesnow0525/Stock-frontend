// fetchImage.ts
import { API_BASE_URL } from "../assets/apiurl";

export const fetchAiData = (params: { [key: string]: any }) => {
    return fetch(`${API_BASE_URL}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      throw new Error(error.message);
    });
  };
  