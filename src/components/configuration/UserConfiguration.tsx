import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, User, Mail, Phone, Edit, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Admin" | "Sales" | "Accountant";
  branch: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  permissions: string[];
}

export const UserConfiguration = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@retailtrack.com",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      branch: "Main Branch",
      status: "Active",
      lastLogin: "2024-01-20 09:30",
      permissions: ["all"]
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@retailtrack.com",
      phone: "+1 (555) 234-5678",
      role: "Sales",
      branch: "Downtown Store",
      status: "Active",
      lastLogin: "2024-01-19 14:22",
      permissions: ["sales", "customers", "inventory"]
    },
    {
      id: "3",
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@retailtrack.com",
      phone: "+1 (555) 345-6789",
      role: "Accountant",
      branch: "Main Branch",
      status: "Active",
      lastLogin: "2024-01-18 11:15",
      permissions: ["financial", "banks", "reports"]
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "Admin" | "Sales" | "Accountant";
    branch: string;
    status: "Active" | "Inactive";
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Sales",
    branch: "",
    status: "Active"
  });

  const roles = ["Admin", "Sales", "Accountant"];
  const branches = ["Main Branch", "Downtown Store"];
  const allPermissions = {
    dashboard: "Dashboard Access",
    sales: "Sales Management",
    customers: "Customer Management", 
    inventory: "Inventory Management",
    financial: "Financial Reports",
    banks: "Bank Accounts",
    users: "User Management",
    configuration: "System Configuration"
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case "Admin":
        return Object.keys(allPermissions);
      case "Sales":
        return ["dashboard", "sales", "customers", "inventory"];
      case "Accountant":
        return ["dashboard", "financial", "banks"];
      default:
        return [];
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Sales" as const,
      branch: "",
      status: "Active" as const
    });
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      branch: user.branch,
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const permissions = getRolePermissions(formData.role);
    
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, permissions }
          : user
      ));
      toast({
        title: "User Updated",
        description: "User information has been successfully updated.",
      });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        lastLogin: "Never",
        permissions
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Created",
        description: "New user has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been successfully removed.",
    });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
    toast({
      title: "User Status Updated",
      description: "User status has been changed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                Configure user details and access permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="user@retailtrack.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: "Admin" | "Sales" | "Accountant") => setFormData({...formData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select 
                  value={formData.branch} 
                  onValueChange={(value) => setFormData({...formData, branch: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
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

            <div className="space-y-2">
              <Label>Permissions (Auto-assigned based on role)</Label>
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded">
                {getRolePermissions(formData.role).map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-primary" />
                    <span className="text-sm">{allPermissions[permission as keyof typeof allPermissions]}</span>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingUser ? "Update" : "Create"} User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            Manage system users and their access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Info</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role & Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{user.branch}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.status === "Active"}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.role !== "Admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
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
