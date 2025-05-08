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

    // Constants
    const SEED: vector<u8> = b"marketplace_funds";
    const MARKETPLACE_FEE_PERCENT: u64 = 5;
    const CANCEL_FEE_PERCENT: u64 = 45; // 4.5% represented as 45/1000 for precision

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 301;
    const E_NOT_OWNER: u64 = 100;
    const E_ALREADY_LISTED: u64 = 101;
    const E_INVALID_PRICE: u64 = 102;
    const E_NOT_FOR_SALE: u64 = 200;
    const E_INSUFFICIENT_BALANCE: u64 = 201;
    const E_SAME_OWNER: u64 = 302;
    const E_NFT_NOT_FOUND: u64 = 303;
    const E_INVALID_DEADLINE: u64 = 304;
    const E_AUCTION_NOT_ENDED: u64 = 305;
    const E_AUCTION_ENDED: u64 = 306;
    const E_NOT_AUCTION: u64 = 307;
    const E_INVALID_OFFER: u64 = 308;
    const E_INVALID_SALE_TYPE: u64 = 309;
    const E_NO_SIGNER_CAP: u64 = 310;

    // Sale types
    const SALE_TYPE_INSTANT: u8 = 0;
    const SALE_TYPE_AUCTION: u8 = 1;

    // Offer Structure
    struct Offer has store, drop, copy {
        bidder: address,
        amount: u64,
        timestamp: u64,
    }

    // Auction Structure
    struct Auction has store, drop {
        deadline: option::Option<u64>,
        offers: vector<Offer>,
        highest_bid: u64,
        highest_bidder: option::Option<address>,
    }

    // NFT Structure
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct NFT has store, key {
        id: u64,
        owner: address,
        creator: address,
        created_at: u64,
        category: String,
        collection_name: String,
        name: String,
        description: String,
        uri: String,
        price: u64,
        for_sale: bool,
        sale_type: u8,
        auction: option::Option<Auction>,
        token: Object<Token>,
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

    // Initialize Marketplace
    fun init_module(account: &signer) {
        let (resource_signer, signer_cap) = account::create_resource_account(account, SEED);
        coin::register<AptosCoin>(&resource_signer);
        move_to(&resource_signer, Marketplace {
            nfts: vector::empty<NFT>()
        });
        move_to(account, MarketplaceFunds {
            signer_cap
        });
    }

    // Mint an NFT
    public entry fun mint_nft(
        creator: &signer,
        collection_name: String,
        name: String,
        description: String,
        category: String,
        uri: String
    ) acquires Marketplace {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global_mut<Marketplace>(resources_address);
        let token_constructor_ref = token::create_named_token(
            creator,
            collection_name,
            description,
            name,
            option::none(),
            uri,
        );

        let token_signer = object::generate_signer(&token_constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&token_constructor_ref);
        let token_object = object::object_from_constructor_ref<Token>(&token_constructor_ref);

        let nft = NFT {
            id: vector::length(&marketplace.nfts),
            owner: signer::address_of(creator),
            creator: signer::address_of(creator),
            created_at: timestamp::now_seconds(),
            category,
            collection_name,
            name,
            description,
            uri,
            price: 0,
            for_sale: false,
            sale_type: SALE_TYPE_INSTANT,
            auction: option::none(),
            token: token_object,
        };

        vector::push_back(&mut marketplace.nfts, nft);
        move_to(&token_signer, PermissionRef { transfer_ref });
    }

    // List NFT for Sale (Instant or Auction)
    public entry fun list_nft_for_sale(
        owner: &signer,
        nft_id: u64,
        price: u64,
        sale_type: u8,
        auction_deadline: option::Option<u64>
    ) acquires Marketplace {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global_mut<Marketplace>(resources_address);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft.owner == signer::address_of(owner), E_NOT_OWNER);
        assert!(!nft.for_sale, E_ALREADY_LISTED);
        assert!(sale_type == SALE_TYPE_INSTANT || sale_type == SALE_TYPE_AUCTION, E_INVALID_SALE_TYPE);
        if (option::is_some(&auction_deadline)) {
            assert!(*option::borrow(&auction_deadline) > timestamp::now_seconds(), E_INVALID_DEADLINE);
        };

        nft.for_sale = true;
        nft.sale_type = sale_type;
        nft.price = price;

        if (sale_type == SALE_TYPE_AUCTION) {
            nft.auction = option::some(Auction {
                deadline: auction_deadline,
                offers: vector::empty<Offer>(),
                highest_bid: 0,
                highest_bidder: option::none(),
            });
        };
    }

    // Place an Offer for an Auction
    public entry fun place_offer(
        bidder: &signer,
        nft_id: u64,
        amount: u64
    ) acquires Marketplace, MarketplaceFunds {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global_mut<Marketplace>(resources_address);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft.for_sale, E_NOT_FOR_SALE);
        assert!(nft.sale_type == SALE_TYPE_AUCTION, E_NOT_AUCTION);
        let auction = option::borrow_mut(&mut nft.auction);
        if (option::is_some(&auction.deadline)) {
            assert!(timestamp::now_seconds() < *option::borrow(&auction.deadline), E_AUCTION_ENDED);
        };
        assert!(amount > nft.price && amount > auction.highest_bid, E_INVALID_OFFER);

        let amount_to_pay = amount + ((amount * MARKETPLACE_FEE_PERCENT) / 100);

        let bidder_addr = signer::address_of(bidder);
        assert!(coin::balance<AptosCoin>(bidder_addr) >= amount_to_pay, E_INSUFFICIENT_BALANCE);

        // Get resource account
        let funds = borrow_global<MarketplaceFunds>(@marketplace);
        let resource_signer = account::create_signer_with_capability(&funds.signer_cap);
        let resource_addr = account::get_signer_capability_address(&funds.signer_cap);

        // Refund previous highest bidder if exists
        if (option::is_some(&auction.highest_bidder) && *option::borrow(&auction.highest_bidder) != bidder_addr) {
            let previous_bidder = *option::borrow(&auction.highest_bidder);
            let previous_bid = auction.highest_bid;
            let refund_amount = previous_bid + ((previous_bid * CANCEL_FEE_PERCENT) / 100);
            assert!(coin::balance<AptosCoin>(resource_addr) >= refund_amount, E_INSUFFICIENT_BALANCE);
            coin::transfer<AptosCoin>(&resource_signer, previous_bidder, refund_amount);
        };

        // Lock bidder's coins in resource account
        coin::transfer<AptosCoin>(bidder, resource_addr, amount_to_pay);

        let offer = Offer {
            bidder: bidder_addr,
            amount,
            timestamp: timestamp::now_seconds(),
        };
        vector::push_back(&mut auction.offers, offer);

        auction.highest_bid = amount;
        auction.highest_bidder = option::some(bidder_addr);
    }

    // Finalize Auction
    public entry fun finalize_auction(
        owner: &signer,
        nft_id: u64
    ) acquires Marketplace, PermissionRef, MarketplaceFunds {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global_mut<Marketplace>(resources_address);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft.owner == signer::address_of(owner), E_NOT_OWNER);
        assert!(nft.for_sale, E_NOT_FOR_SALE);
        assert!(nft.sale_type == SALE_TYPE_AUCTION, E_NOT_AUCTION);
        let auction = option::borrow(&nft.auction);
        if (option::is_some(&auction.deadline)) {
            assert!(timestamp::now_seconds() >= *option::borrow(&auction.deadline), E_AUCTION_NOT_ENDED);
        };

        let funds = borrow_global<MarketplaceFunds>(@marketplace);
        let resource_signer = account::create_signer_with_capability(&funds.signer_cap);
        let resource_addr = account::get_signer_capability_address(&funds.signer_cap);

        if (option::is_some(&auction.highest_bidder)) {
            let winner = *option::borrow(&auction.highest_bidder);
            let amount = auction.highest_bid;

            // Transfer payment to seller and fee to marketplace
            coin::transfer<AptosCoin>(&resource_signer, nft.owner, amount);

            // Transfer NFT to winner
            let token = nft.token;
            let permission_ref = borrow_global<PermissionRef>(object::object_address(&token));
            let linear_transfer_ref = object::generate_linear_transfer_ref(&permission_ref.transfer_ref);
            object::transfer_with_ref(linear_transfer_ref, winner);

            nft.owner = winner;
        };

        nft.for_sale = false;
        nft.price = 0;
        nft.sale_type = SALE_TYPE_INSTANT;
        nft.auction = option::none();
    }

    // Purchase NFT (Instant Sale Only)
    public entry fun purchase_nft(
        buyer: &signer,
        nft_id: u64
    ) acquires Marketplace, PermissionRef, MarketplaceFunds {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global_mut<Marketplace>(resources_address);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft.for_sale, E_NOT_FOR_SALE);
        assert!(nft.sale_type == SALE_TYPE_INSTANT, E_NOT_AUCTION);
        let price = nft.price;
        let fee = (price * MARKETPLACE_FEE_PERCENT) / 100;
        let seller_amount = price - fee;

        let buyer_addr = signer::address_of(buyer);
        let seller_addr = nft.owner;

        assert!(coin::balance<AptosCoin>(buyer_addr) >= price, E_INSUFFICIENT_BALANCE);

        let funds = borrow_global<MarketplaceFunds>(@marketplace);
        let resource_addr = account::get_signer_capability_address(&funds.signer_cap);

        // Transfer payment to seller and resource account for fee
        coin::transfer<AptosCoin>(buyer, seller_addr, seller_amount);
        coin::transfer<AptosCoin>(buyer, resource_addr, fee);

        // Transfer NFT to buyer
        let token = nft.token;
        let permission_ref = borrow_global<PermissionRef>(object::object_address(&token));
        let linear_transfer_ref = object::generate_linear_transfer_ref(&permission_ref.transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, buyer_addr);

        nft.owner = buyer_addr;
        nft.for_sale = false;
        nft.price = 0;
        nft.sale_type = SALE_TYPE_INSTANT;
        nft.auction = option::none();
    }

    // Transfer NFT
    public entry fun transfer_nft(
        owner: &signer,
        nft_id: u64,
        new_owner: address
    ) acquires Marketplace, PermissionRef {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global_mut<Marketplace>(resources_address);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft.owner == signer::address_of(owner), E_NOT_OWNER);
        assert!(nft.owner != new_owner, E_SAME_OWNER);

        let token = nft.token;
        let permission_ref = borrow_global<PermissionRef>(object::object_address(&token));
        let linear_transfer_ref = object::generate_linear_transfer_ref(&permission_ref.transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, new_owner);

        nft.owner = new_owner;
        nft.for_sale = false;
        nft.price = 0;
        nft.sale_type = SALE_TYPE_INSTANT;
        nft.auction = option::none();
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

    // Cancel Listing
    public entry fun cancel_listing(owner: &signer, nft_id: u64) acquires Marketplace, MarketplaceFunds {
        let resources_address = account::create_resource_address(&@marketplace, SEED);
        let marketplace = borrow_global_mut<Marketplace>(resources_address);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);
        assert!(nft.owner == signer::address_of(owner), E_NOT_OWNER);
        assert!(nft.for_sale, E_NOT_FOR_SALE);

        // If auction, refund the highest bidder with 4.5% fee
        if (nft.sale_type == SALE_TYPE_AUCTION && option::is_some(&nft.auction)) {
            let auction = option::borrow(&nft.auction);
            if (option::is_some(&auction.highest_bidder)) {
                let bidder = *option::borrow(&auction.highest_bidder);
                let bid_amount = auction.highest_bid;
                let refund_fee = (bid_amount * CANCEL_FEE_PERCENT) / 1000; // 4.5% fee
                let refund_amount = bid_amount + refund_fee;

                let funds = borrow_global<MarketplaceFunds>(@marketplace);
                let resource_signer = account::create_signer_with_capability(&funds.signer_cap);
                let resource_addr = account::get_signer_capability_address(&funds.signer_cap);

                assert!(coin::balance<AptosCoin>(resource_addr) >= refund_amount, E_INSUFFICIENT_BALANCE);
                coin::transfer<AptosCoin>(&resource_signer, bidder, refund_amount);
            };
        };

        nft.for_sale = false;
        nft.price = 0;
        nft.sale_type = SALE_TYPE_INSTANT;
        nft.auction = option::none();
    }

    // View NFT Details
    #[view]
    public fun get_nft_details(nft_id: u64): (address, String, String, String, u64, bool, u8, option::Option<u64>, u64, vector<Offer>) acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(@marketplace);
        assert!(nft_id < vector::length(&marketplace.nfts), E_NFT_NOT_FOUND);
        let nft = vector::borrow(&marketplace.nfts, nft_id);
        let (deadline, highest_bid, offers) = if (option::is_some(&nft.auction)) {
            let auction = option::borrow(&nft.auction);
            (auction.deadline, auction.highest_bid, auction.offers)
        } else {
            (option::none(), 0, vector::empty<Offer>())
        };
        (nft.owner, nft.name, nft.description, nft.uri, nft.price, nft.for_sale, nft.sale_type, deadline, highest_bid, offers)
    }

    // View NFTs for Sale
    #[view]
    public fun get_nfts_for_sale(): vector<u64> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(@marketplace);
        let result = vector::empty<u64>();
        let i = 0;
        while (i < vector::length(&marketplace.nfts)) {
            let nft = vector::borrow(&marketplace.nfts, i);
            if (nft.for_sale) {
                vector::push_back(&mut result, nft.id);
            };
            i = i + 1;
        };
        result
    }

    // View NFTs Owned by a User
    #[view]
    public fun get_user_nfts(owner: address): vector<u64> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(@marketplace);
        let result = vector::empty<u64>();
        let i = 0;
        while (i < vector::length(&marketplace.nfts)) {
            let nft = vector::borrow(&marketplace.nfts, i);
            if (nft.owner == owner) {
                vector::push_back(&mut result, nft.id);
            };
            i = i + 1;
        };
        result
    }
}