"use client"

import { useState, useEffect, useMemo } from "react"
import { Navbar } from "~~/components/navbar"
import { Footer } from "~~/components/footer"
import { NFTGrid } from "~~/components/nft-grid"
import { NFTFilters } from "~~/components/nft-filters"
import { NFT } from "~~/types/nft-types"
import { Collection } from "~~/types/collection-types"
import { useView } from "~~/hooks/scaffold-move/useView"

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

  // Fetch collections data using the useView hook
  const {
    data: collectionsData,
    error: collectionsError,
    isLoading: isLoadingCollections,
    refetch: refetchCollections
  } = useView({
    moduleName: "NFTMarketplace",
    functionName: "get_all_collections",
    args: [10, 0],
  })

  // Fetch NFTs for sale using the useView hook
  const {
    data: nftsData,
    error: nftsError,
    isLoading: isLoadingNFTs,
    refetch: refetchNFTs
  } = useView({
    moduleName: "NFTMarketplace",
    functionName: "get_nfts_for_sale",
  })

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

  // Apply filters whenever filter state changes or data updates
  useEffect(() => {
    if (!allNFTs.length) {
      setFilteredNFTs([])
      return
    }

    let filtered = [...allNFTs]

    // Apply search filter
    if (searchQuery && searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.collection_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.owner.toLowerCase().includes(searchQuery.toLowerCase().replace("0x", ""))
      )
    }

    // Apply category filters
    const activeCategoryFilters = Object.entries(categoryFilters).filter(([_, isActive]) => isActive)
    if (activeCategoryFilters.length > 0) {
      filtered = filtered.filter(nft => {
        const category = nft.category.toLowerCase()
        return activeCategoryFilters.some(([key, _]) => {
          return category === key
        })
      })
    }

    // Apply status filters
    if (statusFilters.buyNow) {
      filtered = filtered.filter(nft => nft.sale_type === 0 && nft.for_sale)
    }
    if (statusFilters.onAuction) {
      filtered = filtered.filter(nft => nft.sale_type === 1 && nft.for_sale)
    }
    if (statusFilters.newItem) {
      // Consider items created in the last 24 hours as new
      const oneDayAgo = Date.now() - 86400000
      filtered = filtered.filter(nft => nft.created_at > oneDayAgo)
    }
    if (statusFilters.hasOffers) {
      filtered = filtered.filter(nft => nft.auction && nft.auction?.vec?.length > 0)
    }

    // Apply collection filters
    const activeCollectionFilters = Object.entries(collectionFilters).filter(([_, isActive]) => isActive)
    if (activeCollectionFilters.length > 0) {
      filtered = filtered.filter(nft => {
        const collection = nft.collection_name.toLowerCase().replace(/\s+/g, '')
        return activeCollectionFilters.some(([key, _]) => {
          return collection.includes(key?.toLowerCase().replace(/\s+/g, ''))
        })
      })
    }
    filtered = filtered.filter(nft => (nft.price / 100000000) >= priceRange[0] && (nft.price / 100000000) <= priceRange[1])


    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "recent":
      default:
        filtered.sort((a, b) => b.created_at - a.created_at)
        break
    }

    setFilteredNFTs(filtered)
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
                onClick={() => {
                  refetchCollections();
                  refetchNFTs();
                }}
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