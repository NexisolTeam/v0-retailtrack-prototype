import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Search, Receipt, CreditCard, Calendar as CalendarIcon, DollarSign, Building, Banknote } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SalesTrackerProps {
  userRole: string;
}

interface Sale {
  id: string;
  date: Date;
  customerName: string;
  customerId?: string;
  items: Array<{
    name: string;
    code: string;
    quantity: number;
    price: number;
    discount: number;
    fromReceipt: boolean;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "Cash" | "Bank Transfer";
  bankAccountId?: string;
  bankAccountName?: string;
  paymentStatus: "paid" | "partial" | "pending";
  receiptNumber?: string;
  shopId: string;
  shopName: string;
  salesPerson: string;
  notes: string;
}

export const SalesTracker = ({ userRole }: SalesTrackerProps) => {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "1",
      date: new Date(),
      customerName: "John Doe",
      customerId: "1",
      items: [
        { name: "Wireless Headphones", code: "WH001", quantity: 1, price: 80, discount: 0, fromReceipt: true },
        { name: "Phone Case", code: "PC001", quantity: 2, price: 15, discount: 5, fromReceipt: false }
      ],
      subtotal: 110,
      discount: 5,
      total: 105,
      paymentMethod: "Bank Transfer",
      bankAccountId: "1",
      bankAccountName: "Main Business Account - First National Bank",
      paymentStatus: "paid",
      receiptNumber: "RCP001",
      shopId: "1",
      shopName: "Main Store",
      salesPerson: "Alice Smith",
      notes: "Customer requested gift wrapping"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [shopFilter, setShopFilter] = useState("all");
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerId: "",
    shopId: "",
    items: [{ name: "", code: "", quantity: 1, price: 0, discount: 0, fromReceipt: true }],
    paymentMethod: "Cash" as "Cash" | "Bank Transfer",
    bankAccountId: "",
    paymentStatus: "paid" as const,
    receiptNumber: "",
    notes: ""
  });

  const bankAccounts = [
    { id: "1", name: "Main Business Account - First National Bank" },
    { id: "2", name: "Savings Account - City Bank" },
    { id: "3", name: "Petty Cash Account - Local Bank" }
  ];

  const customers = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Walk-in Customer" }
  ];

  const shops = [
    { id: "1", name: "Main Store" },
    { id: "2", name: "Branch A" },
    { id: "3", name: "Branch B" }
  ];

  const availableItems = [
    { name: "Wireless Headphones", code: "WH001", price: 80, shopStock: { "1": 45, "2": 30, "3": 0 }, fromReceipt: true },
    { name: "Organic Coffee Beans", code: "CB002", price: 25, shopStock: { "1": 12, "2": 0, "3": 8 }, fromReceipt: false },
    { name: "Cotton T-Shirt", code: "TS003", price: 15, shopStock: { "1": 0, "2": 30, "3": 25 }, fromReceipt: true }
  ];

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === "all" || sale.paymentStatus === paymentFilter;
    const matchesShop = shopFilter === "all" || sale.shopId === shopFilter;
    const matchesDate = !selectedDate || sale.date.toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesPayment && matchesShop && matchesDate;
  });

  const handleAddSale = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalDiscount = formData.items.reduce((sum, item) => sum + item.discount, 0);
    
    const selectedShop = shops.find(s => s.id === formData.shopId);
    const selectedBank = bankAccounts.find(b => b.id === formData.bankAccountId);
    
    const newSale: Sale = {
      id: Date.now().toString(),
      date: new Date(),
      customerName: formData.customerName,
      customerId: formData.customerId,
      items: formData.items,
      subtotal,
      discount: totalDiscount,
      total: subtotal - totalDiscount,
      paymentMethod: formData.paymentMethod,
      bankAccountId: formData.bankAccountId,
      bankAccountName: selectedBank?.name,
      paymentStatus: formData.paymentStatus,
      receiptNumber: formData.receiptNumber || `RCP${Date.now()}`,
      shopId: formData.shopId,
      shopName: selectedShop?.name || "",
      salesPerson: "Current User",
      notes: formData.notes
    };

    setSales([newSale, ...sales]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Sale Recorded",
      description: "New sale has been successfully recorded.",
    });
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerId: "",
      shopId: "",
      items: [{ name: "", code: "", quantity: 1, price: 0, discount: 0, fromReceipt: true }],
      paymentMethod: "Cash",
      bankAccountId: "",
      paymentStatus: "paid",
      receiptNumber: "",
      notes: ""
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", code: "", quantity: 1, price: 0, discount: 0, fromReceipt: true }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) => {
      if (i === index) {
        if (field === "name") {
          const selectedItem = availableItems.find(ai => ai.name === value);
          return {
            ...item,
            name: value,
            code: selectedItem?.code || "",
            price: selectedItem?.price || 0,
            fromReceipt: selectedItem?.fromReceipt || true
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  const canAdd = userRole === "Admin" || userRole === "Sales";

  const getTotalSales = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const getPendingCredit = () => {
    return filteredSales
      .filter(sale => sale.paymentStatus === "pending")
      .reduce((sum, sale) => sum + sale.total, 0);
  };

  const getCashSales = () => {
    return filteredSales
      .filter(sale => sale.paymentMethod === "Cash")
      .reduce((sum, sale) => sum + sale.total, 0);
  };

  const getBankSales = () => {
    return filteredSales
      .filter(sale => sale.paymentMethod === "Bank Transfer")
      .reduce((sum, sale) => sum + sale.total, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Tracking</h2>
          <p className="text-gray-600">Record and manage sales transactions</p>
        </div>
        
        {canAdd && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Record Sale</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record New Sale</DialogTitle>
                <DialogDescription>
                  Enter the details for the new sale transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select value={formData.customerId} onValueChange={(value) => {
                      const customer = customers.find(c => c.id === value);
                      setFormData({...formData, customerId: value, customerName: customer?.name || ""});
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shop">Shop Location</Label>
                    <Select value={formData.shopId} onValueChange={(value) => setFormData({...formData, shopId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shop" />
                      </SelectTrigger>
                      <SelectContent>
                        {shops.map(shop => (
                          <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="receiptNumber">Receipt Number (Optional)</Label>
                    <Input
                      id="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label>Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 border rounded-lg">
                        <div>
                          <Label>Item</Label>
                          <Select value={item.name} onValueChange={(value) => updateItem(index, "name", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableItems
                                .filter(ai => !formData.shopId || (ai.shopStock[formData.shopId as keyof typeof ai.shopStock] || 0) > 0)
                                .map(availableItem => (
                                <SelectItem key={availableItem.code} value={availableItem.name}>
                                  {availableItem.name} ({availableItem.code})
                                  <Badge variant={availableItem.fromReceipt ? "default" : "secondary"} className="ml-2 text-xs">
                                    {availableItem.fromReceipt ? "R" : "NR"}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Discount</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.discount}
                            onChange={(e) => updateItem(index, "discount", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Source</Label>
                          <Badge variant={item.fromReceipt ? "default" : "secondary"} className="text-xs">
                            {item.fromReceipt ? "With Receipt" : "No Receipt"}
                          </Badge>
                        </div>
                        <div className="flex items-end">
                          {formData.items.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="text-red-600"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value: "Cash" | "Bank Transfer") => setFormData({...formData, paymentMethod: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.paymentMethod === "Bank Transfer" && (
                    <div>
                      <Label htmlFor="bankAccount">Bank Account</Label>
                      <Select value={formData.bankAccountId} onValueChange={(value) => setFormData({...formData, bankAccountId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank account" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts.map(account => (
                            <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select value={formData.paymentStatus} onValueChange={(value: any) => setFormData({...formData, paymentStatus: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSale}>Record Sale</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalSales().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {filteredSales.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
            <Banknote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${getCashSales().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Cash payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Sales</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${getBankSales().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Bank transfers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Credit</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${getPendingCredit().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Outstanding payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer name or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={shopFilter} onValueChange={setShopFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Shops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shops</SelectItem>
                {shops.map(shop => (
                  <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full lg:w-64 justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                />
                <div className="p-3 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Clear Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <div className="space-y-4">
        {filteredSales.map((sale) => (
          <Card key={sale.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-lg">{sale.customerName}</h3>
                    <Badge variant={
                      sale.paymentStatus === "paid" ? "default" :
                      sale.paymentStatus === "partial" ? "secondary" : "destructive"
                    }>
                      {sale.paymentStatus}
                    </Badge>
                    <Badge variant={sale.paymentMethod === "Cash" ? "secondary" : "outline"}>
                      {sale.paymentMethod}
                    </Badge>
                    <Badge variant="outline">
                      <Building className="h-3 w-3 mr-1" />
                      {sale.shopName}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Receipt:</span> {sale.receiptNumber}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {format(sale.date, "MMM dd, yyyy")}
                    </div>
                    {sale.paymentMethod === "Bank Transfer" && sale.bankAccountName && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Bank:</span> {sale.bankAccountName}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Items:</p>
                    <div className="space-y-1">
                      {sale.items.map((item, index) => (
                        <div key={index} className="text-sm text-gray-600 flex justify-between items-center">
                          <span className="flex items-center space-x-2">
                            <span>{item.name} ({item.code}) × {item.quantity}</span>
                            <Badge variant={item.fromReceipt ? "default" : "secondary"} className="text-xs">
                              {item.fromReceipt ? "With Receipt" : "No Receipt"}
                            </Badge>
                          </span>
                          <span>${(item.quantity * item.price - item.discount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {sale.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {sale.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${sale.total.toFixed(2)}
                  </div>
                  {sale.discount > 0 && (
                    <div className="text-sm text-gray-500">
                      Discount: ${sale.discount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSales.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sales found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
