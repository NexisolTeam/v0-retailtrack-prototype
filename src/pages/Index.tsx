import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Package, TrendingUp, CreditCard, Users, ShoppingCart, DollarSign, AlertTriangle, Plus } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { StockManager } from "@/components/StockManager";
import { InventoryManager } from "@/components/InventoryManager";
import { SalesTracker } from "@/components/SalesTracker";
import { FinancialOverview } from "@/components/FinancialOverview";
import { UserManagement } from "@/components/UserManagement";
import { CustomerManagement } from "@/components/CustomerManagement";
import { BankAccountManager } from "@/components/BankAccountManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState("Admin"); // Admin, Sales, Accountant

  // Mock data for charts
  const dailySalesData = [
    { date: "Mon", income: 4500, expense: 2300 },
    { date: "Tue", income: 5200, expense: 2800 },
    { date: "Wed", income: 3800, expense: 2100 },
    { date: "Thu", income: 6100, expense: 3200 },
    { date: "Fri", income: 7300, expense: 3800 },
    { date: "Sat", income: 8900, expense: 4200 },
    { date: "Sun", income: 5600, expense: 2900 },
  ];

  const paymentMethodsData = [
    { name: "Cash", value: 45, color: "#0088FE" },
    { name: "Bank Transfer", value: 35, color: "#00C49F" },
    { name: "Mobile Pay", value: 15, color: "#FFBB28" },
    { name: "Credit", value: 5, color: "#FF8042" },
  ];

  const stockLevelsData = [
    { item: "Product A", stock: 120, min: 50 },
    { item: "Product B", stock: 35, min: 50 },
    { item: "Product C", stock: 89, min: 30 },
    { item: "Product D", stock: 15, min: 25 },
    { item: "Product E", stock: 67, min: 40 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RetailTrack</h1>
              <p className="text-gray-600 mt-1">Multi-Store Inventory & Financial Management</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {userRole}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,350</div>
                  <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding Credit</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,420</div>
                  <p className="text-xs text-muted-foreground">Across 23 customers</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Income vs Expense</CardTitle>
                  <CardDescription>Last 7 days comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="income" fill="#3b82f6" name="Income" />
                      <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Breakdown by payment type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Stock Levels Table */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels Overview</CardTitle>
                <CardDescription>Current inventory status across all stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockLevelsData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Package className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-sm text-gray-500">Min: {item.min} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${item.stock < item.min ? 'text-red-600' : 'text-green-600'}`}>
                          {item.stock} units
                        </p>
                        {item.stock < item.min && (
                          <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <StockManager userRole={userRole} />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager userRole={userRole} />
          </TabsContent>

          <TabsContent value="sales">
            <SalesTracker userRole={userRole} />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement userRole={userRole} />
          </TabsContent>

          <TabsContent value="banks">
            <BankAccountManager userRole={userRole} />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialOverview userRole={userRole} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement userRole={userRole} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
