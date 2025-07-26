
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, AlertTriangle, Building } from "lucide-react";

interface InventoryManagerProps {
  userRole: string;
}

interface ShopInventoryItem {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  description: string;
  currentStock: number;
  minStock: number;
  sellingPrice: number;
  shopId: string;
  shopName: string;
  fromReceipt: boolean;
}

export const InventoryManager = ({ userRole }: InventoryManagerProps) => {
  const [shopItems, setShopItems] = useState<ShopInventoryItem[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      code: "WH001",
      category: "Electronics",
      unit: "pcs",
      description: "High-quality wireless headphones with noise cancellation",
      currentStock: 45,
      minStock: 20,
      sellingPrice: 80,
      shopId: "1",
      shopName: "Main Store",
      fromReceipt: true
    },
    {
      id: "2",
      name: "Organic Coffee Beans",
      code: "CB002",
      category: "Food & Beverage",
      unit: "kg",
      description: "Premium organic coffee beans from Ethiopia",
      currentStock: 12,
      minStock: 25,
      sellingPrice: 25,
      shopId: "1",
      shopName: "Main Store",
      fromReceipt: false
    },
    {
      id: "3",
      name: "Cotton T-Shirt",
      code: "TS003",
      category: "Clothing",
      unit: "pcs",
      description: "100% cotton t-shirt, various sizes",
      currentStock: 30,
      minStock: 30,
      sellingPrice: 15,
      shopId: "2",
      shopName: "Branch A",
      fromReceipt: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");

  const categories = ["Electronics", "Food & Beverage", "Clothing", "Books", "Health & Beauty"];
  const shops = [
    { id: "1", name: "Main Store" },
    { id: "2", name: "Branch A" },
    { id: "3", name: "Branch B" }
  ];

  const filteredItems = shopItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesShop = selectedShop === "all" || item.shopId === selectedShop;
    return matchesSearch && matchesCategory && matchesShop;
  });

  const getLowStockCount = () => {
    return shopItems.filter(item => item.currentStock <= item.minStock).length;
  };

  const getTotalItemsCount = () => {
    return shopItems.reduce((sum, item) => sum + item.currentStock, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shop Inventory Management</h2>
          <p className="text-gray-600">View and manage inventory across all shop locations</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalItemsCount()}</div>
            <p className="text-xs text-muted-foreground">Across all shops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{getLowStockCount()}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shops.length}</div>
            <p className="text-xs text-muted-foreground">Shop locations</p>
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
                  placeholder="Search items by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedShop} onValueChange={setSelectedShop}>
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
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{item.name}</span>
                    {item.fromReceipt ? (
                      <Badge variant="default" className="text-xs">Receipt</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">No Receipt</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{item.code}</span>
                    <Badge variant="outline">{item.category}</Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{item.shopName}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className={`font-medium ${item.currentStock <= item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                  {item.currentStock <= item.minStock && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Low Stock
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Min Stock: {item.minStock}</span>
                  <span className="font-medium">Price: ${item.sellingPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No items found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
