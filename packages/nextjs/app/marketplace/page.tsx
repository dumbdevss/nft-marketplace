"use client"

import { useState, useEffect, useMemo } from "react"
import { Navbar } from "~~/components/navbar"
import { Footer } from "~~/components/footer"
import { NFTGrid } from "~~/components/nft-grid"
import { NFTFilters } from "~~/components/nft-filters"
import { NFT } from "~~/types/nft-types"
import { Collection } from "~~/types/collection-types"

export default function Marketplace() {
  // States for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [categoryFilters, setCategoryFilters] = useState({
    art: false,
    collectibles: false,
    sports: false,
    gaming: false,
    music: false,
    photography: false,
  })
  const [statusFilters, setStatusFilters] = useState({
    buyNow: false,
    onAuction: false,
    newItem: false,
    hasOffers: false,
  })
  const [collectionFilters, setCollectionFilters] = useState({
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  // States for data
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([])

  // TODO 10: Implement useView hook for fetching collections
  const {
    data: collectionsData,
    error: collectionsError,
    isLoading: isLoadingCollections,
    refetch: refetchCollections
  } = {
    data: [[]],
    error: "",
    isLoading: false
  }

  // TODO 11: Implement useView hook for fetching NFTs for sale
  const {
    data: nftsData,
    error: nftsError,
    isLoading: isLoadingNFTs,
    refetch: refetchNFTs
  } = {
    data: [[]],
    error: "",
    isLoading: false
  }

  // Parse collection data using useMemo to prevent unnecessary recalculations
  const collections = useMemo(() => {
    return collectionsData && collectionsData[0] ?
      collectionsData[0] as Collection[] :
      []
  }, [collectionsData])

  // Parse NFT data using useMemo
  const allNFTs = useMemo(() => {
    return nftsData && nftsData[0] ?
      nftsData[0] as NFT[] :
      []
  }, [nftsData])

 // TODO 12: Implement NFT filtering and sorting logic
  
  useEffect(() => {
    // Check if allNFTs is empty and set filteredNFTs to empty array if so
    // Create a copy of allNFTs to avoid mutating original data
    // Apply search filter based on searchQuery for name, collection_name, or owner
    // Apply category filters based on active categoryFilters
    // Apply status filters for buyNow, onAuction, newItem, and hasOffers
    // Apply collection filters based on active collectionFilters
    // Apply price range filter using priceRange
    // Sort filtered NFTs based on sortBy (price-low, price-high, or recent)
    // Update filteredNFTs state with the filtered and sorted array
    
  }, [allNFTs, searchQuery, categoryFilters, statusFilters, collectionFilters, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">NFT Marketplace</h1>

          {(isLoadingCollections || isLoadingNFTs) && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {(collectionsError || nftsError) && (
            <div className="text-center py-20">
              <p className="text-red-500">Error loading marketplace data. Please try again.</p>
              <button
                onClick={() => {}} // TODO 13: Implement retry functionality
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoadingCollections && !isLoadingNFTs && !collectionsError && !nftsError && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/4">
                <NFTFilters
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  categoryFilters={categoryFilters}
                  setCategoryFilters={setCategoryFilters}
                  statusFilters={statusFilters}
                  setStatusFilters={setStatusFilters}
                  collectionFilters={collectionFilters}
                  setCollectionFilters={setCollectionFilters}
                  collections={collections}
                />
              </div>
              <div className="w-full lg:w-3/4">
                <NFTGrid
                  nfts={filteredNFTs}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}