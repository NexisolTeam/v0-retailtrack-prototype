"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Receipt, Package, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

interface ReceiptManagementProps {
  userRole: string
}

interface ReceiptItem {
  id: string
  receiptNumber: string
  itemDescription: string
  amount: number
  purchaseDate: Date
  status: "item_exists" | "only_receipt"
}

interface NoReceiptItem {
  id: string
  itemDescription: string
  amount: number
  purchaseDate: Date
  status: "item_available" | "item_sold"
}

export const ReceiptManagement = ({ userRole }: ReceiptManagementProps) => {
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([
    {
      id: "1",
      receiptNumber: "REC001",
      itemDescription: "Samsung Galaxy Phone",
      amount: 899.99,
      purchaseDate: new Date("2024-01-15"),
      status: "item_exists",
    },
    {
      id: "2",
      receiptNumber: "REC002",
      itemDescription: "Dell Laptop",
      amount: 1299.99,
      purchaseDate: new Date("2024-01-10"),
      status: "only_receipt",
    },
    {
      id: "3",
      receiptNumber: "REC003",
      itemDescription: "Apple Watch",
      amount: 399.99,
      purchaseDate: new Date("2024-01-20"),
      status: "item_exists",
    },
  ])

  const [noReceiptItems, setNoReceiptItems] = useState<NoReceiptItem[]>([
    {
      id: "1",
      itemDescription: "Used iPhone",
      amount: 450.0,
      purchaseDate: new Date("2024-01-12"),
      status: "item_available",
    },
    {
      id: "2",
      itemDescription: "Gaming Console",
      amount: 299.99,
      purchaseDate: new Date("2024-01-08"),
      status: "item_sold",
    },
  ])

  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [isNoReceiptDialogOpen, setIsNoReceiptDialogOpen] = useState(false)

  const [receiptForm, setReceiptForm] = useState({
    receiptNumber: "",
    itemDescription: "",
    amount: 0,
    purchaseDate: "",
  })

  const [noReceiptForm, setNoReceiptForm] = useState({
    itemDescription: "",
    amount: 0,
    purchaseDate: "",
  })

  // Calculate totals for receipt items
  const getReceiptItemsStillExist = () => {
    return receiptItems.filter((item) => item.status === "item_exists").reduce((sum, item) => sum + item.amount, 0)
  }

  const getOnlyReceiptsAvailable = () => {
    return receiptItems.filter((item) => item.status === "only_receipt").reduce((sum, item) => sum + item.amount, 0)
  }

  const getTotalReceipts = () => {
    return receiptItems.reduce((sum, item) => sum + item.amount, 0)
  }

  // Calculate totals for no receipt items
  const getNoReceiptItemsAvailable = () => {
    return noReceiptItems.filter((item) => item.status === "item_available").reduce((sum, item) => sum + item.amount, 0)
  }

  const getNoReceiptItemsSold = () => {
    return noReceiptItems.filter((item) => item.status === "item_sold").reduce((sum, item) => sum + item.amount, 0)
  }

  const getTotalNoReceiptItems = () => {
    return noReceiptItems.reduce((sum, item) => sum + item.amount, 0)
  }

  const handleAddReceiptItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      receiptNumber: receiptForm.receiptNumber,
      itemDescription: receiptForm.itemDescription,
      amount: receiptForm.amount,
      purchaseDate: new Date(receiptForm.purchaseDate),
      status: "item_exists",
    }

    setReceiptItems([newItem, ...receiptItems])
    setIsReceiptDialogOpen(false)
    resetReceiptForm()
    toast({
      title: "Receipt Item Added",
      description: "Item with receipt has been successfully recorded.",
    })
  }

  const handleAddNoReceiptItem = () => {
    const newItem: NoReceiptItem = {
      id: Date.now().toString(),
      itemDescription: noReceiptForm.itemDescription,
      amount: noReceiptForm.amount,
      purchaseDate: new Date(noReceiptForm.purchaseDate),
      status: "item_available",
    }

    setNoReceiptItems([newItem, ...noReceiptItems])
    setIsNoReceiptDialogOpen(false)
    resetNoReceiptForm()
    toast({
      title: "No Receipt Item Added",
      description: "Item without receipt has been successfully recorded.",
    })
  }

  const toggleReceiptItemStatus = (id: string) => {
    setReceiptItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "item_exists" ? "only_receipt" : "item_exists",
            }
          : item,
      ),
    )
  }

  const toggleNoReceiptItemStatus = (id: string) => {
    setNoReceiptItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "item_available" ? "item_sold" : "item_available",
            }
          : item,
      ),
    )
  }

  const resetReceiptForm = () => {
    setReceiptForm({
      receiptNumber: "",
      itemDescription: "",
      amount: 0,
      purchaseDate: "",
    })
  }

  const resetNoReceiptForm = () => {
    setNoReceiptForm({
      itemDescription: "",
      amount: 0,
      purchaseDate: "",
    })
  }

  const canAdd = userRole === "Admin" || userRole === "Sales"

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Receipt Management</h2>
          <p className="text-gray-600">Track items bought with and without receipts</p>
        </div>
      </div>

      {/* Items Bought With Receipt Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-800">Items Bought With Receipt - Receipt Management</h3>
          {canAdd && (
            <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Receipt Item</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Item With Receipt</DialogTitle>
                  <DialogDescription>Record a new item purchased with receipt.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="receiptNumber">Receipt Number</Label>
                      <Input
                        id="receiptNumber"
                        value={receiptForm.receiptNumber}
                        onChange={(e) => setReceiptForm({ ...receiptForm, receiptNumber: e.target.value })}
                        placeholder="Enter receipt number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={receiptForm.amount}
                        onChange={(e) =>
                          setReceiptForm({ ...receiptForm, amount: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="itemDescription">Item Description</Label>
                    <Textarea
                      id="itemDescription"
                      value={receiptForm.itemDescription}
                      onChange={(e) => setReceiptForm({ ...receiptForm, itemDescription: e.target.value })}
                      placeholder="Describe the item"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={receiptForm.purchaseDate}
                      onChange={(e) => setReceiptForm({ ...receiptForm, purchaseDate: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReceiptDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddReceiptItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Receipt Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receipts - Items Still Exist</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${getReceiptItemsStillExist().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {receiptItems.filter((item) => item.status === "item_exists").length} items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Only Receipts Available</CardTitle>
              <Receipt className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${getOnlyReceiptsAvailable().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {receiptItems.filter((item) => item.status === "only_receipt").length} receipts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${getTotalReceipts().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{receiptItems.length} total items</p>
            </CardContent>
          </Card>
        </div>

        {/* Receipt Records Section */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Records</CardTitle>
            <CardDescription>Items purchased with receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receiptItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="font-semibold">{item.itemDescription}</h3>
                      <Badge variant={item.status === "item_exists" ? "default" : "secondary"}>
                        {item.status === "item_exists" ? "Item Exists" : "Only Receipt Available"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Receipt:</span> {item.receiptNumber}
                      </div>
                      <div>
                        <span className="font-medium">Purchase Date:</span> {format(item.purchaseDate, "MMM dd, yyyy")}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ${item.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => toggleReceiptItemStatus(item.id)}>
                      {item.status === "item_exists" ? "Mark as Sold" : "Mark as Available"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Bought Without Receipt Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-800">Items Bought Without Receipt - Receipt Management</h3>
          {canAdd && (
            <Dialog open={isNoReceiptDialogOpen} onOpenChange={setIsNoReceiptDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Plus className="h-4 w-4" />
                  <span>Add No Receipt Item</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Item Without Receipt</DialogTitle>
                  <DialogDescription>Record a new item purchased without receipt.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="noReceiptDescription">Item Description</Label>
                    <Textarea
                      id="noReceiptDescription"
                      value={noReceiptForm.itemDescription}
                      onChange={(e) => setNoReceiptForm({ ...noReceiptForm, itemDescription: e.target.value })}
                      placeholder="Describe the item"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="noReceiptAmount">Amount</Label>
                      <Input
                        id="noReceiptAmount"
                        type="number"
                        step="0.01"
                        value={noReceiptForm.amount}
                        onChange={(e) =>
                          setNoReceiptForm({ ...noReceiptForm, amount: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="noReceiptPurchaseDate">Purchase Date</Label>
                      <Input
                        id="noReceiptPurchaseDate"
                        type="date"
                        value={noReceiptForm.purchaseDate}
                        onChange={(e) => setNoReceiptForm({ ...noReceiptForm, purchaseDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNoReceiptDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNoReceiptItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* No Receipt Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Still Available</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${getNoReceiptItemsAvailable().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {noReceiptItems.filter((item) => item.status === "item_available").length} items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${getNoReceiptItemsSold().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {noReceiptItems.filter((item) => item.status === "item_sold").length} items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${getTotalNoReceiptItems().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{noReceiptItems.length} total items</p>
            </CardContent>
          </Card>
        </div>

        {/* No Receipt Records Section */}
        <Card>
          <CardHeader>
            <CardTitle>No Receipt Records</CardTitle>
            <CardDescription>Items purchased without receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {noReceiptItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="font-semibold">{item.itemDescription}</h3>
                      <Badge variant={item.status === "item_available" ? "default" : "secondary"}>
                        {item.status === "item_available" ? "Item Available" : "Item Sold"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Purchase Date:</span> {format(item.purchaseDate, "MMM dd, yyyy")}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ${item.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => toggleNoReceiptItemStatus(item.id)}>
                      {item.status === "item_available" ? "Mark as Sold" : "Mark as Available"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
