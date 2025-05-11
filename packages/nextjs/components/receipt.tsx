import { CheckCircle } from "lucide-react"
import { Button } from "~~/components/ui/button"
import { Separator } from "~~/components/ui/separator"
import Image from "next/image"
import { NFT } from "~~/types/nft-types"

interface ReceiptProps {
  nft: NFT
  type: "purchase" | "transfer" | "mint" | "offer" | "resolve"
  timestamp: string
  transactionHash: string,
  closeReceipt: () => void
}

export default function Receipt({ nft, type, timestamp, transactionHash, closeReceipt }: ReceiptProps) {
  console.log(nft);
  const formattedDate = new Date(timestamp).toLocaleString()
  const shortHash = `${transactionHash?.substring(0, 6)}...${transactionHash?.substring(transactionHash.length - 4)}`
  const shortAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <h2 className="text-xl font-bold">NFT Minted Successfully</h2>
        <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
      </div>

      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg mb-6">
        <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0">
          <img
            src={nft.uri || "/placeholder.svg"}
            alt={`${nft.name}`}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-semibold text-gray-700 text-lg">{nft.name}</h3>
          <p className="text-sm text-gray-500">{nft.collection_name}</p>
          <p className="text-xs text-gray-400 mt-1">Token ID: {nft.token?.inner}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Creator</span>
          <span className="font-medium text-gray-700">{shortAddress(nft.creator)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Owner</span>
          <span className="font-medium text-gray-700">{shortAddress(nft.owner)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Price</span>
          <span className="font-medium text-gray-700">Free</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Transaction</span>
          <a
            href={`https://explorer.movementnetwork.xyz/txn/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {shortHash}
          </a>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(`https://explorer.movementnetwork.xyz/txn/${transactionHash}`, '_blank')}
        >
          View on Explorer
        </Button>
        <Button onClick={closeReceipt} className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600">
          Done
        </Button>
      </div>
    </div>
  )
}