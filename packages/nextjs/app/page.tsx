import Link from "next/link"
import { Button } from "~~/components/ui/button"
import { Navbar } from "~~/components/navbar"
import { FeaturedNFTs } from "~~/components/featured-nfts"
import { Footer } from "~~/components/footer"
import { AnimatedCounter } from "~~/components/animated-counter"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-[radial-gradient(ellipse_at_center,_#5B21B6_0%,_#000_70%)]">
            {/* Main background gradient */}
            <div className="absolute inset-0 bg-black bg-[radial-gradient(ellipse_at_center,_#5B21B6_0%,_#000_70%)]"></div>

            {/* Horizontal glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-px z-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

            {/* Additional glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] z-0 bg-purple-500/20 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] z-0 bg-pink-500/20 rounded-full blur-3xl opacity-20"></div>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 z-10 bg-grid-white bg-[size:3rem_3rem]"></div>
          </div>
          <div className="mx-auto relative max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Discover, Collect & Sell Extraordinary NFTs
            </h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Explore the world of digital art and collectibles. Buy, sell, and discover exclusive digital items.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/create">Create NFT</Link>
              </Button>
            </div>
          </div>

          {/* Dashboard preview similar to FlowSync's layout */}
          <div className="relative mt-16 mx-auto max-w-5xl">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-900/10 to-transparent rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 backdrop-blur-sm rounded-xl border border-purple-500/20">
              <AnimatedCounter end={152847} label="NFTs Sold" suffix="+" startFrom={1} />
              <AnimatedCounter end={32415} label="Trusted Users" suffix="+" startFrom={1} />
              <AnimatedCounter end={8723} label="Verified Artists" suffix="+" startFrom={1} />
            </div>
          </div>
        </section>

        {/* Featured NFTs */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold mb-10 text-center">Featured NFTs</h2>
            <FeaturedNFTs />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

