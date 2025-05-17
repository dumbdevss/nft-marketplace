module marketplace::NFTMarketplace {
    use std::signer;
    use std::vector;
    use aptos_framework::aptos_coin::{AptosCoin};
    use aptos_framework::coin;
    use std::string::{Self, String};
    use std::object::{Self, Object, TransferRef, ConstructorRef};
    use std::option;
    use aptos_token_objects::token::{Self, Token};
    use aptos_token_objects::collection;
    use aptos_framework::timestamp;
    use aptos_framework::account;

    // TODOs 1: set the constants which include seed, marketplace_fee_percentage, cancel_fee_percentage
    const SEED: vector<u8> = b"";
    const MARKETPLACE_FEE_PERCENT: u64 = 0 // represent in 100%;
    const CANCEL_FEE_PERCENT: u64 = 0; // represented as /1000 for precision

    // TODOs 2:  define the error code you want to use
    const E_NOT_AUTHORIZED: u64 = 0;
    const E_NOT_OWNER: u64 = 0;
    const E_ALREADY_LISTED: u64 = 0;
    const E_INVALID_PRICE: u64 = 0;
    const E_NOT_FOR_SALE: u64 = 0;
    const E_INSUFFICIENT_BALANCE: u64 = 0;
    const E_SAME_OWNER: u64 = 0;
    const E_NFT_NOT_FOUND: u64 = 0;
    const E_INVALID_DEADLINE: u64 = 0;
    const E_AUCTION_NOT_ENDED: u64 = 0;
    const E_AUCTION_ENDED: u64 = 0;
    const E_NOT_AUCTION: u64 = 0;
    const E_INVALID_OFFER: u64 = 0;
    const E_INVALID_SALE_TYPE: u64 = 0;
    const E_NO_SIGNER_CAP: u64 = 0;

    // Sale types
    const SALE_TYPE_INSTANT: u8 = 0;
    const SALE_TYPE_AUCTION: u8 = 1;

    /* TODOs 3: Define the Offer data structure
     * @bidder      Address of the bidder
     * @amount      Bid amount in AptosCoin
     * @timestamp   Time when the offer was made
     */
    struct Offer has store, drop, copy {
    }

    /* TODOs 4: Define the Auction data structure
     * @deadline        Optional timestamp when auction ends
     * @offers          Vector of offers made
     * @highest_bid     Current highest bid amount
     * @highest_bidder  Optional address of highest bidder
     */
    struct Auction has store, drop, copy {
    }

    /* TODOs 5: Define the Collection data structure
     * @name        Name of the collection
     * @description Description of the collection
     * @uri         URI for collection metadata
     * @creator     Address of the collection creator
     */
    struct Collection has copy, drop, store {
    }

    /* TODOs 6: Define the NFT data structure
     * @id              Unique identifier for the NFT
     * @owner           Current owner address
     * @creator         Creator address
     * @created_at      Timestamp of creation
     * @category        Category of the NFT
     * @collection_name Name of the collection
     * @name            Name of the NFT
     * @description     Description of the NFT
     * @uri             URI for NFT metadata
     * @price           Current price if for sale
     * @for_sale        Whether the NFT is listed for sale
     * @sale_type       Type of sale (instant or auction)
     * @auction         Optional auction details
     * @token           Token object reference
     * @history         Vector of ownership history
     */
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct NFT has store, key, copy, drop {
    }

    /* TODOs 7: Define the History data structure
     * @new_owner   Address of the new owner
     * @seller      Address of the seller
     * @amount      Sale amount
     * @timestamp   Time of the transaction
     */
    struct History has store, drop, copy {
    }

    // Transfer Reference for NFT
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct PermissionRef has key {
        transfer_ref: TransferRef,
    }

    // Marketplace Funds Structure
    struct MarketplaceFunds has key {
        signer_cap: account::SignerCapability,
    }

    // Marketplace Structure
    struct Marketplace has key {
        nfts: vector<NFT>,
    }

    // Collections Structure
    struct Collections has key {
        collections: vector<Collection>
    }

    /* TODOs 8: Initialize the marketplace
     * - Create a resource account with the provided SEED
     * - Register AptosCoin for the resource account
     * - Initialize Marketplace with empty NFTs vector
     * - Store MarketplaceFunds with signer capability
     * - Initialize Collections with empty collections vector
     */
    fun init_module(account: &signer) {
    }

    /* TODOs 9: Initialize a new collection
     * - Get mutable reference to Collections resource
     * - Create a new Collection struct with provided details
     * - Add collection to collections vector
     * - Create an unlimited collection using aptos_token_objects::collection
     */
    public entry fun initialize_collection(
        creator: &signer,
        name: String,
        description: String,
        uri: String
    ) acquires Collections {
    }

    /* TODOs 9: Mint a new NFT
     * - Get resource account address
     * - Get Collections and mutable Marketplace resources
     * - Check if collection exists; if not, initialize it
     * - Create a named token using aptos_token_objects::token
     * - Generate token signer and transfer reference
     * - Create NFT struct with provided details
     * - Add NFT to marketplace NFTs vector
     * - Store PermissionRef with transfer reference
     */
    public entry fun mint_nft(
        creator: &signer,
        collection_name: String,
        collection_description: option::Option<String>,
        collection_uri: option::Option<String>,
        name: String,
        description: String,
        category: String,
        uri: String
    ) acquires Marketplace, Collections {
    }

    /* TODOs 10: List an NFT for sale
     * - Get mutable Marketplace resource
     * - Verify NFT exists and owner is caller
     * - Ensure NFT is not already listed
     * - Validate sale type (instant or auction)
     * - If auction, validate deadline is in future
     * - Update NFT fields: for_sale, sale_type, price
     * - If auction, initialize Auction struct
     */
    public entry fun list_nft_for_sale(
        owner: &signer,
        nft_id: u64,
        price: u64,
        sale_type: u8,
        auction_deadline: option::Option<u64>
    ) acquires Marketplace {
    }

    /* TODOs 11: Place an offer for an auction
     * - Get mutable Marketplace and MarketplaceFunds resources
     * - Verify NFT exists, is for sale, and is an auction
     * - Check auction hasn't ended if deadline exists
     * - Ensure offer amount is higher than current highest bid and minimum price
     * - Verify bidder has sufficient balance including fee
     * - Get resource account signer
     * - Refund previous highest bidder if exists
     * - Transfer bidder's coins to resource account
     * - Create and store Offer struct
     * - Update auction's highest bid and bidder
     */
    public entry fun place_offer(
        bidder: &signer,
        nft_id: u64,
        amount: u64
    ) acquires Marketplace, MarketplaceFunds {
    }

    /* TODOs 12: Finalize an auction
     * - Get mutable Marketplace, PermissionRef, and MarketplaceFunds resources
     * - Verify NFT exists, owner is caller, is for sale, and is an auction
     * - Check auction has ended if deadline exists
     * - Get resource account signer
     * - If there's a highest bidder:
     *   - Transfer payment to seller
     *   - Transfer NFT to winner
     *   - Update NFT owner
     * - Update NFT: clear sale status, price, auction
     * - Record transaction in history
     */
    public entry fun finalize_auction(
        owner: &signer,
        nft_id: u64
    ) acquires Marketplace, PermissionRef, MarketplaceFunds {
    }

    /* TODOs 13: Purchase an NFT (instant sale)
     * - Get mutable Marketplace, PermissionRef, and MarketplaceFunds resources
     * - Verify NFT exists, is for sale, and is instant sale
     * - Calculate fee and seller amount
     * - Verify buyer has sufficient balance
     * - Get resource account address
     * - Transfer payment to seller and fee to resource account
     * - Transfer NFT to buyer
     * - Update NFT: owner, clear sale status, price, auction
     * - Record transaction in history
     */
    public entry fun purchase_nft(
        buyer: &signer,
        nft_id: u64
    ) acquires Marketplace, PermissionRef, MarketplaceFunds {
    }

    /* TODOs 14: Transfer an NFT
     * - Get mutable Marketplace and PermissionRef resources
     * - Verify NFT exists and owner is caller
     * - Ensure new owner is different
     * - Transfer NFT to new owner
     * - Update NFT: owner, clear sale status, price, auction
     */
    public entry fun transfer_nft(
        owner: &signer,
        nft_id: u64,
        new_owner: address
    ) acquires Marketplace, PermissionRef {
    }

    // Update NFT Metadata
    public entry fun update_nft_metadata(
        creator: &signer,
        nft_id: u64,
        name: String,
        description: String,
        uri: String
    ) acquires Marketplace {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global_mut<Marketplace>(resources_address);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);
        assert!(nft.creator == signer::address_of(creator), E_NOT_AUTHORIZED);
        nft.name = name;
        nft.description = description;
        nft.uri = uri;
    }

    /* TODOs 15: Cancel an NFT listing
     * - Get mutable Marketplace and MarketplaceFunds resources
     * - Verify NFT exists, owner is caller, and is for sale
     * - If auction with a highest bidder:
     *   - Calculate refund amount with cancellation fee
     *   - Get resource account signer
     *   - Transfer refund to bidder
     * - Update NFT: clear sale status, price, auction
     */
    public entry fun cancel_listing(owner: &signer, nft_id: u64) acquires Marketplace, MarketplaceFunds {
    }

    /* TODOs 16: Get all collections by user
     * - Get Collections resource
     * - Iterate through collections within limit and offset
     * - Collect collections created by the specified user
     * - Return vector of matching collections
     */
    #[view]
    public fun get_all_collections_by_user(account: address, limit: u64, offset: u64): vector<Collection> acquires Collections {
    }

    /* TODOs 17: Get all collections
     * - Get Collections resource
     * - Iterate through collections within limit and offset
     * - Collect all collections
     * - Return vector of collections
     */
    #[view]
    public fun get_all_collections(limit: u64, offset: u64): vector<Collection> acquires Collections {
    }

    // View NFT Details
    #[view]
    public fun get_nft_details(nft_id: u64): NFT acquires Marketplace {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global<Marketplace>(resources_address);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow(&marketplace.nfts, nft_id);
        *nft
    }

    /* TODOs 18: Get NFT by collection and token name
     * - Get Marketplace resource
     * - Iterate through NFTs
     * - Find NFT matching collection name, token name, and owner
     * - Return optional NFT if found, none otherwise
     */
    #[view]
    public fun get_nft_by_collection_name_and_token_name(
        collection_name: String,
        token_name: String,
        user_address: address
    ): option::Option<NFT> acquires Marketplace {
    }

    /* TODOs 19: Get NFTs owned by a user
     * - Get Marketplace resource
     * - Iterate through NFTs
     * - Collect NFTs owned by the specified user into a vector
     * - Return vector of matching NFTs
     */
    #[view]
    public fun get_user_nfts(
        owner: address
    ): vector<NFT> acquires Marketplace {
    }

    /* TODOs 20: Get NFTs for sale
     * - Get Marketplace resource
     * - Iterate through NFTs
     * - Collect NFTs that are for sale
     * - Return vector of matching NFTs
     */
    #[view]
    public fun get_nfts_for_sale(): vector<NFT> acquires Marketplace {
    }
}