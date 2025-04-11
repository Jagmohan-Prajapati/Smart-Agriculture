'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

type Contract = {
  _id: string
  farmerName: string
  buyerName: string
  cropName: string
  quantity: number
  pricePerUnit: number
  totalAmount: number
  date: string
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [formData, setFormData] = useState({
    farmerName: '',
    buyerName: '',
    cropName: '',
    quantity: '',
    pricePerUnit: ''
  })
  const [showModal, setShowModal] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { toast } = useToast()

  const fakeWalletAddress = '0xAbC123...789EfG'

  const fetchContracts = async () => {
    try {
      const res = await axios.get('/api/contracts')
      const data = res.data

      if (Array.isArray(data)) {
        setContracts(data)
      } else if (Array.isArray(data.contracts)) {
        setContracts(data.contracts)
      } else {
        setContracts([])
        console.warn('Unexpected response format for contracts:', data)
      }
    } catch (err) {
      console.error('Error fetching contracts:', err)
      setContracts([])
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const contractData = {
        ...formData,
        quantity: Number(formData.quantity),
        pricePerUnit: Number(formData.pricePerUnit)
      }

      await axios.post('/api/contracts', contractData)

      setFormData({
        farmerName: '',
        buyerName: '',
        cropName: '',
        quantity: '',
        pricePerUnit: ''
      })

      fetchContracts()
      setShowModal(true)

      setTimeout(() => {
        setIsConfirmed(true)
      }, 1000)

      setTimeout(() => {
        setShowModal(false)
        setIsConfirmed(false)

        toast({
          title: '🦊 MetaMask (Simulated)',
          description: 'Transaction confirmed successfully on-chain.',
          duration: 3000
        })
      }, 3000)

    } catch (err) {
      console.error('Error submitting contract:', err)
    }
  }

  return (
    <div className="p-4 space-y-6 relative">
      {/* Wallet Address Preview */}
      <div className="absolute right-4 top-4 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full shadow">
        Wallet: <span className="font-mono">{fakeWalletAddress}</span>
      </div>

      <h2 className="text-2xl font-semibold text-foreground">Smart Contracts</h2>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="farmerName"
            placeholder="Farmer Name"
            value={formData.farmerName}
            onChange={handleChange}
          />
          <Input
            name="buyerName"
            placeholder="Buyer Name"
            value={formData.buyerName}
            onChange={handleChange}
          />
          <Input
            name="cropName"
            placeholder="Crop Name"
            value={formData.cropName}
            onChange={handleChange}
          />
          <Input
            name="quantity"
            placeholder="Quantity (kg)"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
          <Input
            name="pricePerUnit"
            placeholder="Price per Unit (₹)"
            type="number"
            value={formData.pricePerUnit}
            onChange={handleChange}
          />
          <Button className="w-full md:col-span-1" onClick={handleSubmit}>
            Generate Contract
          </Button>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 rounded-xl text-sm">
          <thead className="bg-muted text-foreground">
            <tr>
              <th className="border px-4 py-2">Farmer</th>
              <th className="border px-4 py-2">Buyer</th>
              <th className="border px-4 py-2">Crop</th>
              <th className="border px-4 py-2">Qty (kg)</th>
              <th className="border px-4 py-2">Rate (₹)</th>
              <th className="border px-4 py-2">Total (₹)</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract._id}>
                <td className="border px-4 py-2">{contract.farmerName}</td>
                <td className="border px-4 py-2">{contract.buyerName}</td>
                <td className="border px-4 py-2">{contract.cropName}</td>
                <td className="border px-4 py-2">{contract.quantity}</td>
                <td className="border px-4 py-2">{contract.pricePerUnit}</td>
                <td className="border px-4 py-2">{contract.totalAmount}</td>
                <td className="border px-4 py-2">
                  {new Date(contract.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MetaMask Simulation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {isConfirmed ? 'Transaction Confirmed!' : 'Confirm in MetaMask'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            {isConfirmed ? (
              <>
                <CheckCircle2 className="text-green-500 w-12 h-12" />
                <p className="text-sm text-muted-foreground">
                  Your contract has been successfully simulated on-chain.
                </p>
              </>
            ) : (
              <>
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                <p className="text-sm text-muted-foreground">
                  Waiting for MetaMask confirmation...
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
