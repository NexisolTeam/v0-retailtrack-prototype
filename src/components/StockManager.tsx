
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowRight, Package, Building, Receipt, FileX } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StockManagerProps {
  userRole: string;
}

interface StockItem {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  description: string;
  totalStock: number;
  costPrice: number;
  hasReceipt: boolean;
  receiptNumber?: string;
  receiptFile?: string;
  purchaseDate: Date;
  supplier?: string;
  shopAllocations: Array<{
    shopId: string;
    shopName: string;
    quantity: number;
  }>;
}

export const StockManager = ({ userRole }: StockManagerProps) => {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      code: "WH001",
      category: "Electronics",
      unit: "pcs",
      description: "High-quality wireless headphones",
      totalStock: 100,
      costPrice: 50,
      hasReceipt: true,
      receiptNumber: "RCP-2024-001",
      purchaseDate: new Date(),
      supplier: "Tech Supplier Ltd",
      shopAllocations: [
        { shopId: "1", shopName: "Main Store", quantity: 45 },
        { shopId: "2", shopName: "Branch A", quantity: 30 }
      ]
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    unit: "",
    description: "",
    quantity: 0,
    costPrice: 0,
    hasReceipt: true,
    receiptNumber: "",
    supplier: ""
  });

  const [transferData, setTransferData] = useState({
    shopId: "",
    quantity: 0
  });

  const categories = ["Electronics", "Food & Beverage", "Clothing", "Books", "Health & Beauty"];
  const shops = [
    { id: "1", name: "Main Store" },
    { id: "2", name: "Branch A" },
    { id: "3", name: "Branch B" }
  ];

  const handleAddStock = () => {
    const newItem: StockItem = {
      id: Date.now().toString(),
      ...formData,
      totalStock: formData.quantity,
      purchaseDate: new Date(),
      shopAllocations: []
    };
    
    setStockItems([...stockItems, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Stock Added",
      description: "New stock item has been successfully added to central inventory.",
    });
  };

  const handleTransferToShop = () => {
    if (!selectedItem) return;
    
    const shop = shops.find(s => s.id === transferData.shopId);
    if (!shop) return;

    const availableStock = selectedItem.totalStock - 
      selectedItem.shopAllocations.reduce((sum, alloc) => sum + alloc.quantity, 0);

    if (transferData.quantity > availableStock) {
      toast({
        title: "Insufficient Stock",
        description: "Not enough stock available for transfer.",
        variant: "destructive"
      });
      return;
    }

    setStockItems(stockItems.map(item => 
      item.id === selectedItem.id 
        ? {
            ...item,
            shopAllocations: [
              ...item.shopAllocations.filter(alloc => alloc.shopId !== transferData.shopId),
              {
                shopId: transferData.shopId,
                shopName: shop.name,
                quantity: (item.shopAllocations.find(alloc => alloc.shopId === transferData.shopId)?.quantity || 0) + transferData.quantity
              }
            ]
          }
        : item
    ));

    setIsTransferDialogOpen(false);
    setTransferData({ shopId: "", quantity: 0 });
    toast({
      title: "Stock Transferred",
      description: `${transferData.quantity} units transferred to ${shop.name}.`,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      category: "",
      unit: "",
      description: "",
      quantity: 0,
      costPrice: 0,
      hasReceipt: true,
      receiptNumber: "",
      supplier: ""
    });
  };

  const getAvailableStock = (item: StockItem) => {
    return item.totalStock - item.shopAllocations.reduce((sum, alloc) => sum + alloc.quantity, 0);
  };

  const canManage = userRole === "Admin" || userRole === "Sales";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Central Stock Management</h2>
          <p className="text-gray-600">Manage central inventory and transfer to shops</p>
        </div>
        
        {canManage && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add to Stock</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Stock Item</DialogTitle>
                <DialogDescription>
                  Add items to central stock for later distribution to shops.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Item Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="Enter item code"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    placeholder="e.g., pcs, kg, ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="hasReceipt">Purchase Type</Label>
                  <Select value={formData.hasReceipt.toString()} onValueChange={(value) => setFormData({...formData, hasReceipt: value === "true"})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">With Receipt</SelectItem>
                      <SelectItem value="false">Without Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.hasReceipt && (
                  <div>
                    <Label htmlFor="receiptNumber">Receipt Number</Label>
                    <Input
                      id="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                      placeholder="Enter receipt number"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter item description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStock}>Add to Stock</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stock Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stockItems.map((item) => {
          const availableStock = getAvailableStock(item);
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{item.name}</span>
                      {item.hasReceipt ? (
                        <Receipt className="h-4 w-4 text-green-600" />
                      ) : (
                        <FileX className="h-4 w-4 text-orange-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>{item.code}</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </CardDescription>
                  </div>
                  {canManage && (
                    <Dialog open={isTransferDialogOpen && selectedItem?.id === item.id} 
                           onOpenChange={(open) => {
                             setIsTransferDialogOpen(open);
                             if (open) setSelectedItem(item);
                           }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                          <ArrowRight className="h-4 w-4" />
                          <span>Transfer</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transfer to Shop</DialogTitle>
                          <DialogDescription>
                            Transfer {item.name} from central stock to a shop.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="shop">Select Shop</Label>
                            <Select value={transferData.shopId} onValueChange={(value) => setTransferData({...transferData, shopId: value})}>
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
                            <Label htmlFor="transferQuantity">Quantity</Label>
                            <Input
                              id="transferQuantity"
                              type="number"
                              value={transferData.quantity}
                              onChange={(e) => setTransferData({...transferData, quantity: parseInt(e.target.value) || 0})}
                              max={availableStock}
                            />
                            <p className="text-sm text-gray-500 mt-1">Available: {availableStock} {item.unit}</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleTransferToShop}>Transfer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Stock:</span> {item.totalStock} {item.unit}
                    </div>
                    <div>
                      <span className="font-medium">Available:</span> 
                      <span className={availableStock > 0 ? "text-green-600" : "text-red-600"}> {availableStock} {item.unit}</span>
                    </div>
                    <div>
                      <span className="font-medium">Cost Price:</span> ${item.costPrice}
                    </div>
                    <div>
                      <span className="font-medium">Supplier:</span> {item.supplier || "N/A"}
                    </div>
                  </div>

                  {item.hasReceipt && item.receiptNumber && (
                    <div className="text-sm">
                      <span className="font-medium">Receipt:</span> {item.receiptNumber}
                    </div>
                  )}

                  {item.shopAllocations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Shop Allocations:</p>
                      <div className="space-y-1">
                        {item.shopAllocations.map((alloc, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                            <span className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span>{alloc.shopName}</span>
                            </span>
                            <span className="font-medium">{alloc.quantity} {item.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {stockItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No items in central stock.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
