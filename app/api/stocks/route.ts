import { NextResponse } from 'next/server';
import { getSerpApiClient, getFallbackStockData, SerpApiStockData } from '@/lib/serpapi-client';

// Cache to prevent excessive API calls
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 15000; // 15 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');
    
    if (!symbolsParam) {
      return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
    }
    
    const symbols = symbolsParam.split(',');
    
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }
    
    // Get SerpAPI client
    const serpApiClient = getSerpApiClient();
    
    // Fetch data from Google Finance via SerpAPI
    const combinedData: { [key: string]: any } = {};
    
    try {
      // Try to fetch live data from SerpAPI
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
          // Use cached data if available
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
            // Fallback to demo data
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
      
      // Fallback to demo data for all symbols
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
    
    // Update cache
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