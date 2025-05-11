"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
  CardTitle
} from "~~/components/ui/card"
import { Button } from "~~/components/ui/button"
import { Input } from "~~/components/ui/input"
import { Label } from "~~/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~~/components/ui/dialog"
import { Badge } from "~~/components/ui/badge"
import { Navbar } from "~~/components/navbar"
import { Footer } from "~~/components/footer"
import { useView } from "~~/hooks/scaffold-move/useView"
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction"
import { Loader2, Grid, Layers, Tag, Info, DollarSign, Clock, Timer } from "lucide-react"
import { NFT } from "~~/types/nft-types"
import { formatMoveCoin } from "~~/utils/utils"
import { useToast } from "~~/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "~~/components/ui/radio-group"
import { Collection } from "~~/types/collection-types"
import Link from "next/link"

// Sale types
enum SaleType {
  INSTANT = "instant",
  AUCTION = "auction"
}

export default function UserPortfolio() {
  const [activeTab, setActiveTab] = useState("nfts")
  const [listingPrice, setListingPrice] = useState("")
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false)
  const [saleType, setSaleType] = useState<SaleType>(SaleType.INSTANT)
  const [auctionDeadline, setAuctionDeadline] = useState("")
  const [auctionMinBid, setAuctionMinBid] = useState("")
  const { toast } = useToast();

  const { account } = useWallet()
  const { submitTransaction, transactionInProcess } = useSubmitTransaction("NFTMarketplace")

  // Fetch user's collections
  const {
    data: collectionsData,
    error: collectionsError,
    isLoading: isLoadingCollections,
    refetch: refetchCollections
  } = useView({
    moduleName: "NFTMarketplace",
    functionName: "get_all_collections_by_user",
    args: [account?.address as `0x${string}`, 10, 0],
  })

  // Fetch user's NFTs
  const {
    data: nftsData,
    error: nftsError,
    isLoading: isLoadingNFTs,
    refetch: refetchNFTs
  } = useView({
    moduleName: "NFTMarketplace",
    functionName: "get_user_nfts",
    args: [account?.address as `0x${string}`]
  })

  // Parse and format data
  const collections = collectionsData?.[0] as Collection[] || []
  const nfts = nftsData?.[0] as NFT[] || []

  // Calculate min date for auction deadline (current date + 1 day)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Calculate max date for auction deadline (current date + 30 days)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  const handleListNFT = async () => {
    if (!selectedNFT) {
      toast({
        title: "No NFT Selected",
        description: "Please select an NFT to list",
        variant: "destructive"
      })
      return
    }

    try {
      // Validate inputs
      if (saleType === SaleType.AUCTION && (!auctionMinBid || !auctionDeadline)) {
        throw new Error("Auction minimum bid and deadline are required")
      }

      const price = parseFloat(listingPrice)
      if ((isNaN(price) || price <= 0) && saleType === SaleType.INSTANT) {
        throw new Error("Invalid listing price")
      }

      const auctionMinPrice = parseFloat(auctionMinBid)
      if ((isNaN(auctionMinPrice) || auctionMinPrice <= 0) && saleType === SaleType.AUCTION) {
        throw new Error("Invalid auction minimum bid")
      }

      const priceInOctas = Math.floor(saleType === SaleType.INSTANT ? price * 100000000 : (auctionMinPrice * 100000000)) // Convert to octas, ensure integer
      const deadlineTimestamp = auctionDeadline
        ? Math.floor(new Date(auctionDeadline).getTime() / 1000)
        : null

      // Validate auction deadline if applicable
      if (saleType === SaleType.AUCTION && deadlineTimestamp && deadlineTimestamp <= Math.floor(Date.now() / 1000)) {
        throw new Error("Auction deadline must be in the future")
      }

      // Submit transaction
      await submitTransaction("list_nft_for_sale", [
        parseInt(selectedNFT.id),
        priceInOctas,
        saleType === SaleType.INSTANT ? 0 : 1,
        deadlineTimestamp
      ])

      // Show success message
      toast({
        title: "NFT Listed Successfully",
        description: `${selectedNFT.name} has been listed for ${saleType === SaleType.INSTANT ? price : auctionMinBid} MOVE`,
        variant: "default"
      })

      // Reset form
      setIsListingDialogOpen(false)
      setListingPrice("")
      setAuctionMinBid("")
      setAuctionDeadline("")
      setSelectedNFT(null)
      setSaleType(SaleType.INSTANT)

      // Refresh NFT list after a short delay
      setTimeout(() => {
        refetchNFTs()
      }, 2000)
    } catch (error: any) {
      console.error("Failed to list NFT:", error)
      toast({
        title: "Failed to List NFT",
        description: error.message || "An error occurred while listing your NFT",
        variant: "destructive"
      })
    }
  }

  const handleCancelListing = async (nft: NFT) => {
    // Check if an NFT is selected
    if (!nft || !nft.id) {
      toast({
        title: "No NFT Selected",
        description: "Please select an NFT to cancel listing",
        variant: "destructive"
      });
      return;
    }

    // Check if the NFT is actually listed for sale
    if (!nft.for_sale) {
      toast({
        title: "NFT Not Listed",
        description: "This NFT is not currently listed for sale",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ensure ID is properly converted to a number
      const nftId = typeof nft.id === 'string' ? parseInt(nft.id, 10) : nft.id;

      // Check for NaN after parsing
      if (isNaN(nftId)) {
        throw new Error("Invalid NFT ID format");
      }

      // Submit transaction to cancel the listing
      const txResult = await submitTransaction("cancel_listing", [nftId]);

      // Handle successful cancellation
      if (txResult) {
        toast({
          title: "NFT Listing Cancelled",
          description: `${nft.name} listing has been cancelled successfully`,
          variant: "default",
          action: (
            <Link
              href={`http://explorer.movementnetwork.xyz/txn/${txResult}`}
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              View Transaction
            </Link>
          )
        });
      }

      // Refresh NFT data after a short delay to allow blockchain confirmation
      setTimeout(() => {
        refetchNFTs();
      }, 2000);

    } catch (error) {
      // Improved error handling with specific messages
      console.error("Failed to cancel listing:", error);

      // Provide more specific error messages if possible
      const errorMessage = error instanceof Error
        ? error.message
        : "An unknown error occurred while cancelling the listing";

      toast({
        title: "Failed to Cancel Listing",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };


  // Function to open listing dialog with selected NFT
  const openListingDialog = (nft: NFT) => {
    setSelectedNFT(nft)
    setIsListingDialogOpen(true)
  }

  // Function to get NFT status badge
  const getNftStatusBadge = (nft: NFT) => {
    if (nft.sale_type === 0 && nft.for_sale) {
      return (
        <Badge className="bg-green-100 text-green-800 whitespace-nowrap hover:bg-green-200">
          For Sale
        </Badge>
      )
    } else if (nft.sale_type === 1 && nft.for_sale) {
      return (
        <Badge className="bg-green-100 text-green-800 whitespace-nowrap hover:bg-green-200">
          For Auction
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-purple-100 text-purple-800 whitespace-nowrap hover:bg-purple-200">
          Not Listed
        </Badge>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-2">My Portfolio</h1>
        <p className="text-muted-foreground mb-8">Manage your NFT collections and listings</p>

        <Tabs defaultValue="nfts" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="nfts" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              <span>My NFTs</span>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>My Collections</span>
            </TabsTrigger>
          </TabsList>

          {/* NFTs Tab */}
          <TabsContent value="nfts">
            {isLoadingNFTs ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading your NFTs...</span>
              </div>
            ) : nfts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold mb-2">No NFTs Found</h3>
                <p className="text-muted-foreground mb-6">You don't have any NFTs in your wallet yet.</p>
                <Button variant="outline" onClick={() => window.location.href = "/create-nft"}>
                  Create Your First NFT
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map((nft: NFT, index: number) => (
                  <Card key={nft.id || index} className="overflow-hidden hover:shadow-xl transition-shadow rounded-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={nft.uri || '/fallback-nft.png'}
                        alt={nft.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-2 right-2">{getNftStatusBadge(nft)}</div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold truncate">{nft.name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm truncate text-gray-500">
                        {nft.collection_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 py-2">
                      {nft.for_sale ? (
                        nft.sale_type === 1 ? (
                          <div className="flex items-center text-sm font-medium text-blue-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {nft.auction?.deadline
                              ? new Date(nft.auction.deadline * 1000).toLocaleDateString()
                              : "Auction"}
                          </div>
                        ) : (
                          <div className="flex items-center text-sm font-medium text-green-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatMoveCoin(nft.price)}
                          </div>
                        )
                      ) : (
                        <span className="text-sm text-gray-400">Not listed</span>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex  items-center gap-2">
                      <Link className="flex-1" href={`/nft/${nft.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100 w-full hover:bg-gray-900 transition-colors"
                        >
                          View NFT
                        </Button>
                      </Link>
                      {nft.for_sale ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 hover:bg-red-700 transition-colors"
                          onClick={() => handleCancelListing(nft)}
                        >
                          Cancel Listing
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-blue-50 transition-colors"
                          onClick={() => openListingDialog(nft)}
                        >
                          List for Sale
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections">
            {isLoadingCollections ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading your collections...</span>
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold mb-2">No Collections Found</h3>
                <p className="text-muted-foreground mb-6">You haven't created any collections yet.</p>
                <Button variant="outline" onClick={() => window.location.href = "/create-nft"}>
                  Create Your First Collection
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection: Collection, index: number) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 overflow-hidden bg-muted">
                      <img
                        src={collection.uri || "/api/placeholder/400/200"}
                        alt={collection.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{collection.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {collection.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* NFT Listing Dialog */}
      <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>List NFT for Sale</DialogTitle>
            <DialogDescription>
              Choose how you want to sell your NFT.
            </DialogDescription>
          </DialogHeader>

          {selectedNFT && (
            <div className="flex items-start gap-4 mb-4">
              <div className="w-24 h-24 overflow-hidden rounded-md">
                <img
                  src={selectedNFT.uri}
                  alt={selectedNFT.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/api/placeholder/100/100"
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold">{selectedNFT.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedNFT.collection_name}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Sale Type Selection */}
            <div className="space-y-2">
              <Label>Sale Type</Label>
              <RadioGroup
                value={saleType}
                onValueChange={(value) => setSaleType(value as SaleType)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SaleType.INSTANT} id="instant" />
                  <Label htmlFor="instant" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Instant Sale (Fixed Price)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SaleType.AUCTION} id="auction" />
                  <Label htmlFor="auction" className="flex items-center">
                    <Timer className="h-4 w-4 mr-2" />
                    Auction (Time-Limited)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Instant Sale Fields */}
            {saleType === SaleType.INSTANT && (
              <div className="space-y-2">
                <Label htmlFor="price">Price (MOVE)</Label>
                <div className="relative">
                  <Input
                    id="price"
                    placeholder="0.00"
                    type="number"
                    min="0"
                    step="0.01"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    className="pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-sm text-muted-foreground">MOVE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Auction Fields */}
            {saleType === SaleType.AUCTION && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="minBid">Starting Price (MOVE)</Label>
                  <div className="relative">
                    <Input
                      id="minBid"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      value={auctionMinBid}
                      onChange={(e) => setAuctionMinBid(e.target.value)}
                      className="pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-sm text-muted-foreground">MOVE</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Auction End Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={auctionDeadline}
                    onChange={(e) => setAuctionDeadline(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Auction can run between 1 and 30 days
                  </p>
                </div>
              </>
            )}

            <div className="flex items-center text-xs bg-blue-50 p-2 rounded">
              <Info className="h-3 w-3 mr-1 text-blue-500" />
              <span className="text-blue-500">
                {saleType === SaleType.INSTANT
                  ? "Your NFT will be listed at a fixed price until you remove the listing."
                  : "Your NFT will be available for bidding until the auction ends. The highest bid wins."}
              </span>
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsListingDialogOpen(false)}
              disabled={transactionInProcess}
            >
              Cancel
            </Button>
            <Button
              onClick={handleListNFT}
              disabled={(saleType === SaleType.INSTANT && !listingPrice) ||
                (saleType === SaleType.AUCTION && (!auctionMinBid || !auctionDeadline)) ||
                transactionInProcess}
            >
              {transactionInProcess ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {saleType === SaleType.INSTANT ? 'Listing NFT...' : 'Creating Auction...'}
                </>
              ) : (
                saleType === SaleType.INSTANT ? 'List for Sale' : 'Create Auction'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}