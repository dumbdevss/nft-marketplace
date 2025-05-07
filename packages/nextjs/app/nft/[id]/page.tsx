"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Navbar } from "~~/components/navbar"
import { Footer } from "~~/components/footer"
import { Button } from "~~/components/ui/button"
import { Card, CardContent } from "~~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs"
import { Badge } from "~~/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~~/components/ui/dialog"
import { Receipt } from "~~/components/receipt"
import { getNFTById } from "~~/lib/nft-data"
import { Clock, Heart, Share2, Tag, MoveIcon as Transfer } from "lucide-react"

export default function NFTDetail() {
  const { id } = useParams()
  const nft = getNFTById(id as string)
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [transactionType, setTransactionType] = useState<"purchase" | "transfer">("purchase")

  if (!nft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <Navbar />
        <main className="py-12 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold mb-4">NFT Not Found</h1>
            <p>The NFT you are looking for does not exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleBuy = () => {
    setShowBuyDialog(false)
    setTransactionType("purchase")
    setShowReceipt(true)
  }

  const handleTransfer = () => {
    setShowTransferDialog(false)
    setTransactionType("transfer")
    setShowReceipt(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* NFT Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-muted">
              <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
            </div>

            {/* NFT Details */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="bg-muted/30 text-primary-foreground">
                  {nft.collection}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2">{nft.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                <p className="text-muted-foreground">Owned by</p>
                <span className="font-medium text-primary-foreground">{nft.owner}</span>
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border-muted mb-6">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="text-3xl font-bold">{nft.price} ETH</p>
                      <p className="text-sm text-muted-foreground">(≈ ${(nft.price * 3500).toLocaleString()})</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowBuyDialog(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Tag className="mr-2 h-4 w-4" /> Buy Now
                      </Button>
                      <Button variant="outline" onClick={() => setShowTransferDialog(true)}>
                        <Transfer className="mr-2 h-4 w-4" /> Transfer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sale ends in 23h 59m 59s</span>
                </div>
              </div>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <div className="space-y-4">
                    <p>{nft.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Contract Address</p>
                        <p className="font-mono text-sm truncate">{nft.contractAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Token ID</p>
                        <p className="font-mono text-sm">{nft.tokenId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Token Standard</p>
                        <p>ERC-721</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blockchain</p>
                        <p>Ethereum</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="properties" className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {nft.properties.map((prop, index) => (
                      <div key={index} className="border border-muted rounded-lg p-3 text-center bg-muted/20">
                        <p className="text-xs text-muted-foreground uppercase">{prop.trait_type}</p>
                        <p className="font-medium text-primary-foreground">{prop.value}</p>
                        <p className="text-xs text-muted-foreground">{prop.rarity}% have this trait</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <div className="space-y-4">
                    {nft.history.map((event, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-muted pb-3">
                        <div>
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-muted-foreground">
                            From {event.from} to {event.to}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>{event.price ? `${event.price} ETH` : "N/A"}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy NFT</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span>Item Price</span>
              <span className="font-medium">{nft.price} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Processing Fee</span>
              <span className="font-medium">0.01 ETH</span>
            </div>
            <div className="border-t border-muted pt-2 flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="font-medium">{nft.price + 0.01} ETH</span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleBuy}
            >
              Confirm Purchase
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer NFT</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Recipient Address
              </label>
              <input
                id="address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0x..."
              />
            </div>
            <div className="border-t border-muted pt-2 flex items-center justify-between">
              <span>Gas Fee</span>
              <span className="font-medium">0.002 ETH</span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleTransfer}
            >
              Confirm Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Receipt</DialogTitle>
          </DialogHeader>
          <Receipt
            nft={nft}
            type={transactionType}
            timestamp={new Date().toISOString()}
            transactionHash="0x3a4e8b9c7d6f5e2a1b0c9d8e7f6a5b4c3d2e1f0a"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

