"use client"

import { useState } from "react"
import { Button } from "~~/components/ui/button"
import { Checkbox } from "~~/components/ui/checkbox"
import { Slider } from "~~/components/ui/slider"
import { Separator } from "~~/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~~/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collection } from "~~/types/collection-types"

interface NFTFiltersProps {
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  categoryFilters: {
    art: boolean
    collectibles: boolean
    gaming: boolean
    sports: boolean
    music: boolean
    photography: boolean
  }
  setCategoryFilters: (filters: any) => void
  statusFilters: {
    buyNow: boolean
    onAuction: boolean
    newItem: boolean
    hasOffers: boolean
  }
  setStatusFilters: (filters: any) => void
  collectionFilters: any
  setCollectionFilters: (filters: any) => void,
  collections: Collection[]
}

export function NFTFilters({
  priceRange,
  setPriceRange,
  categoryFilters,
  setCategoryFilters,
  statusFilters,
  setStatusFilters,
  collectionFilters,
  setCollectionFilters,
  collections
}: NFTFiltersProps) {
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [statusOpen, setStatusOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [collectionsOpen, setCollectionsOpen] = useState(true)

  const handleCategoryChange = (key: keyof typeof categoryFilters) => {
    setCategoryFilters((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleStatusChange = (key: keyof typeof statusFilters) => {
    setStatusFilters((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleCollectionChange = (key: keyof typeof collectionFilters) => {
    setCollectionFilters((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleReset = () => {
    setPriceRange([0, 10])
    setCategoryFilters({
      art: false,
      collectibles: false,
      gaming: false,
      sports: false,
      music: false,
      photography: false,
    })
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

  const handleApplyFilters = () => {
    // All state is already lifted to parent, no additional action needed
    // This button exists for UX purposes
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
            <Checkbox
              id="art"
              checked={categoryFilters.art}
              onCheckedChange={() => handleCategoryChange("art")}
            />
            <label
              htmlFor="art"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Art
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="collectibles"
              checked={categoryFilters.collectibles}
              onCheckedChange={() => handleCategoryChange("collectibles")}
            />
            <label
              htmlFor="collectibles"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Collectibles
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="domain-names"
              checked={categoryFilters.gaming}
              onCheckedChange={() => handleCategoryChange("gaming")}
            />
            <label
              htmlFor="domain-names"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
             Gaming
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="music"
              checked={categoryFilters.music}
              onCheckedChange={() => handleCategoryChange("music")}
            />
            <label
              htmlFor="music"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Music
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="photography"
              checked={categoryFilters.photography}
              onCheckedChange={() => handleCategoryChange("photography")}
            />
            <label
              htmlFor="photography"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Photography
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="photography"
              checked={categoryFilters.sports}
              onCheckedChange={() => handleCategoryChange("sports")}
            />
            <label
              htmlFor="photography"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Sports
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
            <Slider
              max={1000}
              step={0.1}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
            />
            <div className="flex items-center justify-between">
              <div className="border rounded-md px-2 py-1 w-20">
                <p className="text-xs text-muted-foreground">Min</p>
                <p>{priceRange[0]} MOVE</p>
              </div>
              <div className="border rounded-md px-2 py-1">
                <p className="text-xs text-muted-foreground">Max</p>
                <p className="whitespace-nowrap">{priceRange[1]} MOVE</p>
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
          {collections.map((collection: Collection) => {
            return (
              <div key={collection.name} className="flex items-center space-x-2">
                <Checkbox
                  id={collection.name}
                  checked={collectionFilters[collection.name]}
                  onCheckedChange={() => handleCollectionChange(collection.name)}
                />
                <label
                  htmlFor={collection.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {collection.name}
                </label>
              </div>
            )
          })}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* <Button
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button> */}
    </div>
  )
}