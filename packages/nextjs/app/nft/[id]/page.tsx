"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Navbar } from "~~/components/navbar"
import { Footer } from "~~/components/footer"
import { Button } from "~~/components/ui/button"
import { Card, CardContent } from "~~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs"
import { Badge } from "~~/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~~/components/ui/dialog"
import { Input } from "~~/components/ui/input"
import Receipt from "~~/components/receipt"
import { useToast } from "~~/hooks/use-toast"
import { NFT } from "~~/types/nft-types"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { getNFTById } from "~~/lib/nft-data"
import { Clock, Heart, Share2, Tag, MoveIcon as Transfer } from "lucide-react"
import CopyToClipboard from "react-copy-to-clipboard"

// Define the NFTDetails type
type NFTDetails = {
  id: string;            // ID of the NFT
  owner: `0x${string}`;  // Blockchain address of the owner
  creator: `0x${string}`; // Creator address
  created_at: number;    // Creation timestamp
  name: string;          // Name of the NFT
  description: string;   // Description of the NFT
  uri: string;           // URI pointing to the NFT's media
  price: number;         // Listed price or reserve price
  for_sale: boolean;     // Whether the NFT is currently listed for sale
  sale_type: number;     // 0 = direct sale, 1 = auction, etc.
  category: string;      // Category of the NFT
  collection_name: string; // Collection name
  auction: any;          // Auction details
  token: any;            // Token ID
  history: {             // History of transactions
    new_owner: `0x${string}`;
    seller: `0x${string}`;
    amount: number;
    timestamp: number;
  }[];
}

export default function NFTDetail() {
  const { id } = useParams()
  const nftStatic = getNFTById(id as string)
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showOfferDialog, setShowOfferDialog] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [hash, setHash] = useState("")
  const [transferAddress, setTransferAddress] = useState<`0x${string}`>('0x' as `0x${string}`)
  const [offerAmount, setOfferAmount] = useState(0)
  const [transactionType, setTransactionType] = useState<"purchase" | "transfer" | "offer" | "resolve">('purchase')
  const { account } = useWallet()

  // TODO 13: Using useSubmitTransaction hook get the submitTransaction function and transactionInProcess

  const { toast } = useToast()
  const [like, setLike] = useState(false)

  // TODO 14: Implement useView hook for fetching NFT details
  const {
    data: nftRawData,
    refetch: refetchNFT,
    isLoading
  } = {
    data: [[]],
    refetch: () => {},
    isLoading: false
  }

  // Parse NFT data using useMemo with proper typing
  const nftData = useMemo<NFTDetails | null>(() => {
    if (!nftRawData || !Array.isArray(nftRawData)) {
      return null;
    }

    const data = nftRawData[0] as NFT; // Get the NFT data from the first index

    return {
      id: data.id || id as string,
      owner: data.owner || '0x0000000000000000000000000000000000000000',
      creator: data.creator || '0x0000000000000000000000000000000000000000',
      created_at: data.created_at || Date.now(),
      name: data.name || 'Unnamed NFT',
      description: data.description || '',
      uri: data.uri || '',
      price: data.price / 100000000 || 0, // Convert from smallest units
      for_sale: Boolean(data.for_sale),
      sale_type: typeof data.sale_type === 'number' ? data.sale_type : 0,
      category: data.category || '',
      collection_name: data.collection_name || '',
      auction: data.auction || {},
      token: data.token || {},
      history: Array.isArray(data.history) ? data.history.map((item: any) => ({
        new_owner: item.new_owner || '0x0000000000000000000000000000000000000000',
        seller: item.seller || '0x0000000000000000000000000000000000000000',
        amount: parseInt(item.amount) / 100000000 || 0, // Convert from smallest units
        timestamp: parseInt(item.timestamp) || 0
      })) : []
    };
  }, [nftRawData, id]);

  // Merge static and blockchain data
  const nft: any = useMemo(() => {
    if (!nftData) return nftStatic;
    return {
      ...nftStatic,
      ...nftData,
      // Add any specific mappings if needed
    };
  }, [nftStatic, nftData]);

  const isOwner = account?.address === nftData?.owner;
  const isAuction = nftData?.sale_type === 1;
  const auctionEnded = isAuction && nftData?.auction?.deadline < Date.now() / 1000;

  // TODO 15: Implement handlePurchase function
  /*
  const handlePurchase = async () => {
    // 1. Set transaction type to "purchase"
    // 2. Submit transaction to purchase NFT using NFT ID
    // 3. Store transaction hash
    // 4. Close buy dialog
    // 5. Wait for blockchain processing and refetch NFT data
    // 6. Show receipt dialog
    // 7. Handle any errors
  }
  */

  // TODO 16: Implement handlePlaceOffer function
  /*
  const handlePlaceOffer = async () => {
    // 1. Close offer dialog
    // 2. Set transaction type to "offer"
    // 3. Convert offer amount to smallest units
    // 4. Submit transaction to place offer with NFT ID and offer amount
    // 5. Store transaction hash
    // 6. Wait for blockchain processing and refetch NFT data
    // 7. Show receipt dialog
    // 8. Handle any errors
  }
  */

  // TODO 17: Implement handleTransferNFT function
  /*
  const handleTransferNFT = async () => {
    // 1. Close transfer dialog
    // 2. Set transaction type to "transfer"
    // 3. Submit transaction to transfer NFT using NFT ID and recipient address
    // 4. Store transaction hash
    // 5. Wait for blockchain processing and refetch NFT data
    // 6. Show receipt dialog
    // 7. Handle any errors
  }
  */

  // TODO 18: Implement handleResolveAuction function
  /*
  const handleResolveAuction = async () => {
    // 1. Set transaction type to "resolve"
    // 2. Submit transaction to finalize auction using NFT ID
    // 3. Store transaction hash
    // 4. Wait for blockchain processing and refetch NFT data
    // 5. Show receipt dialog
    // 6. Handle any errors
  }
  */

  // TODO 19: Implement handleLike function
  /*
  const handleLike = () => {
    // 1. Toggle like state
    // 2. Show toast notification indicating like or unlike action
  }
  */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <Navbar />
        <main className="py-12 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold mb-4">Loading NFT...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
    );
  }

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Format address to shortened version
  const shortenAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleCopy = () => {
    toast({
      title: 'Success',
      description: "NFT link copied to clipboard",
      variant: 'default',
      className: 'bg-green-700 text-foreground',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* NFT Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-muted">
              <img
                src={`${nft.uri}` || "/placeholder.svg"}
                alt={nft.name}
                className="object-cover w-full"
              />
            </div>

            {/* NFT Details */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="bg-muted/30 text-primary-foreground">
                  {nft.collection_name}
                </Badge>
                <div className="flex gap-2">
                  <Button onClick={() => { }} variant="outline" size="icon"> {/* TODO 20: Connect to handleLike */}
                    <Heart className={`h-4 w-4 ${like && 'fill-red-700'}`} />
                  </Button>
                  <CopyToClipboard text={`http://localhost/nft/${nft.id}`} onCopy={handleCopy}>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CopyToClipboard>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2">{nft.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                <p className="text-muted-foreground">Owned by</p>
                <span className="font-medium text-primary-foreground">
                  {shortenAddress(nft.owner)}
                </span>
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border-muted mb-6">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isAuction ? "Current Bid" : "Current Price"}
                      </p>
                      <p className="text-3xl font-bold">{nft.price} MOVE</p>
                      <p className="text-sm text-muted-foreground">
                        (≈ ${(nft.price * 7.50).toLocaleString()})
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {!isOwner && nft.for_sale && (
                        isAuction ? (
                          <Button
                            onClick={() => setShowOfferDialog(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Tag className="mr-2 h-4 w-4" /> Place Bid
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setShowBuyDialog(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Tag className="mr-2 h-4 w-4" /> Buy Now
                          </Button>
                        )
                      )}

                      {isOwner && (
                        <Button variant="outline" onClick={() => setShowTransferDialog(true)}>
                          <Transfer className="mr-2 h-4 w-4" /> Transfer
                        </Button>
                      )}

                      {isAuction && auctionEnded && (
                        <Button
                          onClick={() => { }} // TODO 21: Connect to handleResolveAuction and false to transactionInProcess from the submitTransaction hook
                          disabled={false}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Resolve Auction
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isAuction && nft.auction?.deadline && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {auctionEnded
                        ? "Auction has ended"
                        : `Auction ends at ${formatDate(nft.auction.deadline)}`
                      }
                    </span>
                  </div>
                </div>
              )}

              <Tabs defaultValue="details">
                <TabsList className={`grid w-full ${isAuction && isOwner ? "grid-cols-3" : "grid-cols-2"}`}>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  {isAuction && (
                    <TabsTrigger value="bids">Bids</TabsTrigger>
                  )}
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <div className="space-y-4">
                    <p>{nft.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Creator</p>
                        <p className="font-mono text-sm truncate">{shortenAddress(nft.creator)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Token ID</p>
                        <p className="font-mono text-sm">{nft.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p>{nft.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p>{formatDate(nft.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {isAuction && (
                  <TabsContent value="bids" className="mt-4">
                    <div className="space-y-4">
                      {nft.auction?.vec?.[0].offers && nft.auction?.vec?.[0].offers?.length > 0 ? (
                        nft.auction?.vec?.[0].offers?.map((bid: any, index: number) => (
                          <div key={index} className="flex justify-between items-center border-b border-muted pb-3">
                            <div>
                              <p className="font-medium">Bid</p>
                              <p className="text-sm text-muted-foreground">
                                From {shortenAddress(bid.bidder)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p>{parseFloat(bid.amount) / 100000000} MOVE</p>
                              <p className="text-sm text-muted-foreground">{formatDate(bid.timestamp)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No bids available for this NFT
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                <TabsContent value="history" className="mt-4">
                  <div className="space-y-4">
                    {nft.history && nft.history.length > 0 ? (
                      nft.history.map((event: any, index: number) => (
                        <div key={index} className="flex justify-between items-center border-b border-muted pb-3">
                          <div>
                            <p className="font-medium">Transfer</p>
                            <p className="text-sm text-muted-foreground">
                              From {shortenAddress(event.seller)} to {shortenAddress(event.new_owner)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p>{event.amount > 0 ? `${event.amount} MOVE` : "N/A"}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(event.timestamp)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No transaction history available for this NFT
                      </div>
                    )}
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
              <span className="font-medium">{nft.price} MOVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Processing Fee</span>
              <span className="font-medium">{((nft.price * 0.05) + nft.price).toFixed(2)} MOVE</span>
            </div>
            <div className="border-t border-muted pt-2 flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="font-medium">{((nft.price * 0.05) + nft.price).toFixed(2)} MOVE</span>
            </div>
            {/* TODO 22: Connect to handlePurchase and change false to transactionInProcess from the useSubmitTransaction hook  */}
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => { }} 
              disabled={false}
            >
              {false ? "Processing..." : "Confirm Purchase"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Place Offer/Bid Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Place {isAuction ? "Bid" : "Offer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                {isAuction ? "Bid Amount" : "Offer Amount"} (MOVE)
              </label>
              <Input
                id="amount"
                type="number"
                min={isAuction ? nft.price + 0.1 : 0.1}
                step="0.1"
                value={offerAmount}
                onChange={(e) => setOfferAmount(parseFloat(e.target.value))}
                placeholder="Enter amount in MOVE"
              />
              {isAuction && (
                <p className="text-xs text-muted-foreground">
                  Minimum bid: {nft.price + 0.1} MOVE
                </p>
              )}
            </div>
            <div className="border-t border-muted bt-2 flex items-center justify-between">
              <span>Processing Fee</span>
              <span className="font-medium">{offerAmount + (0.05 * offerAmount)} MOVE</span>
            </div>
            {/* TODO 23: change false to transactionInProcess from the submitTransaction hook */}
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => { }} // TODO 24: Connect to handlePlaceOffer
              disabled={false ||
                (isAuction && offerAmount <= nft.price) ||
                offerAmount <= 0}
            >
              {false ? "Processing..." : `Confirm ${isAuction ? "Bid" : "Offer"}`}
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
              <Input
                id="address"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value as `0x${string}`)}
                className="font-mono"
                placeholder="0x..."
              />
            </div>
            <div className="border-t border-muted pt-2 flex items-center justify-between">
              <span>Gas Fee</span>
              <span className="font-medium">0.002 MOVE</span>
            </div>
            {/* TODO 25: change false to transactionInProcess from the submitTransaction hook */}
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => { }} // TODO 26: Connect to handleTransferNFT
              disabled={false || !transferAddress.startsWith('0x') || transferAddress.length < 10}
            >
              {false ? "Processing..." : "Confirm Transfer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      {hash && <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Receipt</DialogTitle>
          </DialogHeader>
          <Receipt
            nft={nftData as NFT}
            type={transactionType}
            timestamp={new Date().toISOString()}
            transactionHash={hash}
            closeReceipt={() => setShowReceipt(false)}
          />
        </DialogContent>
      </Dialog>}
    </div>
  )
}