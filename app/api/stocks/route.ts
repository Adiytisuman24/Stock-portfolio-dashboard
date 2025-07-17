import { NextResponse } from 'next/server';
import { getSerpApiClient, getFallbackStockData, SerpApiStockData } from '@/lib/serpapi-client';


let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 15000; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');
    
    if (!symbolsParam) {
      return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
    }
    
    const symbols = symbolsParam.split(',');
    
    
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }
    
    
    const serpApiClient = getSerpApiClient();
    
    
    const combinedData: { [key: string]: any } = {};
    
    try {
      
      const serpApiData = await serpApiClient.fetchMultipleStocks(symbols);
      
      symbols.forEach(symbol => {
        const liveData = serpApiData.get(symbol);
        
        if (liveData) {
          combinedData[symbol] = {
            symbol,
            currentPrice: liveData.price,
            change: liveData.change,
            changePercent: liveData.changePercent,
            peRatio: liveData.peRatio,
            earnings: liveData.earnings,
            marketCap: liveData.marketCap,
            revenue: liveData.revenue,
            lastUpdated: liveData.lastUpdated
          };
        } else {
          
          const cachedData = serpApiClient.getCachedData(symbol);
          if (cachedData) {
            combinedData[symbol] = {
              symbol,
              currentPrice: cachedData.price,
              change: cachedData.change,
              changePercent: cachedData.changePercent,
              peRatio: cachedData.peRatio,
              earnings: cachedData.earnings,
              marketCap: cachedData.marketCap,
              revenue: cachedData.revenue,
              lastUpdated: cachedData.lastUpdated
            };
          } else {
            
            const fallbackData = getFallbackStockData(symbol);
            combinedData[symbol] = {
              symbol,
              currentPrice: fallbackData.price,
              change: fallbackData.change,
              changePercent: fallbackData.changePercent,
              peRatio: fallbackData.peRatio,
              earnings: fallbackData.earnings,
              marketCap: fallbackData.marketCap,
              revenue: fallbackData.revenue,
              lastUpdated: fallbackData.lastUpdated
            };
          }
        }
      });
    } catch (error) {
      console.error('Error fetching SerpAPI data:', error);
      
      
      symbols.forEach(symbol => {
        const fallbackData = getFallbackStockData(symbol);
        combinedData[symbol] = {
          symbol,
          currentPrice: fallbackData.price,
          change: fallbackData.change,
          changePercent: fallbackData.changePercent,
          peRatio: fallbackData.peRatio,
          earnings: fallbackData.earnings,
          marketCap: fallbackData.marketCap,
          revenue: fallbackData.revenue,
          lastUpdated: fallbackData.lastUpdated
        };
      });
    }
    
    
    cache = {
      data: combinedData,
      timestamp: Date.now()
    };
    
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
