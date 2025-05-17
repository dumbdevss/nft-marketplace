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
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { NFT } from "~~/types/nft-types"

// TODOs 1: Configure Pinata API key, API secret, Pinata gateway URL
const PINATA_API_KEY = ""
const PINATA_API_SECRET = ""
const PINATA_GATEWAY = ""

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

  const { account } = useWallet();
  // TODOs 2: Using useSubmitTransaction hook get the submitTransaction function and transactionInProcess

  // TODOs 3: Implement useView hook for fetching user collections
  const { data, error, isLoading, refetch } = {
    data: [[]],
    error: "",
    isLoading: false,
    refetch: () => {}
  }

  const collections = data?.[0] || []

  // TODOs 4: Implement useView hook for fetching minted NFT data
  const { 
    data: fetchedNFTData, 
    refetch: refetchNFT 
  } = {
    data: [[]],
    refetch: () => {}
  }

  // State for temporarily storing NFT collection and name for fetching after minting
  const [mintedNFTInfo, setMintedNFTInfo] = useState<{collection: string, name: string} | null>(null)

  // Effect to update mintedNFT when fetchedNFTData changes
  useEffect(() => {
    if (fetchedNFTData?.[0]?.vec?.[0]) {
      setMintedNFT(fetchedNFTData[0].vec[0] as NFT)
    }
  }, [fetchedNFTData])

  // TODOs 5: Implement handleImageChange function
  /*
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Set uploading state to true
    // 2. Get the selected file
    // 3. Create FormData and append the file
    // 4. Make API call to Pinata to upload file to IPFS
    // 5. Get IPFS hash and construct file URL
    // 6. Create local object URL for preview
    // 7. Update state with preview and file URLs
    // 8. Set uploading state to false
  }
  */

  // TODOs 6: Implement mintNFT function
  /*
  const mintNFT = async (e: React.FormEvent) => {
    // 1. Prevent default form submission
    // 2. Determine collection name, description, and URI based on collection choice
    // 3. Submit transaction to mint NFT with provided data
    // 4. Update mintedNFTInfo state to trigger NFT data fetch
    // 5. Wait for blockchain processing and refetch NFT data
    // 6. Show receipt dialog
    // 7. Handle any errors
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="py-12 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Create New NFT</h1>

          <Card className="bg-card/50 backdrop-blur-sm border-muted">
            <CardContent className="pt-6">
              <form onSubmit={() => {}} className="space-y-6">
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
                            onChange={() => {}} // TODOs 7: Connect to handleImageChange
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

                    {/* TODOs 8: display the element only if there is not collection found */}
                    {false && (
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
                  {/* TODOs 9: replace false with transactionInProcess*/}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={false || uploadingFile || !fileUrl || (collectionChoice === "existing" && !nftData.collection)}
                  >
                    {false ? (
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