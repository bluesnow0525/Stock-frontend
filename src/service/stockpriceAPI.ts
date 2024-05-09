
export const fetchStocksPrice = async (id:string) => {
  const url = 'http://localhost:5000/api/stockprice';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Failed to fetch stocks data');
  }
  // console.log(response.json())
  return response.json();
}
