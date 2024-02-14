import useSWR from 'swr'

const fetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);
  return res.json();
} 

export const useCurrency = () => {
  const currencyApiUrl = `https://fxmarketapi.com/apicurrencies?api_key=${process.env.FXMARKET_API_KEY}`
  const { data, error, isLoading } = useSWR(currencyApiUrl, fetcher)
  return {
    currencyData: data,
    isLoading,
    isError: error
  }
}  
