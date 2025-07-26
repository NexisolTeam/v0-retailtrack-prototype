import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, BarChart3, ShoppingCart, Building2, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Financial Management",
      description: "Track income, expenses, and financial reports across all your retail stores."
    },
    {
      icon: ShoppingCart,
      title: "Sales Tracking",
      description: "Monitor daily sales, payment methods, and customer transactions in real-time."
    },
    {
      icon: Building2,
      title: "Multi-Store Support",
      description: "Manage inventory and operations across multiple branch locations."
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Maintain customer profiles, credit accounts, and purchase history."
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant notifications for low stock, sales targets, and important alerts."
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">RT</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">RetailTrack</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Multi-Store Inventory & Financial Management System
          </p>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            Version 1.0
          </Badge>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About RetailTrack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              RetailTrack is a comprehensive retail management solution designed to streamline operations 
              across multiple store locations. Our platform empowers retailers with powerful tools for 
              inventory management, financial tracking, sales monitoring, and customer relationship management.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Built with modern technology and user experience in mind, RetailTrack provides real-time 
              insights and automated workflows that help retail businesses make informed decisions and 
              drive growth.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Discover what makes RetailTrack the perfect solution for your retail business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Choose RetailTrack?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Intuitive interface designed for retail professionals",
                "Real-time data synchronization across all locations",
                "Comprehensive reporting and analytics",
                "Secure cloud-based infrastructure",
                "24/7 customer support and training resources",
                "Scalable solution that grows with your business"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;