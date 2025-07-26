
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, CreditCard, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BankAccountManagerProps {
  userRole: string;
}

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  accountType: "checking" | "savings" | "current" | "other";
  balance: number;
  currency: string;
  status: "active" | "inactive";
  notes: string;
}

export const BankAccountManager = ({ userRole }: BankAccountManagerProps) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      accountName: "Main Business Account",
      bankName: "First National Bank",
      accountNumber: "****1234",
      accountType: "checking",
      balance: 25000,
      currency: "USD",
      status: "active",
      notes: "Primary business account"
    },
    {
      id: "2",
      accountName: "Savings Account",
      bankName: "City Bank",
      accountNumber: "****5678",
      accountType: "savings",
      balance: 50000,
      currency: "USD",
      status: "active",
      notes: "Emergency funds"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    accountType: "checking" as "checking" | "savings" | "current" | "other",
    balance: 0,
    currency: "USD",
    status: "active" as "active" | "inactive",
    notes: ""
  });

  const filteredAccounts = accounts.filter(account => 
    account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountNumber.includes(searchTerm)
  );

  const handleAddAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      ...formData
    };
    setAccounts([...accounts, newAccount]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Bank Account Added",
      description: "New bank account has been successfully added.",
    });
  };

  const handleEditAccount = () => {
    if (!editingAccount) return;
    
    setAccounts(accounts.map(account => 
      account.id === editingAccount.id ? { ...editingAccount, ...formData } : account
    ));
    setEditingAccount(null);
    resetForm();
    toast({
      title: "Bank Account Updated",
      description: "Bank account has been successfully updated.",
    });
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast({
      title: "Bank Account Deleted",
      description: "Bank account has been successfully deleted.",
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setFormData({
      accountName: "",
      bankName: "",
      accountNumber: "",
      accountType: "checking",
      balance: 0,
      currency: "USD",
      status: "active",
      notes: ""
    });
  };

  const openEditDialog = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      accountName: account.accountName,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: account.balance,
      currency: account.currency,
      status: account.status,
      notes: account.notes
    });
  };

  const canEdit = userRole === "Admin" || userRole === "Accountant";
  const canDelete = userRole === "Admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Account Management</h2>
          <p className="text-gray-600">Configure and manage bank accounts for payments</p>
        </div>
        
        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Account</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Bank Account</DialogTitle>
                <DialogDescription>
                  Enter the details for the new bank account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    placeholder="Enter account name"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={formData.accountType} onValueChange={(value: any) => setFormData({...formData, accountType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value) || 0})}
                    placeholder="Enter current balance"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
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
                <Button onClick={handleAddAccount}>Add Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Total Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            ${accounts.reduce((sum, account) => sum + account.balance, 0).toFixed(2)}
          </div>
          <p className="text-gray-600">Across {accounts.length} accounts</p>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search accounts by name, bank, or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAccounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>{account.accountName}</span>
                  </CardTitle>
                  <CardDescription>{account.bankName}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  {canEdit && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(account)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Bank Account</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                          <div>
                            <Label htmlFor="edit-accountName">Account Name</Label>
                            <Input
                              id="edit-accountName"
                              value={formData.accountName}
                              onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-balance">Current Balance</Label>
                            <Input
                              id="edit-balance"
                              type="number"
                              step="0.01"
                              value={formData.balance}
                              onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingAccount(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditAccount}>Update Account</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{account.accountType}</Badge>
                  <Badge variant={account.status === "active" ? "default" : "secondary"}>
                    {account.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-mono">{account.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Balance:</span>
                    <span className="font-bold text-green-600">
                      {account.balance.toFixed(2)} {account.currency}
                    </span>
                  </div>
                </div>

                {account.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {account.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bank accounts found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
