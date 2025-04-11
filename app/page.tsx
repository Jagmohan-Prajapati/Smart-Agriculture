import Link from "next/link"
import { ArrowRight, BarChart3, FileText, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-green-600">Smart</span>
            <span>Agriculture</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/api/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/api/auth/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  AI + Blockchain for Smarter Farming
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Secure, Predict, and Grow with Technology
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/api/auth/signup">
                  <Button className="px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Revolutionize your farming with our cutting-edge technology
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <BarChart3 className="h-12 w-12 text-green-600" />
                  <CardTitle className="text-xl">Predict Crop Yield</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Leverage AI to predict crop yields based on historical data, weather patterns, and soil conditions.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <FileText className="h-12 w-12 text-green-600" />
                  <CardTitle className="text-xl">Secure Smart Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Create and manage blockchain-based smart contracts for transparent and secure transactions.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Shield className="h-12 w-12 text-green-600" />
                  <CardTitle className="text-xl">Transparent Supply Chain</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track your products from farm to table with complete transparency and traceability.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 Smart Agriculture. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

