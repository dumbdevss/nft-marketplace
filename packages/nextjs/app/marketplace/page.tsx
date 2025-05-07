import { Navbar } from "~~/components/navbar"
import { Footer } from "~~/components/footer"
import { NFTGrid } from "~~/components/nft-grid"
import { NFTFilters } from "~~/components/nft-filters"

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Navbar />
      <main className="py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">NFT Marketplace</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/4">
              <NFTFilters />
            </div>
            <div className="w-full lg:w-3/4">
              <NFTGrid />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

