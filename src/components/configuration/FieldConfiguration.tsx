import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FieldConfig {
  id: string;
  fieldName: string;
  displayName: string;
  required: boolean;
  visible: boolean;
  category: string;
}

export const FieldConfiguration = () => {
  const { toast } = useToast();
  
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>([
    // Sales Fields
    { id: "sale_customer", fieldName: "customer", displayName: "Customer", required: true, visible: true, category: "sales" },
    { id: "sale_payment_method", fieldName: "payment_method", displayName: "Payment Method", required: true, visible: true, category: "sales" },
    { id: "sale_notes", fieldName: "notes", displayName: "Sale Notes", required: false, visible: true, category: "sales" },
    { id: "sale_discount", fieldName: "discount", displayName: "Discount", required: false, visible: true, category: "sales" },
    { id: "sale_tax", fieldName: "tax", displayName: "Tax", required: true, visible: true, category: "sales" },

    // Customer Fields
    { id: "customer_phone", fieldName: "phone", displayName: "Phone Number", required: true, visible: true, category: "customers" },
    { id: "customer_address", fieldName: "address", displayName: "Address", required: false, visible: true, category: "customers" },
    { id: "customer_email", fieldName: "email", displayName: "Email", required: false, visible: true, category: "customers" },
    { id: "customer_id_number", fieldName: "id_number", displayName: "ID Number", required: true, visible: true, category: "customers" },
    { id: "customer_credit_limit", fieldName: "credit_limit", displayName: "Credit Limit", required: false, visible: true, category: "customers" },

    // Inventory Fields
    { id: "inventory_supplier", fieldName: "supplier", displayName: "Supplier", required: true, visible: true, category: "inventory" },
    { id: "inventory_barcode", fieldName: "barcode", displayName: "Barcode", required: false, visible: true, category: "inventory" },
    { id: "inventory_expiry_date", fieldName: "expiry_date", displayName: "Expiry Date", required: false, visible: true, category: "inventory" },
    { id: "inventory_min_stock", fieldName: "min_stock", displayName: "Minimum Stock Level", required: true, visible: true, category: "inventory" },
    { id: "inventory_location", fieldName: "location", displayName: "Storage Location", required: false, visible: true, category: "inventory" },

    // Financial Fields
    { id: "financial_reference", fieldName: "reference", displayName: "Reference Number", required: true, visible: true, category: "financial" },
    { id: "financial_category", fieldName: "category", displayName: "Transaction Category", required: true, visible: true, category: "financial" },
    { id: "financial_receipt", fieldName: "receipt", displayName: "Receipt/Invoice", required: false, visible: true, category: "financial" },
    { id: "financial_approval", fieldName: "approval", displayName: "Approval Required", required: false, visible: true, category: "financial" }
  ]);

  const categories = [
    { id: "sales", name: "Sales Transactions", description: "Configure required fields for sales processing" },
    { id: "customers", name: "Customer Management", description: "Set mandatory fields for customer registration" },
    { id: "inventory", name: "Inventory Management", description: "Define required fields for product management" },
    { id: "financial", name: "Financial Transactions", description: "Configure fields for financial operations" }
  ];

  const updateFieldConfig = (id: string, updates: Partial<FieldConfig>) => {
    setFieldConfigs(configs => 
      configs.map(config => 
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  const resetToDefaults = (category: string) => {
    // This would reset to system defaults in a real application
    toast({
      title: "Reset to Defaults",
      description: `${category} field configurations have been reset to default settings.`,
    });
  };

  const saveConfiguration = () => {
    // This would save to backend in a real application
    toast({
      title: "Configuration Saved",
      description: "Field configuration has been successfully saved.",
    });
  };

  const getFieldsByCategory = (category: string) => {
    return fieldConfigs.filter(config => config.category === category);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Field Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure which fields are required or optional for different operations
          </p>
        </div>
        <Button onClick={saveConfiguration}>
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>{category.name}</span>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resetToDefaults(category.name)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Defaults
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Visible</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFieldsByCategory(category.id).map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{field.displayName}</p>
                            <p className="text-sm text-muted-foreground">
                              Field: {field.fieldName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.visible}
                              onCheckedChange={(checked) => 
                                updateFieldConfig(field.id, { visible: checked })
                              }
                            />
                            <Label className="text-sm">
                              {field.visible ? "Visible" : "Hidden"}
                            </Label>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => 
                                updateFieldConfig(field.id, { required: checked })
                              }
                              disabled={!field.visible}
                            />
                            <Label className="text-sm">
                              {field.required ? "Required" : "Optional"}
                            </Label>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Badge variant={field.visible ? "default" : "secondary"}>
                              {field.visible ? "Visible" : "Hidden"}
                            </Badge>
                            {field.visible && (
                              <Badge variant={field.required ? "destructive" : "outline"}>
                                {field.required ? "Required" : "Optional"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
          <CardDescription>
            Overview of current field configuration across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => {
              const fields = getFieldsByCategory(category.id);
              const visibleFields = fields.filter(f => f.visible).length;
              const requiredFields = fields.filter(f => f.required).length;
              
              return (
                <div key={category.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{category.name}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Total Fields: {fields.length}</p>
                    <p>Visible: {visibleFields}</p>
                    <p>Required: {requiredFields}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
