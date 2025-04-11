"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Plus, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const yieldTrendData = [
  { month: "Jan", wheat: 3800, rice: 5200, corn: 2800, soybeans: 2400 },
  { month: "Feb", wheat: 3900, rice: 5300, corn: 2900, soybeans: 2500 },
  { month: "Mar", wheat: 4100, rice: 5500, corn: 3000, soybeans: 2600 },
  { month: "Apr", wheat: 4300, rice: 5700, corn: 3100, soybeans: 2700 },
  { month: "May", wheat: 4400, rice: 5900, corn: 3150, soybeans: 2750 },
  { month: "Jun", wheat: 4500, rice: 6000, corn: 3200, soybeans: 2800 },
]

export default function PredictionsPage() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ crop: "", area: "", soil: "", season: "" })
  const [predictions, setPredictions] = useState<any[]>([])

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [diseaseResult, setDiseaseResult] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [diseaseHistory, setDiseaseHistory] = useState<any[]>([])

  const handlePredict = async () => {
    try {
      const res = await fetch("/api/predictCrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const result = await res.json()
      setPredictions((prev) => [result.prediction, ...prev])
      setOpen(false)
    } catch (error) {
      console.error("Prediction failed:", error)
    }
  }

  const handleImageUpload = async () => {
    if (!image) return

    const formData = new FormData()
    formData.append("image", image)

    try {
      setLoading(true)
      const res = await fetch("/api/predictDisease", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error("Prediction failed:", res.status, errText)
        setDiseaseResult("Prediction failed.")
        return
      }

      const data = await res.json()
      setDiseaseResult(data.prediction)
      setImagePreview(null)
      setImage(null)
      fetchDiseaseHistory()
    } catch (err) {
      console.error("Image prediction error:", err)
      setDiseaseResult("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCropPredictions = async () => {
    try {
      const res = await fetch("/api/predictCrop")
      const data = await res.json()
      setPredictions(data)
    } catch (err) {
      console.error("Failed to fetch crop predictions:", err)
    }
  }

  const fetchDiseaseHistory = async () => {
    try {
      const res = await fetch("/api/predictDisease")
      const data = await res.json()
      setDiseaseHistory(data.reverse())
    } catch (err) {
      console.error("Failed to fetch disease history:", err)
    }
  }

  useEffect(() => {
    fetchCropPredictions()
    fetchDiseaseHistory()
  }, [])

  return (
    <Tabs defaultValue="crop">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Predictions</h2>
        <TabsList>
          <TabsTrigger value="crop">Crop</TabsTrigger>
          <TabsTrigger value="disease">Disease</TabsTrigger>
        </TabsList>
      </div>

      {/* Crop Prediction Tab */}
      <TabsContent value="crop">
        <div className="flex justify-end mb-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Predict New Crop
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Predict New Crop</DialogTitle>
                <DialogDescription>Enter crop details to get AI-powered yield and price predictions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="crop" className="text-right">Crop</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, crop: val })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="corn">Corn</SelectItem>
                      <SelectItem value="soybeans">Soybeans</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="pepper">Pepper</SelectItem>
                      <SelectItem value="potato">Potato</SelectItem>
                      <SelectItem value="tomato">Tomato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="area" className="text-right">Area (acres)</Label>
                  <Input id="area" type="number" className="col-span-3" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="soil" className="text-right">Soil Type</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, soil: val })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loamy">Loamy</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="silt">Silt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="season" className="text-right">Season</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, season: val })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kharif">Kharif</SelectItem>
                      <SelectItem value="rabi">Rabi</SelectItem>
                      <SelectItem value="zaid">Zaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" onClick={handlePredict}>Predict</Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {predictions.map((crop, index) => (
            <Card key={crop._id || crop.id || index}>
              <CardHeader className="pb-2">
                <CardTitle>{crop.crop}</CardTitle>
                <CardDescription>Predicted yield and price</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Expected Yield</div>
                    <div className="text-2xl font-bold">{crop.predictedYield} kg</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Predicted Price</div>
                    <div className="text-2xl font-bold">₹{crop.predictedPrice}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="text-sm font-medium mb-1">Health Status</div>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${crop.healthStatus === "healthy" ? "bg-green-500" : crop.healthStatus === "warning" ? "bg-yellow-500" : "bg-red-500"}`} />
                    <span className="text-sm capitalize">{crop.healthStatus}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Yield Trends (Last 6 Months)</CardTitle>
            <CardDescription>Predicted yield in kg per acre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={yieldTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} kg`, ""]} />
                <Legend />
                <Bar dataKey="wheat" name="Wheat" fill="#22c55e" />
                <Bar dataKey="rice" name="Rice" fill="#3b82f6" />
                <Bar dataKey="corn" name="Corn" fill="#eab308" />
                <Bar dataKey="soybeans" name="Soybeans" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Disease Prediction Tab */}
      <TabsContent value="disease">
        <Card>
          <CardHeader>
            <CardTitle>Disease Detection</CardTitle>
            <CardDescription>Upload a plant leaf image to detect potential diseases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setImage(file)
                if (file) setImagePreview(URL.createObjectURL(file))
              }}
            />
            {imagePreview && (
              <div className="rounded border p-2 w-fit">
                <Image src={imagePreview} alt="Preview" width={200} height={200} className="rounded object-cover" />
              </div>
            )}
            <Button onClick={handleImageUpload} disabled={!image || loading}>
              {loading ? "Predicting..." : "Predict Disease"}
            </Button>
            {diseaseResult && (
              <div className="text-lg font-semibold">Prediction: <span className="text-primary">{diseaseResult}</span></div>
            )}
            {diseaseHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Past Disease Predictions</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {diseaseHistory.map((item, idx) => (
                    <Card key={item._id || idx}>
                      <CardContent className="p-2">
                        <Image
                          src={item.imagePath ? `http://localhost:8001/${item.imagePath}` : "/placeholder.jpg"}
                          alt="Disease"
                          width={300}
                          height={200}
                          className="rounded mb-2 object-cover w-full h-[200px]"
                        />

                        <div className="text-sm text-muted-foreground">Prediction:</div>
                        {/* <div className="text-base font-medium">{item.prediction}</div> */}
                        <div className="text-base font-medium">
                          {item.plant} - {item.disease}
                        </div>

                        <div className="text-sm text-muted-foreground mt-1">
                          Confidence: {(item.confidence * 100).toFixed(2)}%
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
