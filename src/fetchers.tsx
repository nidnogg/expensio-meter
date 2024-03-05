// TO-DO refactor main couiple of useEffect fetches to use SWR in App.tsx (Mar 5 2024)
import useSWR from 'swr'
import { API_URL } from './consts';

const fetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);
  return res.json();
} 

export const useCurrency = () => {
  const { data, error, isLoading } = useSWR(API_URL, fetcher)
  return {
    currencyData: data,
    isLoading,
    isError: error
  }
}  
