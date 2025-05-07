"use client"

import { useState } from "react"
import { Button } from "~~/components/ui/button"
import { Checkbox } from "~~/components/ui/checkbox"
import { Slider } from "~~/components/ui/slider"
import { Separator } from "~~/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~~/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

export function NFTFilters() {
  const [priceRange, setPriceRange] = useState([0, 10])
  const [statusFilters, setStatusFilters] = useState({
    buyNow: true,
    onAuction: false,
    newItem: false,
    hasOffers: false,
  })
  const [collectionFilters, setCollectionFilters] = useState({
    cryptoPunks: false,
    boredApe: false,
    azuki: false,
    doodles: false,
    artBlocks: false,
  })
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [statusOpen, setStatusOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [collectionsOpen, setCollectionsOpen] = useState(true)

  const handleStatusChange = (key: keyof typeof statusFilters) => {
    setStatusFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleCollectionChange = (key: keyof typeof collectionFilters) => {
    setCollectionFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleReset = () => {
    setPriceRange([0, 10])
    setStatusFilters({
      buyNow: false,
      onAuction: false,
      newItem: false,
      hasOffers: false,
    })
    setCollectionFilters({
      cryptoPunks: false,
      boredApe: false,
      azuki: false,
      doodles: false,
      artBlocks: false,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <Separator />

      <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-medium">Categories</h3>
          {categoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="art" />
            <label
              htmlFor="art"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Art
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="collectibles" />
            <label
              htmlFor="collectibles"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Collectibles
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="domain-names" />
            <label
              htmlFor="domain-names"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Domain Names
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="music" />
            <label
              htmlFor="music"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Music
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="photography" />
            <label
              htmlFor="photography"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Photography
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={statusOpen} onOpenChange={setStatusOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-medium">Status</h3>
          {statusOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="buy-now"
              checked={statusFilters.buyNow}
              onCheckedChange={() => handleStatusChange("buyNow")}
            />
            <label
              htmlFor="buy-now"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Buy Now
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-auction"
              checked={statusFilters.onAuction}
              onCheckedChange={() => handleStatusChange("onAuction")}
            />
            <label
              htmlFor="on-auction"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              On Auction
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-item"
              checked={statusFilters.newItem}
              onCheckedChange={() => handleStatusChange("newItem")}
            />
            <label
              htmlFor="new-item"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-offers"
              checked={statusFilters.hasOffers}
              onCheckedChange={() => handleStatusChange("hasOffers")}
            />
            <label
              htmlFor="has-offers"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Has Offers
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-medium">Price Range</h3>
          {priceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-4">
            <Slider defaultValue={[0, 10]} max={10} step={0.1} value={priceRange} onValueChange={setPriceRange} />
            <div className="flex items-center justify-between">
              <div className="border rounded-md px-2 py-1 w-20">
                <p className="text-xs text-muted-foreground">Min</p>
                <p>{priceRange[0]} ETH</p>
              </div>
              <div className="border rounded-md px-2 py-1 w-20">
                <p className="text-xs text-muted-foreground">Max</p>
                <p>{priceRange[1]} ETH</p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={collectionsOpen} onOpenChange={setCollectionsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-medium">Collections</h3>
          {collectionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="crypto-punks"
              checked={collectionFilters.cryptoPunks}
              onCheckedChange={() => handleCollectionChange("cryptoPunks")}
            />
            <label
              htmlFor="crypto-punks"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              CryptoPunks
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bored-ape"
              checked={collectionFilters.boredApe}
              onCheckedChange={() => handleCollectionChange("boredApe")}
            />
            <label
              htmlFor="bored-ape"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Bored Ape Yacht Club
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="azuki"
              checked={collectionFilters.azuki}
              onCheckedChange={() => handleCollectionChange("azuki")}
            />
            <label
              htmlFor="azuki"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Azuki
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="doodles"
              checked={collectionFilters.doodles}
              onCheckedChange={() => handleCollectionChange("doodles")}
            />
            <label
              htmlFor="doodles"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Doodles
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="art-blocks"
              checked={collectionFilters.artBlocks}
              onCheckedChange={() => handleCollectionChange("artBlocks")}
            />
            <label
              htmlFor="art-blocks"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Art Blocks
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        Apply Filters
      </Button>
    </div>
  )
}

