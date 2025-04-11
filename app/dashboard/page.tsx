"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, BarChart2, FileText, TrendingUp, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default function DashboardPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [predictionResult, setPredictionResult] = useState<string | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setPreviewURL(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", selectedImage)

    try {
      const res = await fetch("http://localhost:8000/predict-disease/", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Prediction request failed")
      }

      const data = await res.json()
      setPredictionResult(data.prediction)
    } catch (err) {
      console.error("Error:", err)
      setPredictionResult("Failed to predict.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Overview + Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>You made 8 transactions this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions + Disease Prediction */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/predictions">
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted">
                <div className="font-medium">Predict New Crop</div>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
            <Link href="/dashboard/contracts">
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted">
                <div className="font-medium">Create New Contract</div>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
            <Link href="/dashboard/profile">
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted">
                <div className="font-medium">Update Profile</div>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Plant Disease Detection */}
        {/* <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Plant Disease Detection</CardTitle>
            <CardDescription>Upload an image to predict plant disease</CardDescription>
          </CardHeader>
          <CardContent>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewURL && (
              <img
                src={previewURL}
                alt="Preview"
                className="mt-2 rounded-md border h-32 object-cover"
              />
            )}
            <Button onClick={handleUpload} disabled={loading} className="mt-2">
              {loading ? "Predicting..." : "Predict Disease"}
            </Button>
            {predictionResult && (
              <p className="mt-2 font-medium">Result: {predictionResult}</p>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
