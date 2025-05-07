"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "~~/components/ui/card"
import { Button } from "~~/components/ui/button"
import { Badge } from "~~/components/ui/badge"
import { Input } from "~~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select"
import { Search } from "lucide-react"
import { getNFTs } from "~~/lib/nft-data"

export function NFTGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  const nfts = getNFTs()

  const filteredNFTs = nfts.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "recent":
      default:
        return 0 // In a real app, would sort by date
    }
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, collection, or creator"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedNFTs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No NFTs found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNFTs.map((nft) => (
            <Link href={`/nft/${nft.id}`} key={nft.id} className="group">
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-muted transition-all hover:border-primary">
                <div className="relative aspect-square">
                  <Image
                    src={nft.image || "/placeholder.svg"}
                    alt={nft.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {nft.badge && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600">
                      {nft.badge}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg truncate flex-1">{nft.name}</h3>
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {nft.collection}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">By {nft.owner}</p>
                    <p className="font-medium">{nft.price} ETH</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

