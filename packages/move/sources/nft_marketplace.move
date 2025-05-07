module marketplace::NFTMarketplace {
    use std::signer;
    use std::vector;
    use 0x1::aptos_coin::{AptosCoin}; // Specific coin type
    use 0x1::coin; // Coin module
    use std::string::{Self, String};
    use std::object::{Self, Object, TransferRef, ConstructorRef};
    use std::option;
    use aptos_token_objects::token::{Self, Token};
    use aptos_token_objects::collection;

    // Constants
    const MARKETPLACE_FEE_PERCENT: u64 = 2; // 2% fee

    // NFT Structure
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct NFT has store, key {
        id: u64,
        owner: address,
        creator: address,
        created_at: u64,
        category: String,
        collection: Object<collection::Collection>,
        name: String,
        description: String,
        uri: String, // Off-chain metadata reference (e.g., IPFS)
        price: u64,
        for_sale: bool,
        token: Object<Token>,
    }

    // Transfer Reference for NFT
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct PermissionRef has key {
        transfer_ref: TransferRef,
    }

    // Marketplace Structure
    struct Marketplace has key {
        nfts: vector<NFT>,
    }

    // Initialize Marketplace (only callable by module deployer)
    public entry fun initialize_marketplace(account: &signer) {
        assert!(signer::address_of(account) == @marketplace, 301);
        move_to(account, Marketplace {
            nfts: vector::empty<NFT>()
        });
    }

    // Mint an NFT
    public entry fun mint_nft(
        creator: &signer,
        collection_name: String,
        name: String,
        description: String,
        uri: String // Off-chain metadata URI (e.g., IPFS link)
    ) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(@marketplace);
        let token_constructor_ref = token::create_named_token(
            creator,
            collection_name,
            description,
            name,
            option::none(), // No royalty for simplicity
            uri,
        );

        let token_signer = object::generate_signer(&token_constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&token_constructor_ref);
        let token_object = object::object_from_constructor_ref<Token>(&token_constructor_ref);

        let nft = NFT {
            id: vector::length(&marketplace.nfts),
            owner: signer::address_of(creator),
            creator: signer::address_of(creator),
            name,
            description,
            uri,
            price: 0,
            for_sale: false,
            token: token_object,
        };

        vector::push_back(&mut marketplace.nfts, nft);
        move_to(&token_signer, PermissionRef { transfer_ref });
    }

    // List NFT for Sale
    public entry fun list_nft_for_sale(
        owner: &signer,
        nft_id: u64,
        price: u64
    ) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(@marketplace);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft.owner == signer::address_of(owner), 100); // Not owner
        assert!(!nft.for_sale, 101); // Already listed
        assert!(price > 0, 102); // Invalid price

        nft.for_sale = true;
        nft.price = price;
    }

    // Purchase NFT with AptosCoin
    public entry fun purchase_nft(
        buyer: &signer,
        nft_id: u64
    ) acquires Marketplace, PermissionRef {
        let marketplace = borrow_global_mut<Marketplace>(@marketplace);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft.for_sale, 200); // Not for sale
        let price = nft.price;
        let fee = (price * MARKETPLACE_FEE_PERCENT) / 100;
        let seller_amount = price - fee;

        // Transfer payment using AptosCoin
        let buyer_addr = signer::address_of(buyer);
        let seller_addr = nft.owner;
        let marketplace_addr = @marketplace;

        // Ensure buyer has enough AptosCoin
        assert!(coin::balance<AptosCoin>(buyer_addr) >= price, 201); // Insufficient balance

        // Transfer coins to seller and marketplace
        coin::transfer<AptosCoin>(buyer, seller_addr, seller_amount);
        coin::transfer<AptosCoin>(buyer, marketplace_addr, fee);

        // Transfer NFT ownership
        let token = nft.token;
        let permission_ref = borrow_global<PermissionRef>(object::object_address(&token));
        let linear_transfer_ref = object::generate_linear_transfer_ref(&permission_ref.transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, buyer_addr);

        // Update NFT state
        nft.owner = buyer_addr;
        nft.for_sale = false;
        nft.price = 0;
    }

    // Transfer NFT to Another Address
    public entry fun transfer_nft(
        owner: &signer,
        nft_id: u64,
        new_owner: address
    ) acquires Marketplace, PermissionRef {
        let marketplace = borrow_global_mut<Marketplace>(@marketplace);
        let nft = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft.owner == signer::address_of(owner), 300); // Not owner
        assert!(nft.owner != new_owner, 301); // Same owner

        let token = nft.token;
        let permission_ref = borrow_global<PermissionRef>(object::object_address(&token));
        let linear_transfer_ref = object::generate_linear_transfer_ref(&permission_ref.transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, new_owner);

        nft.owner = new_owner;
        nft.for_sale = false;
        nft.price = 0;
    }

    // View NFT Details
    #[view]
    public fun get_nft_details(nft_id: u64): (address, String, String, String, u64, bool) acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(@marketplace);
        let nft = vector::borrow(&marketplace.nfts, nft_id);
        (nft.owner, nft.name, nft.description, nft.uri, nft.price, nft.for_sale)
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
}