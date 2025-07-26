import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Users, Shield, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserManagementProps {
  userRole: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Sales" | "Accountant";
  location: string;
  status: "active" | "inactive";
  createdAt: Date;
}

export const UserManagement = ({ userRole }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Admin",
      email: "john@retailtrack.com",
      role: "Admin",
      location: "All Stores",
      status: "active",
      createdAt: new Date()
    },
    {
      id: "2",
      name: "Sarah Sales",
      email: "sarah@retailtrack.com",
      role: "Sales",
      location: "Main Store",
      status: "active",
      createdAt: new Date()
    },
    {
      id: "3",
      name: "Mike Accountant",
      email: "mike@retailtrack.com",
      role: "Accountant",
      location: "Head Office",
      status: "active",
      createdAt: new Date()
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Sales" as "Admin" | "Sales" | "Accountant",
    location: "Main Store",
    status: "active" as "active" | "inactive"
  });

  const locations = ["All Stores", "Main Store", "Branch A", "Branch B", "Head Office"];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      location: formData.location,
      status: formData.status,
      createdAt: new Date()
    };
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "User Added",
      description: "New user has been successfully added.",
    });
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    
    setUsers(users.map(user => 
      user.id === editingUser.id ? { 
        ...user, 
        name: formData.name,
        email: formData.email,
        role: formData.role,
        location: formData.location,
        status: formData.status
      } : user
    ));
    setEditingUser(null);
    resetForm();
    toast({
      title: "User Updated",
      description: "User has been successfully updated.",
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been successfully deleted.",
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "Sales",
      location: "Main Store",
      status: "active"
    });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      status: user.status
    });
  };

  const canEdit = userRole === "Admin";
  const canDelete = userRole === "Admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        
        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter the details for the new user.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: "Admin" | "Sales" | "Accountant") => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {canEdit && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input
                              id="edit-name"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-role">Role</Label>
                            <Select value={formData.role} onValueChange={(value: "Admin" | "Sales" | "Accountant") => setFormData({...formData, role: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                                <SelectItem value="Accountant">Accountant</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingUser(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditUser}>Update User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
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
                  <Badge variant={user.role === "Admin" ? "default" : user.role === "Sales" ? "secondary" : "outline"}>
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === "active" ? "default" : "destructive"}>
                    {user.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Location:</span> {user.location}</p>
                  <p><span className="font-medium">Joined:</span> {user.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
