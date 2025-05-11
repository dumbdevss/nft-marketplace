"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "~~/components/ui/button"
import { Input } from "~~/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~~/components/ui/navigation-menu"
import {CustomConnectButton} from "~~/components/scaffold-move"
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/sheet"
import { cn } from "~~/lib/utils"
import { Package2, Search, Menu, Wallet } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center gap-x-2">
            <Package2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">NFT Marketplace</span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-900/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/marketplace"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">Featured Collections</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Discover the most exclusive digital collectibles from top artists
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/marketplace?category=art"
                        >
                          <div className="text-sm font-medium leading-none">Art</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Digital paintings, illustrations, and creative artwork
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/marketplace?category=collectibles"
                        >
                          <div className="text-sm font-medium leading-none">Collectibles</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Unique items and limited edition digital collectibles
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/marketplace?category=gaming"
                        >
                          <div className="text-sm font-medium leading-none">Gaming</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            In-game items, characters, and virtual assets
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/marketplace" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Marketplace</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/user" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>My Nfts</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/create" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Create</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="flex items-center gap-x-2">
              <Package2 className="h-6 w-6" />
              <span className="font-bold">NFT Marketplace</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-2">
              <Link
                href="/"
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === "/" ? "text-primary" : "text-muted-foreground",
                )}
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === "/marketplace" ? "text-primary" : "text-muted-foreground",
                )}
              >
                Marketplace
              </Link>
              <Link
                href="/user"
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === "/marketplace" ? "text-primary" : "text-muted-foreground",
                )}
              >
                My NFTs
              </Link>
              <Link
                href="/create"
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === "/create" ? "text-primary" : "text-muted-foreground",
                )}
              >
                Create
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div
          className={cn(
            "flex-1 items-center justify-end gap-x-4 md:justify-end",
            isSearchOpen ? "flex" : "hidden md:flex",
          )}
        >
          <CustomConnectButton />
        
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Toggle search</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

