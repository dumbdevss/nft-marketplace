// Main NFT type definition
export interface NFT {
  id: string; // u64 in original, but using string for compatibility
  owner: `0x${string}`; // Address type
  creator: `0x${string}`; // Address type
  created_at: number; // u64 timestamp
  category: string;
  collection_name: string;
  name: string;
  description: string;
  uri: string; // Image/media URI
  price: number; // u64 in original
  for_sale: boolean;
  sale_type: number; // u8 in original, 0 = direct sale, 1 = auction, etc.
  auction: any;
  token: any; // Token ID,
  history: any; // History of transactions
}