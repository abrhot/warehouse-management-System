'use client';

import Link from 'next/link';
import { Package, BarChart3, Users, Shield, Github, Linkedin, Mail, ArrowRight, Check, Zap, Database, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track products, stock levels, and serial numbers with real-time updates'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive dashboards with insights into stock movements and trends'
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Secure authentication with admin and user roles for controlled access'
    },
    {
      icon: Shield,
      title: 'Approval Workflow',
      description: 'Submit and approve new products and categories with built-in workflows'
    }
  ];

  const techStack = [
    { name: 'Next.js 14', category: 'Framework' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Prisma', category: 'ORM' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'TailwindCSS', category: 'Styling' },
    { name: 'shadcn/ui', category: 'UI Components' },
    { name: 'JWT', category: 'Authentication' },
    { name: 'Zod', category: 'Validation' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Package className="w-6 h-6 text-blue-600" />
            <span>WMS</span>
          </div>
          <Link href="/login">
            <Button variant="default" size="sm" className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Modern Warehouse Management
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Streamline Your Inventory
            <br />
            <span className="text-blue-600">With Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive warehouse management system built with modern technologies for efficient stock control, real-time tracking, and seamless operations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <Button size="lg" className="gap-2 text-base">
                Access Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-base">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-600 text-lg">Everything you need to manage your warehouse efficiently</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card 
                key={idx} 
                className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease-out ${idx * 0.1}s`
                }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built With Modern Tech</h2>
            <p className="text-gray-600 text-lg">Leveraging cutting-edge technologies for optimal performance</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'scale(1)' : 'scale(0.9)',
                  transition: `all 0.5s ease-out ${idx * 0.05}s`
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <p className="font-semibold text-sm">{tech.name}</p>
                </div>
                <p className="text-xs text-gray-500">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Capabilities */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Complete Warehouse Solution</h2>
              <div className="space-y-4">
                {[
                  'Real-time stock tracking with serial numbers',
                  'Multi-user support with role-based permissions',
                  'Stock IN/OUT request and approval workflows',
                  'Category and supplier management',
                  'Low stock alerts and notifications',
                  'Comprehensive reporting and analytics',
                  'Product approval system for quality control',
                  'Secure JWT-based authentication'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Database, title: 'PostgreSQL', desc: 'Robust database with Prisma ORM', color: 'text-blue-600' },
                { icon: Cloud, title: 'Cloud Ready', desc: 'Deploy on Vercel or any platform', color: 'text-green-600' },
                { icon: Shield, title: 'Secure', desc: 'JWT authentication & authorization', color: 'text-purple-600' },
                { icon: Zap, title: 'Fast', desc: 'Next.js 14 with optimized performance', color: 'text-yellow-600' }
              ].map((item, idx) => (
                <Card 
                  key={idx}
                  className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `all 0.6s ease-out ${idx * 0.15}s`
                  }}
                >
                  <CardContent className="p-6">
                    <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                    <p className="font-semibold mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About/Credits Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About This Project</h2>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            This Warehouse Management System is a comprehensive solution designed to streamline inventory operations. 
            Built with modern web technologies and best practices, it provides a robust platform for managing stock, 
            tracking movements, and maintaining operational efficiency.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <p className="text-gray-800 font-medium mb-2">
              Developed with ❤️ by <span className="text-blue-600 font-bold">Abraham Kifl</span>
            </p>
            <p className="text-gray-600 mb-6">
              Showcasing full-stack development capabilities with TypeScript, React, Next.js, and PostgreSQL
            </p>
            <div className="flex gap-4 justify-center">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
              </a>
              <a href="mailto:contact@example.com">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the power of modern warehouse management
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="gap-2 text-base">
              Access Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm">
            © {new Date().getFullYear()} Warehouse Management System. Built with Next.js, TypeScript & PostgreSQL.
          </p>
        </div>
      </footer>
    </div>
  );
}
