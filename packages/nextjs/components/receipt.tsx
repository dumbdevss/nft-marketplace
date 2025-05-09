import { CheckCircle } from "lucide-react"
import { Button } from "~~/components/ui/button"
import { Separator } from "~~/components/ui/separator"
import Image from "next/image"

interface NFT {
  id: string
  name: string
  image: string
  price: number
  collection: string
  owner: string
  contractAddress: string
  tokenId: string
  properties: any[]
  history: any[]
}

interface ReceiptProps {
  nft: NFT
  type: "purchase" | "transfer" | "mint"
  timestamp: string
  transactionHash: string
}

export function Receipt({ nft, type, timestamp, transactionHash }: ReceiptProps) {
  const formattedDate = new Date(timestamp).toLocaleString()
  const shortHash = `${transactionHash.substring(0, 6)}...${transactionHash.substring(transactionHash.length - 4)}`

  const getTitle = () => {
    switch (type) {
      case "purchase":
        return "Purchase Successful"
      case "transfer":
        return "Transfer Successful"
      case "mint":
        return "NFT Minted Successfully"
      default:
        return "Transaction Successful"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        <p className="text-sm text-muted-foreground">Transaction completed at {formattedDate}</p>
      </div>

      <div className="flex items-center space-x-4 bg-muted/30 p-4 rounded-lg">
        <div className="relative h-16 w-16 overflow-hidden rounded-md">
          <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-medium">{nft.name}</h3>
          <p className="text-sm text-muted-foreground">{nft.collection}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Transaction Type</span>
          <span className="font-medium capitalize">{type}</span>
        </div>
        {type === "purchase" && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">{nft.price} MOVE</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Transaction Hash</span>
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            {shortHash}
          </a>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Token ID</span>
          <span className="font-medium">{nft.tokenId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Contract Address</span>
          <span className="font-mono text-xs truncate max-w-[180px]">{nft.contractAddress}</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col space-y-2">
        <Button variant="outline" className="w-full">
          View on Etherscan
        </Button>
        <Button variant="outline" className="w-full">
          Share
        </Button>
        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Done
        </Button>
      </div>
    </div>
  )
}

