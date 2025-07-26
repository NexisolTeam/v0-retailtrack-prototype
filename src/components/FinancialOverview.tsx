
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Plus, TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface FinancialOverviewProps {
  userRole: string;
}

interface Transaction {
  id: string;
  date: Date;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  source: string;
  reference: string;
  location: string;
}

interface CreditSale {
  id: string;
  customerName: string;
  amount: number;
  dueDate: Date;
  partialPayments: number;
  status: "pending" | "partial" | "paid";
  reference: string;
}

export const FinancialOverview = ({ userRole }: FinancialOverviewProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: new Date(),
      type: "income",
      category: "Sales",
      amount: 1500,
      description: "Daily sales revenue",
      source: "Store Sales",
      reference: "REF001",
      location: "Main Store"
    },
    {
      id: "2",
      date: new Date(),
      type: "expense",
      category: "Utilities",
      amount: 350,
      description: "Monthly electricity bill",
      source: "Electric Company",
      reference: "UTIL001",
      location: "Main Store"
    },
    {
      id: "3",
      date: new Date(Date.now() - 86400000),
      type: "income",
      category: "Services",
      amount: 800,
      description: "Consulting services",
      source: "Client Payment",
      reference: "SERV001",
      location: "Main Store"
    }
  ]);

  const [creditSales, setCreditSales] = useState<CreditSale[]>([
    {
      id: "1",
      customerName: "ABC Corporation",
      amount: 2500,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      partialPayments: 0,
      status: "pending",
      reference: "CR001"
    },
    {
      id: "2",
      customerName: "XYZ Ltd",
      amount: 1800,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      partialPayments: 600,
      status: "partial",
      reference: "CR002"
    }
  ]);

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
  
  const [transactionForm, setTransactionForm] = useState({
    type: "income" as const,
    category: "",
    amount: 0,
    description: "",
    source: "",
    reference: "",
    location: "Main Store"
  });

  const [creditForm, setCreditForm] = useState({
    customerName: "",
    amount: 0,
    dueDate: "",
    reference: ""
  });

  const incomeCategories = ["Sales", "Services", "Interest", "Other Income"];
  const expenseCategories = ["Utilities", "Rent", "Supplies", "Marketing", "Salaries", "Other Expenses"];
  const locations = ["Main Store", "Branch A", "Branch B"];

  const monthlyData = [
    { month: "Jan", income: 15000, expense: 8000 },
    { month: "Feb", income: 18000, expense: 9500 },
    { month: "Mar", income: 22000, expense: 11000 },
    { month: "Apr", income: 19000, expense: 10200 },
    { month: "May", income: 25000, expense: 12500 },
    { month: "Jun", income: 28000, expense: 13800 },
  ];

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalCredit = () => {
    return creditSales.reduce((sum, c) => sum + (c.amount - c.partialPayments), 0);
  };

  const getOverdueCredit = () => {
    return creditSales
      .filter(c => c.dueDate < new Date() && c.status !== "paid")
      .reduce((sum, c) => sum + (c.amount - c.partialPayments), 0);
  };

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date(),
      ...transactionForm
    };

    setTransactions([newTransaction, ...transactions]);
    setIsTransactionDialogOpen(false);
    resetTransactionForm();
    toast({
      title: "Transaction Added",
      description: "Financial transaction has been successfully recorded.",
    });
  };

  const handleAddCredit = () => {
    const newCredit: CreditSale = {
      id: Date.now().toString(),
      customerName: creditForm.customerName,
      amount: creditForm.amount,
      dueDate: new Date(creditForm.dueDate),
      partialPayments: 0,
      status: "pending",
      reference: creditForm.reference || `CR${Date.now()}`
    };

    setCreditSales([newCredit, ...creditSales]);
    setIsCreditDialogOpen(false);
    resetCreditForm();
    toast({
      title: "Credit Sale Added",
      description: "Credit sale has been successfully recorded.",
    });
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      type: "income",
      category: "",
      amount: 0,
      description: "",
      source: "",
      reference: "",
      location: "Main Store"
    });
  };

  const resetCreditForm = () => {
    setCreditForm({
      customerName: "",
      amount: 0,
      dueDate: "",
      reference: ""
    });
  };

  const canAdd = userRole === "Admin" || userRole === "Accountant";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
          <p className="text-gray-600">Track income, expenses, and credit sales</p>
        </div>
        
        {canAdd && (
          <div className="flex gap-2">
            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Transaction</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Financial Transaction</DialogTitle>
                  <DialogDescription>
                    Record a new income or expense transaction.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={transactionForm.type} onValueChange={(value: any) => setTransactionForm({...transactionForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={transactionForm.category} onValueChange={(value) => setTransactionForm({...transactionForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {(transactionForm.type === "income" ? incomeCategories : expenseCategories).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={transactionForm.amount}
                        onChange={(e) => setTransactionForm({...transactionForm, amount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference">Reference</Label>
                      <Input
                        id="reference"
                        value={transactionForm.reference}
                        onChange={(e) => setTransactionForm({...transactionForm, reference: e.target.value})}
                        placeholder="Reference number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      value={transactionForm.source}
                      onChange={(e) => setTransactionForm({...transactionForm, source: e.target.value})}
                      placeholder="Payment source or recipient"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={transactionForm.description}
                      onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                      placeholder="Transaction description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTransaction}>Add Transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Credit Sale</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Credit Sale</DialogTitle>
                  <DialogDescription>
                    Record a new credit sale to a customer.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={creditForm.customerName}
                      onChange={(e) => setCreditForm({...creditForm, customerName: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="creditAmount">Amount</Label>
                      <Input
                        id="creditAmount"
                        type="number"
                        step="0.01"
                        value={creditForm.amount}
                        onChange={(e) => setCreditForm({...creditForm, amount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={creditForm.dueDate}
                        onChange={(e) => setCreditForm({...creditForm, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="creditReference">Reference (Optional)</Label>
                    <Input
                      id="creditReference"
                      value={creditForm.reference}
                      onChange={(e) => setCreditForm({...creditForm, reference: e.target.value})}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCredit}>Add Credit Sale</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${getTotalIncome().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${getTotalExpenses().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTotalIncome() - getTotalExpenses() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(getTotalIncome() - getTotalExpenses()).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Credit</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${getTotalCredit().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${getOverdueCredit().toFixed(2)} overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income vs Expenses</CardTitle>
            <CardDescription>6-month trend comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Net Profit</CardTitle>
            <CardDescription>Profit/Loss over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData.map(d => ({ ...d, profit: d.income - d.expense }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="profit" fill="#3b82f6" name="Net Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="credit">Credit Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest income and expense records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{transaction.source}</span>
                          <span>•</span>
                          <span>{format(transaction.date, "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.reference}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit">
          <Card>
            <CardHeader>
              <CardTitle>Credit Sales</CardTitle>
              <CardDescription>Outstanding payments from customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditSales.map((credit) => (
                  <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold">{credit.customerName}</h3>
                        <Badge variant={
                          credit.status === "paid" ? "default" :
                          credit.status === "partial" ? "secondary" : "destructive"
                        }>
                          {credit.status}
                        </Badge>
                        {credit.dueDate < new Date() && credit.status !== "paid" && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Due Date:</span> {format(credit.dueDate, "MMM dd, yyyy")}
                        </div>
                        <div>
                          <span className="font-medium">Reference:</span> {credit.reference}
                        </div>
                        <div>
                          <span className="font-medium">Partial Payments:</span> ${credit.partialPayments.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-600">
                        ${(credit.amount - credit.partialPayments).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        of ${credit.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
