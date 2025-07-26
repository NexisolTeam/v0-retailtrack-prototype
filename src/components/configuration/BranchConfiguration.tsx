import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, MapPin, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: "Active" | "Inactive";
  type: "Main" | "Branch";
}

export const BranchConfiguration = () => {
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: "1",
      name: "Main Branch",
      code: "MB001",
      address: "123 Business District, City, State 12345",
      phone: "+1 (555) 123-4567",
      email: "main@retailtrack.com",
      manager: "John Doe",
      status: "Active",
      type: "Main"
    },
    {
      id: "2",
      name: "Downtown Store",
      code: "DS002",
      address: "456 Downtown Ave, City, State 12345",
      phone: "+1 (555) 234-5678",
      email: "downtown@retailtrack.com",
      manager: "Jane Smith",
      status: "Active",
      type: "Branch"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    address: string;
    phone: string;
    email: string;
    manager: string;
    status: "Active" | "Inactive";
    type: "Main" | "Branch";
  }>({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
    status: "Active",
    type: "Branch"
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      address: "",
      phone: "",
      email: "",
      manager: "",
      status: "Active" as const,
      type: "Branch" as const
    });
    setEditingBranch(null);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
      status: branch.status,
      type: branch.type
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingBranch) {
      setBranches(branches.map(branch => 
        branch.id === editingBranch.id 
          ? { ...branch, ...formData }
          : branch
      ));
      toast({
        title: "Branch Updated",
        description: "Branch information has been successfully updated.",
      });
    } else {
      const newBranch: Branch = {
        id: Date.now().toString(),
        ...formData
      };
      setBranches([...branches, newBranch]);
      toast({
        title: "Branch Created",
        description: "New branch has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setBranches(branches.filter(branch => branch.id !== id));
    toast({
      title: "Branch Deleted",
      description: "Branch has been successfully removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Branch Management</h3>
          <p className="text-sm text-muted-foreground">
            Add and configure your retail store branches
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? "Edit Branch" : "Add New Branch"}
              </DialogTitle>
              <DialogDescription>
                Configure branch details and settings
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter branch name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Branch Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g., MB001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="branch@retailtrack.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({...formData, manager: e.target.value})}
                  placeholder="Manager name"
                />
              </div>
              <div className="space-y-2">
                <Label>Branch Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: "Main" | "Branch") => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main">Main Branch</SelectItem>
                    <SelectItem value="Branch">Branch Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "Active" | "Inactive") => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingBranch ? "Update" : "Create"} Branch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Branches</CardTitle>
          <CardDescription>
            Manage your retail store locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Info</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{branch.name}</span>
                        <Badge variant={branch.type === "Main" ? "default" : "secondary"}>
                          {branch.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{branch.code}</p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{branch.address}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{branch.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{branch.manager}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={branch.status === "Active" ? "default" : "secondary"}>
                      {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(branch)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {branch.type !== "Main" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(branch.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
