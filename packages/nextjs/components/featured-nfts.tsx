"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "~~/components/ui/card"
import { Button } from "~~/components/ui/button"
import { Badge } from "~~/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "~~/lib/utils"

const featuredNfts = [
  {
    id: "1",
    name: "Cosmic Perspective #24",
    creator: "ArtistX",
    price: 1.5,
    image: "/placeholder.svg",
    badge: "New",
  },
  {
    id: "2",
    name: "Digital Dreams #12",
    creator: "CryptoCreator",
    price: 2.3,
    image: "/placeholder.svg",
    badge: "Hot",
  },
  {
    id: "3",
    name: "Abstract Realms",
    creator: "DigitalArtist",
    price: 0.8,
    image: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Neon Wilderness",
    creator: "FutureVisions",
    price: 3.2,
    image: "/placeholder.svg",
    badge: "Trending",
  },
  {
    id: "5",
    name: "Pixel Perfection",
    creator: "8BitWizard",
    price: 1.1,
    image: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Ethereal Echoes",
    creator: "DreamWeaver",
    price: 2.7,
    image: "/placeholder.svg",
  },
]

export function FeaturedNFTs() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(featuredNfts.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage >= featuredNfts.length ? 0 : prevIndex + itemsPerPage))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0 ? Math.max(0, featuredNfts.length - itemsPerPage) : prevIndex - itemsPerPage,
    )
  }

  const currentItems = featuredNfts.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentItems.map((nft) => (
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
                <h3 className="font-medium text-lg truncate">{nft.name}</h3>
                <p className="text-sm text-muted-foreground">By {nft.creator}</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="font-medium">{nft.price} ETH</p>
                  <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(i * itemsPerPage)}
              className={cn("rounded-full w-8 h-8", currentIndex === i * itemsPerPage && "bg-muted")}
            >
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  )
}

