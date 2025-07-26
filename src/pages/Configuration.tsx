import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, Settings, Building2 } from "lucide-react";
import { BranchConfiguration } from "@/components/configuration/BranchConfiguration";
import { UserConfiguration } from "@/components/configuration/UserConfiguration";
import { FieldConfiguration } from "@/components/configuration/FieldConfiguration";
import { BankAccountManager } from "@/components/BankAccountManager";

const Configuration = () => {
  const [activeTab, setActiveTab] = useState("branches");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Configuration</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Configure your retail store settings, branches, users, and system preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="branches" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Branches</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="fields" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Fields</span>
            </TabsTrigger>
            <TabsTrigger value="banks" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Banks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="branches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branch Configuration</CardTitle>
                <CardDescription>
                  Manage your retail store branches and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BranchConfiguration />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Configuration</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserConfiguration />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Required Field Configuration</CardTitle>
                <CardDescription>
                  Configure which fields are required for different operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldConfiguration />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Account Registration</CardTitle>
                <CardDescription>
                  Manage bank accounts for financial transactions and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BankAccountManager userRole="Admin" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuration;