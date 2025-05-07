"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "~~/components/navbar"
import { Footer } from "~~/components/footer"
import { Button } from "~~/components/ui/button"
import { Card, CardContent } from "~~/components/ui/card"
import { Input } from "~~/components/ui/input"
import { Label } from "~~/components/ui/label"
import { Textarea } from "~~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~~/components/ui/dialog"
import { Receipt } from "~~/components/receipt"
import { Upload, Plus } from "lucide-react"

export default function CreateNFT() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would mint the NFT
    setShowReceipt(true)
  }

  const mockNft = {
    id: "new-nft",
    name: "Your New NFT",
    collection: "Your Collection",
    description: "Your newly minted NFT",
    image: previewImage || "/placeholder.svg?height=500&width=500",
    price: 0,
    owner: "You",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: "1",
    properties: [],
    history: [],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="py-12 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Create New NFT</h1>

          <Card className="bg-card/50 backdrop-blur-sm border-muted">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-muted rounded-lg p-6 h-64">
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => setPreviewImage(null)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          PNG, JPG, GIF, SVG, MP4 or WEBM. Max 100MB.
                        </p>
                        <Button type="button" variant="outline" className="mt-4">
                          Choose File
                          <input
                            id="image"
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*,video/*"
                            onChange={handleImageChange}
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Item name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Provide a detailed description of your item" rows={4} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="collection">Collection</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="existing">Existing Collection</SelectItem>
                        <SelectItem value="new">Create New Collection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blockchain">Blockchain</Label>
                    <Select defaultValue="ethereum">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="solana">Solana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Properties</Label>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Property
                    </Button>
                  </div>
                  <div className="border border-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">No properties added yet</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Initial Price (ETH)</Label>
                  <Input id="price" type="number" step="0.001" min="0" placeholder="0.00" />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Create NFT
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>NFT Created Successfully</DialogTitle>
          </DialogHeader>
          <Receipt
            nft={mockNft}
            type="mint"
            timestamp={new Date().toISOString()}
            transactionHash="0x3a4e8b9c7d6f5e2a1b0c9d8e7f6a5b4c3d2e1f0a"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

