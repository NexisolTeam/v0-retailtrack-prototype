import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Download, Video, HelpCircle, BarChart3, Package, ShoppingCart, Users, Building, CreditCard } from "lucide-react";

const UserManual = () => {
  const modules = [
    {
      id: "dashboard",
      title: "Dashboard Overview",
      icon: BarChart3,
      description: "Learn how to navigate and interpret the main dashboard",
      sections: [
        "Understanding key metrics",
        "Reading financial charts", 
        "Monitoring stock alerts",
        "Quick action buttons"
      ]
    },
    {
      id: "inventory",
      title: "Inventory Management",
      icon: Package,
      description: "Master stock and inventory control features",
      sections: [
        "Adding new products",
        "Stock level management",
        "Transfer between stores",
        "Low stock alerts"
      ]
    },
    {
      id: "sales",
      title: "Sales & Transactions",
      icon: ShoppingCart,
      description: "Process sales and manage transactions",
      sections: [
        "Creating new sales",
        "Payment methods",
        "Customer credit sales",
        "Return processing"
      ]
    },
    {
      id: "customers",
      title: "Customer Management",
      icon: Users,
      description: "Manage customer relationships and credit accounts",
      sections: [
        "Adding new customers",
        "Credit account management",
        "Customer history tracking",
        "Outstanding payments"
      ]
    },
    {
      id: "financial",
      title: "Financial Reports",
      icon: CreditCard,
      description: "Generate and analyze financial reports",
      sections: [
        "Daily sales reports",
        "Expense tracking",
        "Profit analysis",
        "Bank reconciliation"
      ]
    },
    {
      id: "configuration",
      title: "System Configuration",
      icon: Building,
      description: "Configure branches, users, and system settings",
      sections: [
        "Branch setup",
        "User management",
        "Field requirements",
        "Bank account settings"
      ]
    }
  ];

  const quickGuides = [
    {
      title: "Getting Started",
      steps: [
        "Log in to your RetailTrack account",
        "Select your branch location",
        "Review the dashboard overview",
        "Check for any urgent alerts"
      ]
    },
    {
      title: "Daily Sales Process",
      steps: [
        "Navigate to Sales tab",
        "Click 'New Sale' button",
        "Select products and quantities",
        "Choose payment method",
        "Complete the transaction"
      ]
    },
    {
      title: "Stock Management",
      steps: [
        "Go to Central Stock or Shop Inventory",
        "Review current stock levels",
        "Add new stock arrivals",
        "Transfer stock between locations",
        "Update minimum stock levels"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">User Manual</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Complete guide to using RetailTrack effectively for your retail business
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="guides">Quick Guides</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to RetailTrack</CardTitle>
                <CardDescription>
                  Your comprehensive retail management solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  RetailTrack is designed to simplify retail operations through an intuitive interface 
                  and powerful features. This manual will guide you through all aspects of the system.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 border rounded-lg">
                    <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium">Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Monitor key metrics</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium">Inventory</h3>
                    <p className="text-sm text-muted-foreground">Manage stock levels</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium">Sales</h3>
                    <p className="text-sm text-muted-foreground">Process transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Recommended Browsers</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Google Chrome (latest version)</li>
                      <li>• Mozilla Firefox (latest version)</li>
                      <li>• Microsoft Edge (latest version)</li>
                      <li>• Safari (latest version)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Technical Requirements</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Stable internet connection</li>
                      <li>• JavaScript enabled</li>
                      <li>• Screen resolution: 1024x768 or higher</li>
                      <li>• 2GB RAM minimum</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </div>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {module.sections.map((section, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm text-muted-foreground">{section}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="space-y-6">
              {quickGuides.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-3">
                          <Badge variant="outline" className="mt-1 text-xs">
                            {stepIndex + 1}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                    <AccordionContent>
                      Contact your system administrator to reset your password. They can generate a new temporary password for you.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I access RetailTrack from mobile devices?</AccordionTrigger>
                    <AccordionContent>
                      Yes, RetailTrack is responsive and works on tablets and smartphones. For the best experience, we recommend using a tablet or desktop computer.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How often is data backed up?</AccordionTrigger>
                    <AccordionContent>
                      All data is automatically backed up every hour to ensure maximum security and data integrity.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Download Resources</CardTitle>
                  <CardDescription>Get additional help materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    PDF User Manual
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Video Tutorials
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Quick Reference Guide
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Get Support</CardTitle>
                  <CardDescription>Contact our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@retailtrack.com</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-HELP</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 8AM - 6PM</p>
                  </div>
                  <Button className="w-full">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManual;