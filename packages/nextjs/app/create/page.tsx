"use client"

import { useState, useEffect } from "react"
import { Navbar } from "~~/components/navbar"
import { Footer } from "~~/components/footer"
import { Button } from "~~/components/ui/button"
import { Card, CardContent } from "~~/components/ui/card"
import { Input } from "~~/components/ui/input"
import { Label } from "~~/components/ui/label"
import { Textarea } from "~~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~~/components/ui/dialog"
import Receipt from "~~/components/receipt"
import { Upload, Plus, Loader2 } from "lucide-react"
import { useView } from "~~/hooks/scaffold-move/useView"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction"
import { NFT } from "~~/types/nft-types"

export default function CreateNFT() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)
  const [collectionChoice, setCollectionChoice] = useState<string>("existing")
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const [newCollectionData, setNewCollectionData] = useState({
    name: "",
    description: "",
    uri: ""
  })
  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    category: "Art",
    collection: ""
  })
  const [uploadingFile, setUploadingFile] = useState(false)
  const [hash, setHash] = useState<string | null>(null)
  const [mintedNFT, setMintedNFT] = useState<NFT | null>(null)

  const { account } = useWallet()
  const { submitTransaction, transactionInProcess, transactionResponse } = useSubmitTransaction("NFTMarketplace")

  // Pinata API credentials - in a real app, these should be environment variables
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
  const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET
  const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/"

  const { data, error, isLoading, refetch } = useView({
    moduleName: "NFTMarketplace",
    functionName: "get_all_collections_by_user",
    args: [account?.address as `0x${string}`, 10, 0],
  })

  const collections = data?.[0] || []
  
  // State for temporarily storing NFT collection and name for fetching after minting
  const [mintedNFTInfo, setMintedNFTInfo] = useState<{collection: string, name: string} | null>(null)
  
  // This hook fetches NFT data for display in the receipt
  const { 
    data: fetchedNFTData, 
    refetch: refetchNFT 
  } = useView({
    moduleName: "NFTMarketplace",
    functionName: "get_nft_by_collection_name_and_token_name",
    args: [
      mintedNFTInfo?.collection || "",
      mintedNFTInfo?.name || "",
      account?.address as `0x${string}` || ""
    ],
  })
  
  // Effect to update mintedNFT when fetchedNFTData changes
  useEffect(() => {
    if (fetchedNFTData?.[0]?.vec?.[0]) {
      setMintedNFT(fetchedNFTData[0].vec[0] as NFT)
    }
  }, [fetchedNFTData])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingFile(true)
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload this to IPFS or another storage
      // and get back a URL. For now, we'll create a local object URL
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          "pinata_api_key": PINATA_API_KEY || "",
          "pinata_secret_api_key": PINATA_API_SECRET || "",
        },
        body: formData,
      })

      const data = await response.json()
      console.log(data)
      const ipfsHash = data.IpfsHash
      const fileUrl = `${PINATA_GATEWAY}/ipfs/${ipfsHash}`
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setFileUrl(fileUrl) // This would be a real IPFS URL in production
      setUploadingFile(false)
    }
  }

  const mintNFT = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // The smart contract handles collection initialization internally
      // We just need to pass all the data in one call
      const finalCollectionName = collectionChoice === "new" ? newCollectionData.name : nftData.collection
      const collectionDescription = collectionChoice === "new" ? newCollectionData.description : "null"
      const collectionUri = collectionChoice === "new" ? newCollectionData.uri : "null"
      const finalTokenName = nftData.name

      let response = await submitTransaction("mint_nft", [
        finalCollectionName,
        collectionDescription,
        collectionUri,
        finalTokenName,
        nftData.description,
        nftData.category,
        fileUrl
      ])
      
      setHash(response)
      
          // Update the mintedNFTInfo state to trigger the useView hook
      setMintedNFTInfo({
        collection: finalCollectionName,
        name: finalTokenName
      })
      
      // Wait a moment for blockchain to process before fetching the NFT data
      setTimeout(async () => {
        // Use the refetchNFT function to get the latest data
        const result = await refetchNFT()
        
        // After refetching, set the data and show receipt
        setShowReceipt(true)
      }, 2000)
    } catch (error) {
      console.error("Failed to mint NFT:", error)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="py-12 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Create New NFT</h1>

          <Card className="bg-card/50 backdrop-blur-sm border-muted">
            <CardContent className="pt-6">
              <form onSubmit={mintNFT} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-muted rounded-lg p-6 h-64">
                    {uploadingFile ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Uploading to IPFS...</p>
                      </div>
                    ) : previewImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => {
                            setPreviewImage(null)
                            setFileUrl("")
                          }}
                        >
                          Change
                        </Button>
                        {fileUrl && (
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                            IPFS Stored
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          PNG, JPG, GIF or SVG. Max 100MB.
                        </p>
                        <Button type="button" variant="outline" className="mt-4">
                          Choose File
                          <input
                            id="image"
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* NFT Details */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Item name"
                    required
                    value={nftData.name}
                    onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of your item"
                    rows={4}
                    value={nftData.description}
                    onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                  />
                </div>

                {/* Collection Selection */}
                <div className="space-y-2">
                  <Label htmlFor="collection">Collection</Label>
                  <Select
                    value={collectionChoice}
                    onValueChange={(value) => {
                      setCollectionChoice(value)
                      setIsCreatingCollection(value === "new")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select collection option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="existing">Use Existing Collection</SelectItem>
                      <SelectItem value="new">Create New Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Existing Collection Selector */}
                {collectionChoice === "existing" && (
                  <div className="space-y-2">
                    <Label htmlFor="existingCollection">Select Collection</Label>
                    <Select
                      value={nftData.collection}
                      onValueChange={(value) => setNftData({ ...nftData, collection: value })}
                      disabled={isLoading || collections.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoading ? "Loading collections..." :
                            collections.length === 0 ? "No collections found" :
                              "Select a collection"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map((collection: any, index: number) => (
                          <SelectItem key={index} value={collection.name}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {collections.length === 0 && !isLoading && (
                      <p className="text-sm text-amber-500">
                        No existing collections found. Create a new collection first.
                      </p>
                    )}
                  </div>
                )}

                {/* New Collection Fields */}
                {isCreatingCollection && (
                  <div className="space-y-4 border border-muted p-4 rounded-lg">
                    <h3 className="font-medium">New Collection Details</h3>

                    <div className="space-y-2">
                      <Label htmlFor="collectionName">Collection Name</Label>
                      <Input
                        id="collectionName"
                        placeholder="Collection name"
                        required={isCreatingCollection}
                        value={newCollectionData.name}
                        onChange={(e) => setNewCollectionData({ ...newCollectionData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="collectionDescription">Collection Description</Label>
                      <Textarea
                        id="collectionDescription"
                        placeholder="Describe your collection"
                        rows={2}
                        value={newCollectionData.description}
                        onChange={(e) => setNewCollectionData({ ...newCollectionData, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="collectionUri">Collection Image URL</Label>
                      <Input
                        id="collectionUri"
                        placeholder="https://example.com/collection-image.png"
                        value={newCollectionData.uri}
                        onChange={(e) => setNewCollectionData({ ...newCollectionData, uri: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Optional: URL to an image representing this collection</p>
                    </div>
                  </div>
                )}

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={nftData.category}
                    onValueChange={(value) => setNftData({ ...nftData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Collectibles">Collectibles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={transactionInProcess || uploadingFile || !fileUrl || (collectionChoice === "existing" && !nftData.collection)}
                  >
                    {transactionInProcess ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Minting NFT...
                      </>
                    ) : uploadingFile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Create NFT"
                    )}
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
          {mintedNFT && (
            <Receipt
              nft={mintedNFT}
              type="mint"
              timestamp={new Date().toISOString()}
              transactionHash={hash || ""}
              closeReceipt={() => setShowReceipt(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}