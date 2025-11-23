import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getStockPrice } from "@/lib/massiveApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from "chart.js";
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const Portfolio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [highlightedStock, setHighlightedStock] = useState<any | null>(null);
  const [newStock, setNewStock] = useState({ symbol: "", shares: "", price: "", date: "" });
  const [addingStock, setAddingStock] = useState(false);
  const [sellingStock, setSellingStock] = useState(false);
  const [sellData, setSellData] = useState({ symbol: "", shares: "" });
  const [loadingStock, setLoadingStock] = useState(false);
  const [errorStock, setErrorStock] = useState("");
  const [pricesFetched, setPricesFetched] = useState(false);
  const [customAccountName, setCustomAccountName] = useState("");
  const [renamingAccount, setRenamingAccount] = useState(false);

  const accountTypes = [
    "Personal",
    "TFSA",
    "RRSP",
    "FHSA",
    "Maternity Saving Fund",
    "Emergency Fund",
    "Other"
  ];

  const handleRenameAccount = async () => {
    if (!customAccountName.trim() || !selectedAccount || selectedAccount.type !== "Other") return;
    
    const updatedAccounts = accounts.map(acc => 
      acc.type === "Other" 
        ? { ...acc, displayName: customAccountName.trim() }
        : acc
    );
    
    setAccounts(updatedAccounts);
    setSelectedAccount({ ...selectedAccount, displayName: customAccountName.trim() });
    setRenamingAccount(false);
    setCustomAccountName("");
    
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        portfolioAccounts: updatedAccounts
      }, { merge: true });
    }
  };

  const getContributions = () => {
    if (!selectedAccount) return { past: [], next: null };
    return {
      past: selectedAccount.contributions || [],
      next: selectedAccount.nextContribution || null
    };
  };

  const handleSellStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStock(true);
    setErrorStock("");
    try {
      const symbol = sellData.symbol.trim().toUpperCase();
      const sharesToSell = parseFloat(sellData.shares);
      if (!symbol || isNaN(sharesToSell) || sharesToSell <= 0) {
        setErrorStock("Please enter valid symbol and shares to sell.");
        setLoadingStock(false);
        return;
      }
      let updatedAccounts = accounts.map(acc => ({ ...acc }));
      const accountIdx = updatedAccounts.findIndex(acc => acc.type === (selectedAccount?.type || "Personal"));
      if (accountIdx === -1) {
        setErrorStock("Account not found.");
        setLoadingStock(false);
        return;
      }
      const account = updatedAccounts[accountIdx];
      const holdingIdx = account.holdings.findIndex((h: any) => h.symbol === symbol);
      if (holdingIdx === -1) {
        setErrorStock("Stock not found in holdings.");
        setLoadingStock(false);
        return;
      }
      const holding = account.holdings[holdingIdx];
      if (sharesToSell > holding.shares) {
        setErrorStock("You don't own that many shares.");
        setLoadingStock(false);
        return;
      }
      const newShares = holding.shares - sharesToSell;
      if (newShares === 0) {
        account.holdings.splice(holdingIdx, 1);
      } else {
        const newValue = newShares * holding.purchasePrice;
        const newCurrentValue = newShares * (holding.currentPrice ?? holding.purchasePrice);
        account.holdings[holdingIdx] = {
          ...holding,
          shares: newShares,
          value: newValue,
          currentValue: newCurrentValue
        };
      }
      setAccounts(updatedAccounts);
      setSelectedAccount(account);
      setSellData({ symbol: "", shares: "" });
      setSellingStock(false);
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          portfolioAccounts: updatedAccounts
        }, { merge: true });
      }
    } catch (err) {
      setErrorStock("Failed to sell stock.");
    }
    setLoadingStock(false);
  };

  useEffect(() => {
    const fetchHoldings = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.portfolioAccounts && data.portfolioAccounts.length > 0) {
          setAccounts(data.portfolioAccounts);
          setSelectedAccount(data.portfolioAccounts[0]);
        } else {
          const initialAccounts = accountTypes.map(type => ({
            type,
            displayName: type === "Other" ? "Other" : type,
            holdings: [],
            contributions: [],
            nextContribution: "",
            lastContributionDate: "",
            news: [],
          }));
          setAccounts(initialAccounts);
          setSelectedAccount(initialAccounts[0]);
          await setDoc(doc(db, "users", user.uid), {
            portfolioAccounts: initialAccounts
          }, { merge: true });
        }
      }
    };
    fetchHoldings();
  }, [user]);

  useEffect(() => {
    if (selectedAccount && selectedAccount.holdings && selectedAccount.holdings.length > 0) {
      const found = selectedAccount.holdings.find(
        (h: any) =>
          highlightedStock &&
          h.symbol === highlightedStock.symbol &&
          h.date === highlightedStock.date
      );
      if (!found) {
        setHighlightedStock(selectedAccount.holdings[0]);
      } else {
        setHighlightedStock(found);
      }
    } else {
      setHighlightedStock(null);
    }
  }, [selectedAccount?.type]);

  useEffect(() => {
    let isMounted = true;
    const updateHoldingsWithCurrentPrice = async () => {
      if (!accounts.length || pricesFetched) return;
      
      const updatedAccounts = await Promise.all(accounts.map(async (account) => {
        if (!account.holdings || account.holdings.length === 0) return account;
        
        const updatedHoldings = await Promise.all(account.holdings.map(async (h: any) => {
          if (!h.symbol || !h.purchasePrice || !h.shares) return h;
          try {
            const currentPrice = await getStockPrice(h.symbol);
            if (typeof currentPrice !== "number" || isNaN(currentPrice)) throw new Error("Invalid price");
            const currentValue = currentPrice * h.shares;
            const change = (((currentPrice - h.purchasePrice) / h.purchasePrice) * 100).toFixed(2);
            return { ...h, currentPrice, currentValue, change: parseFloat(change) };
          } catch (err) {
            console.error(`Error fetching price for ${h.symbol}:`, err);
            return { ...h, currentPrice: h.purchasePrice, currentValue: h.value, change: 0 };
          }
        }));
        
        return { ...account, holdings: updatedHoldings };
      }));

      if (isMounted) {
        setAccounts(updatedAccounts);
        
        if (selectedAccount) {
          const newSelected = updatedAccounts.find(acc => acc.type === selectedAccount.type);
          if (newSelected) {
            setSelectedAccount(newSelected);
            
            if (highlightedStock) {
              const found = newSelected.holdings.find(
                (h: any) =>
                  h.symbol === highlightedStock.symbol &&
                  h.date === highlightedStock.date
              );
              if (found) {
                setHighlightedStock(found);
              } else if (newSelected.holdings.length > 0) {
                setHighlightedStock(newSelected.holdings[0]);
              } else {
                setHighlightedStock(null);
              }
            } else if (newSelected.holdings.length > 0) {
              setHighlightedStock(newSelected.holdings[0]);
            }
          }
        }
        
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            portfolioAccounts: updatedAccounts
          }, { merge: true });
        }
        
        setPricesFetched(true);
      }
    };

    if (accounts.length > 0 && !pricesFetched) {
      updateHoldingsWithCurrentPrice();
    }

    return () => { isMounted = false; };
  }, [accounts.length, pricesFetched, user]);

  const buildPerformance = () => {
    if (!selectedAccount || !selectedAccount.holdings) return { labels: [], perf: [] };
    const today = new Date();
    const points: { dateStr: string, value: number, isBuy: boolean }[] = [];
    selectedAccount.holdings.forEach((h: any) => {
      if (!h.date) return;
      const buyDateStr = new Date(h.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      points.push({ dateStr: buyDateStr, value: h.value, isBuy: true });
      const todayStr = today.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      points.push({ dateStr: todayStr, value: h.currentValue ?? h.value, isBuy: false });
    });
    const dateMap: Record<string, { value: number, isBuy: boolean }> = {};
    points.forEach(p => {
      if (dateMap[p.dateStr]) {
        dateMap[p.dateStr].value += p.value;
        dateMap[p.dateStr].isBuy = dateMap[p.dateStr].isBuy || p.isBuy;
      } else {
        dateMap[p.dateStr] = { value: p.value, isBuy: p.isBuy };
      }
    });
    const sortedDates = Object.keys(dateMap).sort((a, b) => {
      const parse = (str: string) => {
        const [month, year] = str.split(" ");
        return new Date(`${month} 1, 20${year}`);
      };
      return parse(a).getTime() - parse(b).getTime();
    });
    const perf: number[] = [];
    sortedDates.forEach((date, idx) => {
      const val = dateMap[date].value;
      if (idx > 0 && dateMap[date].isBuy && val > perf[idx - 1]) {
        perf[idx - 1] = val;
      }
      perf.push(val);
    });
    return {
      labels: sortedDates,
      perf
    };
  };

  const perfData = buildPerformance();
  const lineData = {
    labels: perfData.labels,
    datasets: [
      {
        label: selectedAccount ? `${selectedAccount.displayName || selectedAccount.type} Performance` : "Performance",
        data: perfData.perf,
        fill: false,
        borderColor: "#6366f1",
        backgroundColor: "#6366f1",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#6366f1",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e5e7eb" }, beginAtZero: true },
    },
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStock(true);
    setErrorStock("");
    try {
      const symbol = newStock.symbol.trim().toUpperCase();
      const shares = parseFloat(newStock.shares);
      const price = parseFloat(newStock.price);
      const date = newStock.date;
      if (!symbol || isNaN(shares) || isNaN(price) || shares <= 0 || price <= 0 || !date) {
        setErrorStock("Please enter valid symbol, shares, price, and date.");
        setLoadingStock(false);
        return;
      }

      let currentPrice = price;
      let currentValue = shares * price;
      let change = 0;
      try {
        currentPrice = await getStockPrice(symbol);
        if (typeof currentPrice === "number" && !isNaN(currentPrice)) {
          currentValue = currentPrice * shares;
          change = parseFloat((((currentPrice - price) / price) * 100).toFixed(2));
        }
      } catch (err) {
        console.error(`Error fetching price for ${symbol}:`, err);
      }

      let updatedAccounts;
      if (accounts.length === 0) {
        updatedAccounts = accountTypes.map(type => ({
          type,
          displayName: type === "Other" ? "Other" : type,
          holdings: [],
          contributions: [],
          nextContribution: "",
          lastContributionDate: "",
          news: [],
        }));
      } else {
        updatedAccounts = accounts.map(acc => ({ ...acc }));
      }

      const accountIdx = updatedAccounts.findIndex(acc => acc.type === (selectedAccount?.type || "Personal"));
      if (accountIdx === -1) {
        setErrorStock("Account not found.");
        setLoadingStock(false);
        return;
      }
      const account = updatedAccounts[accountIdx];
      
      const contributionAmount = shares * price;
      if (!account.contributions) account.contributions = [];
      account.contributions.push(contributionAmount);

      const today = new Date();
      const lastContributionDate = account.contributions.length > 1 
        ? new Date(account.lastContributionDate || date)
        : new Date(date);
      
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      if (lastContributionDate < oneMonthAgo) {
        account.nextContribution = "ASAP";
      } else {
        const nextDate = new Date(lastContributionDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        account.nextContribution = nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      
      account.lastContributionDate = date;

      const existing = account.holdings.find((h: any) => h.symbol === symbol);
      if (existing) {
        const totalShares = existing.shares + shares;
        const weightedPrice = ((existing.purchasePrice * existing.shares) + (price * shares)) / totalShares;
        const latestDate = new Date(existing.date) > new Date(date) ? existing.date : date;
        let mergedCurrentPrice = currentPrice;
        let mergedCurrentValue = currentPrice * totalShares;
        let mergedChange = 0;
        if (typeof currentPrice === "number" && !isNaN(currentPrice)) {
          mergedChange = parseFloat((((currentPrice - weightedPrice) / weightedPrice) * 100).toFixed(2));
        }
        const mergedHolding = {
          ...existing,
          shares: totalShares,
          purchasePrice: weightedPrice,
          date: latestDate,
          currentPrice: mergedCurrentPrice,
          currentValue: mergedCurrentValue,
          value: totalShares * weightedPrice,
          change: mergedChange,
        };
        account.holdings = account.holdings.map((h: any) => h.symbol === symbol ? mergedHolding : h);
        setHighlightedStock(mergedHolding);
      } else {
        const newHolding = {
          name: symbol,
          symbol,
          value: shares * price,
          change,
          shares,
          purchasePrice: price,
          date,
          currentPrice,
          currentValue
        };
        account.holdings.push(newHolding);
        setHighlightedStock(newHolding);
      }
      setAccounts(updatedAccounts);
      setSelectedAccount(account);

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          portfolioAccounts: updatedAccounts
        }, { merge: true });
      }

      setNewStock({ symbol: "", shares: "", price: "", date: "" });
      setAddingStock(false);
    } catch (err) {
      setErrorStock("Failed to add stock.");
    }
    setLoadingStock(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>← Go Back</Button>
        </div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.png" alt="Portfolio Logo" className="logo" style={{ height: '2em', width: '2em', marginRight: '0.5em' }} />
            <h1 className="text-2xl font-bold">My Portfolio</h1>
          </div>
          <p className="read-the-docs">Track your investments and performance</p>
        </div>

        <div className="mb-6">
          {accounts.length > 0 ? (
            <>
              <div className="flex gap-2 mb-4 flex-wrap">
                {accounts.map((account) => {
                  const isActive = selectedAccount && selectedAccount.type === account.type;
                  return (
                    <Button
                      key={account.type}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setSelectedAccount(account)}
                      className="flex-1 min-w-[120px]"
                    >
                      {account.displayName || account.type}
                      {account.type === "Other" && isActive && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingAccount(true);
                          }}
                          className="ml-2 text-xs underline"
                        >
                          rename
                        </button>
                      )}
                    </Button>
                  );
                })}
              </div>
              
              {renamingAccount && selectedAccount?.type === "Other" && (
                <div className="mb-4 p-3 bg-secondary/10 rounded">
                  <input
                    type="text"
                    placeholder="Enter custom account name"
                    className="w-full border rounded px-2 py-1 mb-2"
                    value={customAccountName}
                    onChange={e => setCustomAccountName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleRenameAccount}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setRenamingAccount(false);
                      setCustomAccountName("");
                    }}>Cancel</Button>
                  </div>
                </div>
              )}
              
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold">Total Value</h2>
                <p className="text-3xl font-bold">{selectedAccount ? selectedAccount.holdings.reduce((sum: number, h: any) => sum + (h.currentValue ?? h.value), 0).toLocaleString("en-US", { style: "currency", currency: "USD" }) : "$0.00"}</p>
              </div>
            </>
          ) : (
            <div className="flex gap-2 mb-4 flex-wrap">
              {accountTypes.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  className="flex-1 min-w-[120px] opacity-50"
                  disabled
                >
                  {type}
                </Button>
              ))}
            </div>
          )}

          {selectedAccount && (!selectedAccount.holdings || selectedAccount.holdings.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12">
              <img src="/logo.png" alt="Portfolio Logo" className="logo mb-4" style={{ height: '2em', width: '2em' }} />
              <h2 className="text-xl font-bold mb-2">No holdings in {selectedAccount.displayName || selectedAccount.type}</h2>
              <p className="read-the-docs mb-6">Get started by adding your first stock to this account.</p>
              <Button size="lg" variant="default" onClick={() => setAddingStock(true)}>
                Add Stock
              </Button>
              {addingStock && (
                <form className="mt-6 w-full max-w-sm space-y-2" onSubmit={handleAddStock}>
                  <input
                    type="text"
                    placeholder="Symbol (e.g. AAPL)"
                    className="w-full border rounded px-2 py-1"
                    value={newStock.symbol}
                    onChange={e => setNewStock({ ...newStock, symbol: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Shares"
                    className="w-full border rounded px-2 py-1"
                    value={newStock.shares}
                    onChange={e => setNewStock({ ...newStock, shares: e.target.value })}
                    required
                    min={1}
                  />
                  <input
                    type="number"
                    placeholder="Buy Price"
                    className="w-full border rounded px-2 py-1"
                    value={newStock.price}
                    onChange={e => setNewStock({ ...newStock, price: e.target.value })}
                    required
                    min={0.01}
                    step={0.01}
                  />
                  <input
                    type="date"
                    placeholder="Purchase Date"
                    className="w-full border rounded px-2 py-1"
                    value={newStock.date}
                    onChange={e => setNewStock({ ...newStock, date: e.target.value })}
                    required
                  />
                  <button type="submit" className="w-full bg-primary text-white rounded py-1" disabled={loadingStock}>
                    {loadingStock ? "Adding..." : "Add"}
                  </button>
                  {errorStock && <div className="text-xs text-red-600 mt-1">{errorStock}</div>}
                </form>
              )}
            </div>
          )}
          
          {selectedAccount && selectedAccount.holdings && selectedAccount.holdings.length > 0 && (
            <Card className="p-4 mb-6 card">
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">{selectedAccount.displayName || selectedAccount.type} Performance</h3>
                <div className="bg-white rounded-lg shadow p-4">
                  <Line data={lineData} options={lineOptions} height={200} />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="bg-secondary/10 rounded p-4 w-full">
                  <h4 className="text-sm font-medium mb-2 read-the-docs">Stock Viewer</h4>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {selectedAccount.holdings.map((holding: any, idx: number) => (
                      <Button
                        key={holding.symbol + holding.date + idx}
                        variant={highlightedStock && highlightedStock.symbol === holding.symbol && highlightedStock.date === holding.date ? "default" : "outline"}
                        size="sm"
                        onClick={() => setHighlightedStock(holding)}
                      >
                        {holding.symbol}
                      </Button>
                    ))}
                  </div>
                  
                  {highlightedStock && (
                    <div className="bg-white rounded p-3 shadow mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{highlightedStock.name}</span>
                        <span className={`text-sm ${highlightedStock.change >= 0 ? "text-green-600" : "text-red-600"}`}>{highlightedStock.change >= 0 ? "+" : ""}{highlightedStock.change}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current Value</span>
                        <span>{(highlightedStock.currentValue ?? highlightedStock.value).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
                      </div>
                      {highlightedStock.shares && highlightedStock.purchasePrice && (
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Shares</span>
                          <span>{highlightedStock.shares}</span>
                          <span>Buy Price</span>
                          <span>${highlightedStock.purchasePrice.toFixed(2)}</span>
                          <span>Current Price</span>
                          <span>${(highlightedStock.currentPrice ?? highlightedStock.purchasePrice).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setAddingStock(!addingStock)}>
                      {addingStock ? "Cancel" : "Add Stock"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSellingStock(!sellingStock)}>
                      {sellingStock ? "Cancel" : "Sell Stock"}
                    </Button>
                  </div>
                  {addingStock && (
                    <form className="mt-2 space-y-2" onSubmit={handleAddStock}>
                      <input
                        type="text"
                        placeholder="Symbol (e.g. AAPL)"
                        className="w-full border rounded px-2 py-1"
                        value={newStock.symbol}
                        onChange={e => setNewStock({ ...newStock, symbol: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Shares"
                        className="w-full border rounded px-2 py-1"
                        value={newStock.shares}
                        onChange={e => setNewStock({ ...newStock, shares: e.target.value })}
                        required
                        min={1}
                      />
                      <input
                        type="number"
                        placeholder="Buy Price"
                        className="w-full border rounded px-2 py-1"
                        value={newStock.price}
                        onChange={e => setNewStock({ ...newStock, price: e.target.value })}
                        required
                        min={0.01}
                        step={0.01}
                      />
                      <input
                        type="date"
                        placeholder="Purchase Date"
                        className="w-full border rounded px-2 py-1"
                        value={newStock.date}
                        onChange={e => setNewStock({ ...newStock, date: e.target.value })}
                        required
                      />
                      <button type="submit" className="w-full bg-primary text-white rounded py-1" disabled={loadingStock}>
                        {loadingStock ? "Adding..." : "Add"}
                      </button>
                      {errorStock && <div className="text-xs text-red-600 mt-1">{errorStock}</div>}
                    </form>
                  )}
                  {sellingStock && (
                    <form className="mt-2 space-y-2" onSubmit={handleSellStock}>
                      <input
                        type="text"
                        placeholder="Symbol (e.g. AAPL)"
                        className="w-full border rounded px-2 py-1"
                        value={sellData.symbol}
                        onChange={e => setSellData({ ...sellData, symbol: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Shares to Sell"
                        className="w-full border rounded px-2 py-1"
                        value={sellData.shares}
                        onChange={e => setSellData({ ...sellData, shares: e.target.value })}
                        required
                        min={1}
                      />
                      <button type="submit" className="w-full bg-primary text-white rounded py-1" disabled={loadingStock}>
                        {loadingStock ? "Selling..." : "Sell"}
                      </button>
                      {errorStock && <div className="text-xs text-red-600 mt-1">{errorStock}</div>}
                    </form>
                  )}
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Past Contributions</h4>
                  <ul className="list-disc pl-4 text-sm">
                    {getContributions().past.length > 0 ? (
                      getContributions().past.map((amt: any, idx: number) => (
                        <li key={idx}>{typeof amt === 'number' ? amt.toLocaleString("en-US", { style: "currency", currency: "USD" }) : `${amt}`}</li>
                      ))
                    ) : (
                      <li>No contributions yet.</li>
                    )}
                  </ul>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Next Contribution</h4>
                  <div className="text-lg">{getContributions().next || "No upcoming contribution."}</div>
                </Card>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 read-the-docs">Holdings</h4>
                <ul className="space-y-2">
                  {selectedAccount.holdings.map((holding: any) => (
                    <li key={holding.symbol + holding.date} className="flex justify-between items-center p-2 rounded bg-secondary/10">
                      <span className="font-medium">{holding.name} <span className="text-xs text-muted-foreground">({holding.symbol})</span></span>
                      <span className="font-semibold">{(holding.currentValue ?? holding.value).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
                      <span className={`ml-2 text-sm ${holding.change >= 0 ? "text-green-600" : "text-red-600"}`}>{holding.change >= 0 ? "+" : ""}{holding.change}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </div>

        {selectedAccount && selectedAccount.holdings && selectedAccount.holdings.length > 0 && (
          <Card className="p-4 mt-8 card">
            <h4 className="text-md font-semibold mb-2">Portfolio Insights</h4>
            <ul className="list-disc pl-5 text-sm read-the-docs">
              <li>Diversified across ETFs, bonds, and equities</li>
              <li>Steady growth over the last 30 days</li>
              <li>Low management fees</li>
              <li>Automatic rebalancing</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Portfolio;