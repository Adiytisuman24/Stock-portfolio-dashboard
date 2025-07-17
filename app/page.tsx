'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Upload,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import PortfolioTable from '@/components/portfolio-table';
import SectorSummary from '@/components/sector-summary';
import PortfolioStats from '@/components/portfolio-stats';
import SectorAnalysis from '@/components/sector-analysis';
import { generateAIRecommendation, generateEnhancedMetrics } from '@/lib/ai-recommendations';
import { Portfolio, Stock, SectorSummary as SectorSummaryType, StockRecommendation, SectorAllocation } from '@/types/portfolio';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    stocks: [],
    totalInvestment: 0,
    currentValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  
  const initializePortfolio = useCallback(() => {
    const sampleStocks: Stock[] = [
      
      {
        id: '1',
        name: 'HDFC Bank',
        symbol: 'HDFCBANK.NS',
        sector: 'Financial Sector',
        exchange: 'NSE',
        quantity: 50,
        purchasePrice: 1450,
        currentPrice: 1770,
        investment: 72500,
        presentValue: 88500,
        gainLoss: 16000,
        gainLossPercent: 22.07,
        portfolioPercent: 5.6,
        peRatio: 20.5,
        earnings: '₹45,000 Cr',
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Bajaj Finance',
        symbol: 'BAJFINANCE.NS',
        sector: 'Financial Sector',
        exchange: 'NSE',
        quantity: 10,
        purchasePrice: 4450,
        currentPrice: 6500,
        investment: 44500,
        presentValue: 65000,
        gainLoss: 20500,
        gainLossPercent: 46.07,
        portfolioPercent: 3.5,
        peRatio: 28.3,
        earnings: '₹12,500 Cr',
        lastUpdated: new Date()
      },
      {
        id: '3',
        name: 'ICICI Bank',
        symbol: 'ICICIBANK.NS',
        sector: 'Financial Sector',
        exchange: 'NSE',
        quantity: 75,
        purchasePrice: 800,
        currentPrice: 1200,
        investment: 60000,
        presentValue: 90000,
        gainLoss: 30000,
        gainLossPercent: 50.0,
        portfolioPercent: 4.7,
        peRatio: 18.2,
        earnings: '₹38,000 Cr',
        lastUpdated: new Date()
      },
      {
        id: '4',
        name: 'Bajaj Auto',
        symbol: 'BAJAJ-AUTO.NS',
        sector: 'Financial Sector',
        exchange: 'NSE',
        quantity: 20,
        purchasePrice: 8500,
        currentPrice: 9500,
        investment: 170000,
        presentValue: 190000,
        gainLoss: 20000,
        gainLossPercent: 11.76,
        portfolioPercent: 13.2,
        peRatio: 32.1,
        earnings: '₹15,200 Cr',
        lastUpdated: new Date()
      },
      {
        id: '5',
        name: 'Savani Financials',
        symbol: 'SAVANIFIN.NS',
        sector: 'Financial Sector',
        exchange: 'NSE',
        quantity: 100,
        purchasePrice: 290,
        currentPrice: 180,
        investment: 29000,
        presentValue: 18000,
        gainLoss: -11000,
        gainLossPercent: -37.93,
        portfolioPercent: 2.3,
        peRatio: 12.5,
        earnings: '₹450 Cr',
        lastUpdated: new Date()
      },
      {
        id: '6',
        name: 'Affle India',
        symbol: 'AFFLE.NS',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 50,
        purchasePrice: 950,
        currentPrice: 1200,
        investment: 47500,
        presentValue: 60000,
        gainLoss: 12500,
        gainLossPercent: 26.32,
        portfolioPercent: 3.7,
        peRatio: 28.5,
        earnings: '₹850 Cr',
        lastUpdated: new Date()
      },
      {
        id: '7',
        name: 'LTI Mindtree',
        symbol: 'LTIM.NS',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 25,
        purchasePrice: 4200,
        currentPrice: 5800,
        investment: 105000,
        presentValue: 145000,
        gainLoss: 40000,
        gainLossPercent: 38.10,
        portfolioPercent: 8.2,
        peRatio: 24.8,
        earnings: '₹8,500 Cr',
        lastUpdated: new Date()
      },
      {
        id: '8',
        name: 'KPIT Technologies',
        symbol: 'KPITTECH.NS',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 100,
        purchasePrice: 950,
        currentPrice: 1800,
        investment: 95000,
        presentValue: 180000,
        gainLoss: 85000,
        gainLossPercent: 89.47,
        portfolioPercent: 7.4,
        peRatio: 35.2,
        earnings: '₹2,800 Cr',
        lastUpdated: new Date()
      },
      {
        id: '9',
        name: 'Tata Technologies',
        symbol: 'TATATECH.NS',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 80,
        purchasePrice: 1450,
        currentPrice: 900,
        investment: 116000,
        presentValue: 72000,
        gainLoss: -44000,
        gainLossPercent: -37.93,
        portfolioPercent: 9.0,
        peRatio: 18.5,
        earnings: '₹1,200 Cr',
        lastUpdated: new Date()
      },
      {
        id: '10',
        name: 'BLS E-Services',
        symbol: 'BLSE.NS',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 200,
        purchasePrice: 135,
        currentPrice: 90,
        investment: 27000,
        presentValue: 18000,
        gainLoss: -9000,
        gainLossPercent: -33.33,
        portfolioPercent: 2.1,
        peRatio: 15.2,
        earnings: '₹350 Cr',
        lastUpdated: new Date()
      },
      {
        id: '11',
        name: 'Tanla Platforms',
        symbol: 'TANLA.NS',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 50,
        purchasePrice: 1200,
        currentPrice: 480,
        investment: 60000,
        presentValue: 24000,
        gainLoss: -36000,
        gainLossPercent: -60.0,
        portfolioPercent: 4.7,
        peRatio: 15.2,
        earnings: '₹1,200 Cr',
        lastUpdated: new Date()
      },
      // Consumer Sector
      {
        id: '12',
        name: 'DMart',
        symbol: 'DMART.NS',
        sector: 'Consumer',
        exchange: 'NSE',
        quantity: 15,
        purchasePrice: 3800,
        currentPrice: 3500,
        investment: 57000,
        presentValue: 52500,
        gainLoss: -4500,
        gainLossPercent: -7.89,
        portfolioPercent: 4.4,
        peRatio: 45.2,
        earnings: '₹2,800 Cr',
        lastUpdated: new Date()
      },
      {
        id: '13',
        name: 'Tata Consumer',
        symbol: 'TATACONSUM.NS',
        sector: 'Consumer',
        exchange: 'NSE',
        quantity: 37,
        purchasePrice: 750,
        currentPrice: 850,
        investment: 27750,
        presentValue: 31450,
        gainLoss: 3700,
        gainLossPercent: 13.33,
        portfolioPercent: 2.2,
        peRatio: 35.1,
        earnings: '₹8,200 Cr',
        lastUpdated: new Date()
      },
      {
        id: '14',
        name: 'Pidilite Industries',
        symbol: 'PIDILITE.NS',
        sector: 'Consumer',
        exchange: 'NSE',
        quantity: 25,
        purchasePrice: 2400,
        currentPrice: 2800,
        investment: 60000,
        presentValue: 70000,
        gainLoss: 10000,
        gainLossPercent: 16.67,
        portfolioPercent: 4.7,
        peRatio: 42.5,
        earnings: '₹5,600 Cr',
        lastUpdated: new Date()
      },
      {
        id: '15',
        name: 'Tata Power',
        symbol: 'TATAPOWER.NS',
        sector: 'Power',
        exchange: 'NSE',
        quantity: 200,
        purchasePrice: 220,
        currentPrice: 350,
        investment: 44000,
        presentValue: 70000,
        gainLoss: 26000,
        gainLossPercent: 59.09,
        portfolioPercent: 3.4,
        peRatio: 28.7,
        earnings: '₹12,400 Cr',
        lastUpdated: new Date()
      },
      {
        id: '16',
        name: 'KPI Green Energy',
        symbol: 'KPIGREEN.NS',
        sector: 'Power',
        exchange: 'NSE',
        quantity: 150,
        purchasePrice: 435,
        currentPrice: 200,
        investment: 65250,
        presentValue: 30000,
        gainLoss: -35250,
        gainLossPercent: -54.02,
        portfolioPercent: 5.1,
        peRatio: 12.8,
        earnings: '₹450 Cr',
        lastUpdated: new Date()
      },
      {
        id: '17',
        name: 'Suzlon Energy',
        symbol: 'SUZLON.NS',
        sector: 'Power',
        exchange: 'NSE',
        quantity: 500,
        purchasePrice: 38,
        currentPrice: 45,
        investment: 19000,
        presentValue: 22500,
        gainLoss: 3500,
        gainLossPercent: 18.42,
        portfolioPercent: 1.5,
        peRatio: 8.5,
        earnings: '₹850 Cr',
        lastUpdated: new Date()
      },
      {
        id: '18',
        name: 'Gensol Engineering',
        symbol: 'GENSOL.NS',
        sector: 'Power',
        exchange: 'NSE',
        quantity: 100,
        purchasePrice: 400,
        currentPrice: 150,
        investment: 40000,
        presentValue: 15000,
        gainLoss: -25000,
        gainLossPercent: -62.5,
        portfolioPercent: 3.1,
        peRatio: 8.5,
        earnings: '₹450 Cr',
        lastUpdated: new Date()
      },
      {
        id: '19',
        name: 'Hariom Pipe Industries',
        symbol: 'HARIOMPIPE.NS',
        sector: 'Pipe Sector',
        exchange: 'NSE',
        quantity: 200,
        purchasePrice: 410,
        currentPrice: 250,
        investment: 82000,
        presentValue: 50000,
        gainLoss: -32000,
        gainLossPercent: -39.02,
        portfolioPercent: 6.4,
        peRatio: 18.5,
        earnings: '₹650 Cr',
        lastUpdated: new Date()
      },
      {
        id: '20',
        name: 'Astral Limited',
        symbol: 'ASTRAL.NS',
        sector: 'Pipe Sector',
        exchange: 'NSE',
        quantity: 40,
        purchasePrice: 1850,
        currentPrice: 2200,
        investment: 74000,
        presentValue: 88000,
        gainLoss: 14000,
        gainLossPercent: 18.92,
        portfolioPercent: 5.8,
        peRatio: 28.5,
        earnings: '₹1,200 Cr',
        lastUpdated: new Date()
      },
      {
        id: '21',
        name: 'Polycab India',
        symbol: 'POLYCAB.NS',
        sector: 'Pipe Sector',
        exchange: 'NSE',
        quantity: 30,
        purchasePrice: 2500,
        currentPrice: 4500,
        investment: 75000,
        presentValue: 135000,
        gainLoss: 60000,
        gainLossPercent: 80.0,
        portfolioPercent: 5.8,
        peRatio: 25.3,
        earnings: '₹8,900 Cr',
        lastUpdated: new Date()
      },
      {
        id: '22',
        name: 'Clean Science',
        symbol: 'CLEANSCI.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 60,
        purchasePrice: 1800,
        currentPrice: 1650,
        investment: 108000,
        presentValue: 99000,
        gainLoss: -9000,
        gainLossPercent: -8.33,
        portfolioPercent: 8.4,
        peRatio: 22.5,
        earnings: '₹850 Cr',
        lastUpdated: new Date()
      },
      {
        id: '23',
        name: 'Deepak Nitrite',
        symbol: 'DEEPAKNTR.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 45,
        purchasePrice: 2200,
        currentPrice: 2650,
        investment: 99000,
        presentValue: 119250,
        gainLoss: 20250,
        gainLossPercent: 20.45,
        portfolioPercent: 7.7,
        peRatio: 18.8,
        earnings: '₹1,850 Cr',
        lastUpdated: new Date()
      },
      {
        id: '24',
        name: 'Fine Organic',
        symbol: 'FINEORG.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 35,
        purchasePrice: 4500,
        currentPrice: 5200,
        investment: 157500,
        presentValue: 182000,
        gainLoss: 24500,
        gainLossPercent: 15.56,
        portfolioPercent: 12.2,
        peRatio: 32.5,
        earnings: '₹650 Cr',
        lastUpdated: new Date()
      },
      {
        id: '25',
        name: 'Gravita India',
        symbol: 'GRAVITA.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 80,
        purchasePrice: 1200,
        currentPrice: 1450,
        investment: 96000,
        presentValue: 116000,
        gainLoss: 20000,
        gainLossPercent: 20.83,
        portfolioPercent: 7.5,
        peRatio: 15.2,
        earnings: '₹450 Cr',
        lastUpdated: new Date()
      },
      {
        id: '26',
        name: 'SBI Life Insurance',
        symbol: 'SBILIFE.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 50,
        purchasePrice: 1350,
        currentPrice: 1580,
        investment: 67500,
        presentValue: 79000,
        gainLoss: 11500,
        gainLossPercent: 17.04,
        portfolioPercent: 5.2,
        peRatio: 28.5,
        earnings: '₹8,500 Cr',
        lastUpdated: new Date()
      },
     
      {
        id: '27',
        name: 'Infosys',
        symbol: 'INFY.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 15,
        purchasePrice: 1200,
        currentPrice: 1450,
        investment: 18000,
        presentValue: 21750,
        gainLoss: 3750,
        gainLossPercent: 20.83,
        portfolioPercent: 1.4,
        peRatio: 22.8,
        earnings: '₹65,000 Cr',
        lastUpdated: new Date()
      },
      {
        id: '28',
        name: 'Happiest Minds',
        symbol: 'HAPPSTMNDS.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 120,
        purchasePrice: 850,
        currentPrice: 920,
        investment: 102000,
        presentValue: 110400,
        gainLoss: 8400,
        gainLossPercent: 8.24,
        portfolioPercent: 7.9,
        peRatio: 28.5,
        earnings: '₹450 Cr',
        lastUpdated: new Date()
      },
      {
        id: '29',
        name: 'EaseMyTrip',
        symbol: 'EASEMYTRIP.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 200,
        purchasePrice: 45,
        currentPrice: 38,
        investment: 9000,
        presentValue: 7600,
        gainLoss: -1400,
        gainLossPercent: -15.56,
        portfolioPercent: 0.7,
        peRatio: 18.5,
        earnings: '₹250 Cr',
        lastUpdated: new Date()
      }
    ];

    
    const totalInvestment = sampleStocks.reduce((sum, stock) => sum + stock.investment, 0);
    const currentValue = sampleStocks.reduce((sum, stock) => sum + stock.presentValue, 0);
    const totalGainLoss = currentValue - totalInvestment;
    const totalGainLossPercent = (totalGainLoss / totalInvestment) * 100;

    
    sampleStocks.forEach(stock => {
      stock.portfolioPercent = (stock.investment / totalInvestment) * 100;
      
    
      const enhancedMetrics = generateEnhancedMetrics(stock);
      Object.assign(stock, enhancedMetrics);
      
      
      const aiRec = generateAIRecommendation(stock);
      stock.aiRecommendation = aiRec.action;
      stock.aiRecommendationReason = aiRec.reason;
    });

    setPortfolio({
      stocks: sampleStocks,
      totalInvestment,
      currentValue,
      totalGainLoss,
      totalGainLossPercent
    });
  }, []);

  const fetchStockData = useCallback(async () => {
    if (portfolio.stocks.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const symbols = portfolio.stocks.map(stock => stock.symbol).join(',');
      const response = await fetch(`/api/stocks?symbols=${symbols}`);
      
      if (!response.ok) {
        console.warn('Stock data fetch failed:', response.statusText);
        setError('Unable to update stock data. Showing cached data.');
        return;
      }

      
      const stockData = await response.json();
      
      
      const updatedStocks = portfolio.stocks.map(stock => {
        const newData = stockData[stock.symbol];
        if (newData) {
          const currentPrice = newData.currentPrice || stock.currentPrice;
          const presentValue = stock.quantity * currentPrice;
          const gainLoss = presentValue - stock.investment;
          const gainLossPercent = (gainLoss / stock.investment) * 100;
          
          const updatedStock = {
            ...stock,
            currentPrice,
            presentValue,
            gainLoss,
            gainLossPercent,
            peRatio: newData.peRatio || stock.peRatio,
            earnings: newData.earnings || stock.earnings,
            lastUpdated: new Date()
          };
          
          
          const aiRec = generateAIRecommendation(updatedStock);
          updatedStock.aiRecommendation = aiRec.action;
          updatedStock.aiRecommendationReason = aiRec.reason;
          
          return updatedStock;
        }
        return stock;
      });

     
      const totalInvestment = updatedStocks.reduce((sum, stock) => sum + stock.investment, 0);
      const currentValue = updatedStocks.reduce((sum, stock) => sum + stock.presentValue, 0);
      const totalGainLoss = currentValue - totalInvestment;
      const totalGainLossPercent = (totalGainLoss / totalInvestment) * 100;

      setPortfolio({
        stocks: updatedStocks,
        totalInvestment,
        currentValue,
        totalGainLoss,
        totalGainLossPercent
      });

      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch stock data. Using cached data.');
      console.error('Stock data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [portfolio.stocks]);

 
  useEffect(() => {
    if (autoRefresh && portfolio.stocks.length > 0) {
      const interval = setInterval(fetchStockData, 15000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchStockData, portfolio.stocks.length]);

  
  useEffect(() => {
    initializePortfolio();
  }, [initializePortfolio]);

 
  const getSectorSummaries = (): SectorSummaryType[] => {
    const sectorMap = new Map<string, SectorSummaryType>();

    portfolio.stocks.forEach(stock => {
      if (sectorMap.has(stock.sector)) {
        const existing = sectorMap.get(stock.sector)!;
        existing.totalStocks += 1;
        existing.totalInvestment += stock.investment;
        existing.currentValue += stock.presentValue;
        existing.gainLoss += stock.gainLoss;
      } else {
        sectorMap.set(stock.sector, {
          sector: stock.sector,
          totalStocks: 1,
          totalInvestment: stock.investment,
          currentValue: stock.presentValue,
          gainLoss: stock.gainLoss,
          gainLossPercent: 0,
          portfolioPercent: 0
        });
      }
    });

    
    const sectors = Array.from(sectorMap.values());
    sectors.forEach(sector => {
      sector.gainLossPercent = (sector.gainLoss / sector.totalInvestment) * 100;
      sector.portfolioPercent = (sector.totalInvestment / portfolio.totalInvestment) * 100;
    });

    return sectors.sort((a, b) => b.currentValue - a.currentValue);
  };

  const stockRecommendations: StockRecommendation[] = [
   
    { stock: 'KPIT Tech', gainPercent: 89.47, remarks: 'High return, but now overvalued. Consider partial profit booking.', action: 'book-profit' },
    { stock: 'Polycab', gainPercent: 80.0, remarks: 'Excellent growth and fundamentals. Continue to hold/add on dips.', action: 'hold' },
    { stock: 'Tata Power', gainPercent: 59.09, remarks: 'Stable growth, still has long-term potential in renewables. Hold.', action: 'hold' },
    { stock: 'ICICI Bank', gainPercent: 50.0, remarks: 'Strong core bank with excellent fundamentals. Hold/Increase stake.', action: 'add' },
    { stock: 'LTI Mindtree', gainPercent: 38.10, remarks: 'Strong IT services company with good fundamentals. Hold.', action: 'hold' },
    { stock: 'Bajaj Finance', gainPercent: 46.07, remarks: 'Great run; growth slowing due to valuations. Hold, trim slightly.', action: 'reduce' },
    { stock: 'Affle India', gainPercent: 26.32, remarks: 'Good growth but volatile. Hold, track closely.', action: 'hold' },
    { stock: 'HDFC Bank', gainPercent: 22.07, remarks: 'Underperformed peers. Wait for re-rating. Hold.', action: 'hold' },
    { stock: 'Infosys', gainPercent: 20.83, remarks: 'Stable IT giant with consistent performance. Hold.', action: 'hold' },
    { stock: 'Gravita India', gainPercent: 20.83, remarks: 'Good recycling business model. Hold for long term.', action: 'hold' },
    { stock: 'Deepak Nitrite', gainPercent: 20.45, remarks: 'Strong chemical company with good prospects. Hold.', action: 'hold' },
  
    { stock: 'HDFC Bank', gainPercent: 22.07, remarks: 'Underperformed peers. Wait for re-rating. Hold.', action: 'hold' },
    { stock: 'Astral Limited', gainPercent: 18.92, remarks: 'Good pipe company with steady growth. Hold.', action: 'hold' },
    { stock: 'Suzlon Energy', gainPercent: 18.42, remarks: 'Turnaround stock, high risk. Exit, better alternatives.', action: 'exit' },
    { stock: 'SBI Life Insurance', gainPercent: 17.04, remarks: 'Stable insurance play. Hold for dividends.', action: 'hold' },
    { stock: 'Pidilite', gainPercent: 16.67, remarks: 'Quality stock, but valuation is rich. Hold, not adding.', action: 'hold' },
    { stock: 'Fine Organic', gainPercent: 15.56, remarks: 'Specialty chemical company. Hold for growth.', action: 'hold' },
    { stock: 'Tata Consumer', gainPercent: 13.33, remarks: 'Stable FMCG exposure. Hold.', action: 'hold' },
    { stock: 'Bajaj Auto', gainPercent: 11.76, remarks: 'Auto sector recovery play. Hold for medium term.', action: 'hold' },
    { stock: 'Happiest Minds', gainPercent: 8.24, remarks: 'Small IT company with potential. Hold.', action: 'hold' },
    

    { stock: 'DMart', gainPercent: -7.89, remarks: 'Valuation too high; Exit. Better FMCG plays exist.', action: 'exit' },
    { stock: 'Clean Science', gainPercent: -8.33, remarks: 'Temporary weakness in specialty chemicals. Hold.', action: 'hold' },
    { stock: 'EaseMyTrip', gainPercent: -15.56, remarks: 'Travel sector still recovering. Hold for recovery.', action: 'hold' },
    { stock: 'BLS E-Services', gainPercent: -33.33, remarks: 'Growth unconvincing; Exit.', action: 'exit' },
    { stock: 'Savani Financials', gainPercent: -37.93, remarks: 'No clarity on earnings. Exit.', action: 'exit' },
    { stock: 'Tata Technologies', gainPercent: -37.93, remarks: 'IPO hype fading. Exit, can re-enter lower.', action: 'exit' },
    { stock: 'Hariom Pipes', gainPercent: -39.02, remarks: 'Weak growth visibility. Exit.', action: 'exit' },
    { stock: 'KPI Green', gainPercent: -54.02, remarks: 'Over-leveraged, weak fundamentals. Exit.', action: 'exit' },
    { stock: 'Tanla Platforms', gainPercent: -60.0, remarks: 'Business model weak; Exit.', action: 'exit' },
    { stock: 'Gensol', gainPercent: -62.5, remarks: 'Too volatile, poor cash flow. Exit immediately.', action: 'exit' }
  ];

  
  const sectorAllocations: SectorAllocation[] = [
    { sector: 'Financial Sector', currentAllocation: 25, idealAllocation: '30–35% (reduce small caps)' },
    { sector: 'Information Technology', currentAllocation: 28, idealAllocation: '20–25% (consolidate winners only)' },
    { sector: 'Consumer', currentAllocation: 12, idealAllocation: '15–20%' },
    { sector: 'Power', currentAllocation: 15, idealAllocation: '10–15% (keep only quality)' },
    { sector: 'Pipe Sector', currentAllocation: 8, idealAllocation: '5–10% (retain only strong balance sheets)' },
    { sector: 'Others', currentAllocation: 12, idealAllocation: '10–15% (diversification)' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Excel file uploaded:', file.name);
      
      initializePortfolio();
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
      
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time stock portfolio tracking with live Yahoo Finance & Google Finance data</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Excel
                </Button>
              </label>
            </div>
            
            <Button 
              variant="outline" 
              onClick={toggleAutoRefresh}
              className={autoRefresh ? 'bg-green-50 border-green-300' : ''}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            
            <Button onClick={fetchStockData} disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Data
            </Button>
          </div>
        </div>

        
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Data Sources</h3>
                
              </div>
            </div>
          </CardContent>
        </Card>

        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

       
        {lastUpdated && (
          <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Last updated: {lastUpdated.toLocaleString()}
            {autoRefresh && <Badge variant="secondary">Auto-refreshing every 15s</Badge>}
          </div>
        )}

        <PortfolioStats portfolio={portfolio} loading={loading} />

       
        <div className="mb-8">
          <SectorAnalysis 
            sectorSummaries={getSectorSummaries()}
            stockRecommendations={stockRecommendations}
            sectorAllocations={sectorAllocations}
          />
        </div>

        
        <div className="mb-8">
          <PortfolioTable stocks={portfolio.stocks} loading={loading} />
        </div>

        
        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              
              © 2025 Built by Adiytisuman. All rights reserved.
            </CardTitle>
          </CardHeader>
          
        </Card>

        
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Disclaimer:</strong> This portfoilio is made by adiytisuman for test purposes not valid for real time drag and drop analytics of your portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}
