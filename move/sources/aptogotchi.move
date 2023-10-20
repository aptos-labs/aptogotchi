module aptogotchi::main {
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::timestamp;
    use aptos_std::string_utils::{to_string};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use std::error;
    use std::option;
    use std::signer::address_of;
    use std::signer;
    use std::string::{Self, String};

    /// aptogotchi not available
    const ENOT_AVAILABLE: u64 = 1;
    // maximum health points: 5 hearts * 2 HP/heart = 10 HP
    const ENERGY_UPPER_BOUND: u64 = 10;

    struct MintAptogotchiEvents has key {
        mint_aptogotchi_events: event::EventHandle<MintAptogotchiEvent>,
    }

    struct MintAptogotchiEvent has drop, store {
        aptogotchi_name: String,
        parts: vector<u8>,
    }

    struct AptoGotchi has key {
        name: String,
        birthday: u64,
        energy_points: u64,
        parts: vector<u8>,
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
    }

    // Tokens require a signer to create, so this is the signer for the collection
    struct CollectionCapability has key, drop {
        capability: SignerCapability,
        burn_signer_capability: SignerCapability,
    }

    const APP_SIGNER_CAPABILITY_SEED: vector<u8> = b"APP_SIGNER_CAPABILITY";
    const BURN_SIGNER_CAPABILITY_SEED: vector<u8> = b"BURN_SIGNER_CAPABILITY";
    const APTOGOTCHI_COLLECTION_NAME: vector<u8> = b"Aptogotchi Collection";
    const APTOGOTCHI_COLLECTION_DESCRIPTION: vector<u8> = b"Aptogotchi Collection Description";
    const APTOGOTCHI_COLLECTION_URI: vector<u8> = b"https://otjbxblyfunmfblzdegw.supabase.co/storage/v1/object/public/aptogotchi/aptogotchi.png";

    // This function is only callable during publishing
    fun init_module(account: &signer) {
        let (token_resource, token_signer_cap) = account::create_resource_account(
            account,
            APP_SIGNER_CAPABILITY_SEED,
        );
        let (_, burn_signer_capability) = account::create_resource_account(
            account,
            BURN_SIGNER_CAPABILITY_SEED,
        );

        move_to(account, CollectionCapability {
            capability: token_signer_cap,
            burn_signer_capability,
        });

        move_to(account, MintAptogotchiEvents {
            mint_aptogotchi_events: account::new_event_handle<MintAptogotchiEvent>(account),
        });

        create_aptogotchi_collection(&token_resource);
    }

    // 
    fun get_token_signer(): signer acquires CollectionCapability {
        account::create_signer_with_capability(&borrow_global<CollectionCapability>(@aptogotchi).capability)
    }

    // Create the collection that will hold all the Aptogotchis
    fun create_aptogotchi_collection(creator: &signer) {
        let description = string::utf8(APTOGOTCHI_COLLECTION_DESCRIPTION);
        let name = string::utf8(APTOGOTCHI_COLLECTION_NAME);
        let uri = string::utf8(APTOGOTCHI_COLLECTION_URI);

        collection::create_unlimited_collection(
            creator,
            description,
            name,
            option::none(),
            uri,
        );
    }

    // Create an Aptogotchi token object
    public entry fun create_aptogotchi(
        user: &signer,
        name: String,
        parts: vector<u8>
    ) acquires CollectionCapability, MintAptogotchiEvents {
        let uri = string::utf8(APTOGOTCHI_COLLECTION_URI);
        let description = string::utf8(APTOGOTCHI_COLLECTION_DESCRIPTION);
        let token_name = to_string(&address_of(user));

        let constructor_ref = token::create_named_token(
            &get_token_signer(),
            string::utf8(APTOGOTCHI_COLLECTION_NAME),
            description,
            token_name,
            option::none(),
            uri,
        );

        let token_signer = object::generate_signer(&constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);
        let burn_ref = token::generate_burn_ref(&constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);

        // initialize/set default Aptogotchi struct values
        let gotchi = AptoGotchi {
            name,
            birthday: timestamp::now_seconds(),
            energy_points: ENERGY_UPPER_BOUND,
            parts,
            mutator_ref,
            burn_ref,
        };

        move_to(&token_signer, gotchi);

        // Emit event for minting Aptogotchi token
        event::emit_event<MintAptogotchiEvent>(
            &mut borrow_global_mut<MintAptogotchiEvents>(@aptogotchi).mint_aptogotchi_events,
            MintAptogotchiEvent {
                aptogotchi_name: name,
                parts,
            },
        );

        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), address_of(user));
    }

    // Get reference to Aptogotchi token object (CAN'T modify the reference)
    fun get_aptogotchi_address(creator_addr: &address): (address) acquires CollectionCapability {
        let collection = string::utf8(APTOGOTCHI_COLLECTION_NAME);
        let token_name = to_string(creator_addr);
        let creator = &get_token_signer();
        let token_address = token::create_token_address(
            &signer::address_of(creator),
            &collection,
            &token_name,
        );

        token_address
    }

    // Get collection ID of aptogotchi collection
    #[view]
    public fun get_aptogotchi_collection_id(): (address) acquires CollectionCapability {
        let collection_name = string::utf8(APTOGOTCHI_COLLECTION_NAME);
        let creator = &get_token_signer();
        let creator_addr = signer::address_of(creator);
        collection::create_collection_address(&creator_addr, &collection_name)
    }

    // Returns true if this address owns an Aptogotchi
    #[view]
    public fun has_aptogotchi(owner_addr: address): (bool) acquires CollectionCapability {
        let token_address = get_aptogotchi_address(&owner_addr);
        let has_gotchi = exists<AptoGotchi>(token_address);

        has_gotchi
    }

    // Returns all fields for this Aptogotchi (if found)
    #[view]
    public fun get_aptogotchi(
        owner_addr: address
    ): (String, u64, u64, vector<u8>) acquires AptoGotchi, CollectionCapability {
        // if this address doesn't have an Aptogotchi, throw error
        if (has_aptogotchi(owner_addr) == false) {
            assert!(false, error::unavailable(ENOT_AVAILABLE));
        };

        let token_address = get_aptogotchi_address(&owner_addr);
        let gotchi = borrow_global_mut<AptoGotchi>(token_address);

        // view function can only return primitive types.
        (gotchi.name, gotchi.birthday, gotchi.energy_points, gotchi.parts)
    }

    // Returns Aptogotchi's name
    #[view]
    public fun get_name(owner_addr: address): String acquires AptoGotchi, CollectionCapability {
        let token_address = get_aptogotchi_address(&owner_addr);
        let gotchi = borrow_global<AptoGotchi>(token_address);

        gotchi.name
    }

    // Sets Aptogotchi's name
    public entry fun set_name(owner: signer, name: String) acquires AptoGotchi, CollectionCapability {
        let owner_addr = signer::address_of(&owner);
        let token_address = get_aptogotchi_address(&owner_addr);
        let gotchi = borrow_global_mut<AptoGotchi>(token_address);
        gotchi.name = name;

        gotchi.name;
    }

    #[view]
    public fun get_energy_points(owner_addr: address): u64 acquires AptoGotchi, CollectionCapability {
        if (has_aptogotchi(owner_addr) == false) {
            assert!(false, error::unavailable(ENOT_AVAILABLE));
        };

        let token_address = get_aptogotchi_address(&owner_addr);
        let gotchi = borrow_global<AptoGotchi>(token_address);

        gotchi.energy_points
    }

    public entry fun feed(owner: &signer, points: u64) acquires AptoGotchi, CollectionCapability {
        let owner_addr = signer::address_of(owner);
        let token_address = get_aptogotchi_address(&owner_addr);
        let gotchi = borrow_global_mut<AptoGotchi>(token_address);

        gotchi.energy_points = if (gotchi.energy_points + points > ENERGY_UPPER_BOUND) {
            ENERGY_UPPER_BOUND
        } else {
            gotchi.energy_points + points
        };

        gotchi.energy_points;
    }

    public entry fun play(owner: &signer, points: u64) acquires AptoGotchi, CollectionCapability {
        let owner_addr = signer::address_of(owner);
        let token_address = get_aptogotchi_address(&owner_addr);
        let gotchi = borrow_global_mut<AptoGotchi>(token_address);

        gotchi.energy_points = if (gotchi.energy_points < points) {
            0
        } else {
            gotchi.energy_points - points
        };

        gotchi.energy_points;
    }

    // Returns Aptogotchi's body parts
    #[view]
    public fun get_parts(owner_addr: address): vector<u8> acquires AptoGotchi, CollectionCapability {
        if (has_aptogotchi(owner_addr) == false) {
            assert!(false, error::unavailable(ENOT_AVAILABLE));
        };

        let token_address = get_aptogotchi_address(&owner_addr);
        let gotchi = borrow_global<AptoGotchi>(token_address);

        gotchi.parts
    }

    // Sets Aptogotchi's body parts
    public entry fun set_parts(owner: &signer, parts: vector<u8>) acquires AptoGotchi, CollectionCapability {
        let owner_addr = signer::address_of(owner);
        let token_address = get_aptogotchi_address(&owner_addr);
        let gotchi = borrow_global_mut<AptoGotchi>(token_address);
        gotchi.parts = parts;

        gotchi.parts;
    }

    // ==== TESTS ====
    // Setup testing environment
    #[test_only]
    use aptos_framework::account::create_account_for_test;
    #[test_only]
    use std::string::utf8;

    #[test_only]
    fun setup_test(aptos: &signer, account: &signer, creator: &signer) {
        // create a fake account (only for testing purposes)
        create_account_for_test(signer::address_of(creator));
        create_account_for_test(signer::address_of(account));

        timestamp::set_time_has_started_for_testing(aptos);
        init_module(account);
    }

    // Test creating an Aptogotchi
    #[test(aptos = @0x1, account = @aptogotchi, creator = @0x123)]
    fun test_create_aptogotchi(
        aptos: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, MintAptogotchiEvents {
        setup_test(aptos, account, creator);

        create_aptogotchi(creator, utf8(b"test"), vector[1, 1, 1, 1]);

        let has_aptogotchi = has_aptogotchi(signer::address_of(creator));
        assert!(has_aptogotchi, 1);
    }

    // Test getting an Aptogotchi, when user has not minted
    #[test(aptos = @0x1, account = @aptogotchi, creator = @0x123)]
    #[expected_failure(abort_code = 851969, location = aptogotchi::main)]
    fun test_get_aptogotchi_without_creation(
        aptos: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, AptoGotchi {
        setup_test(aptos, account, creator);

        // get aptogotchi without creating it
        get_aptogotchi(signer::address_of(creator));
    }

    // Test getting an Aptogotchi, when user has not minted
    #[test(aptos = @0x1, account = @aptogotchi, creator = @0x123)]
    fun test_feed_and_play(
        aptos: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, MintAptogotchiEvents, AptoGotchi {
        setup_test(aptos, account, creator);

        create_aptogotchi(creator, utf8(b"test"), vector[1, 1, 1, 1]);
        assert!(get_energy_points(signer::address_of(creator)) == ENERGY_UPPER_BOUND, 1);

        play(creator, 5);
        assert!(get_energy_points(signer::address_of(creator)) == ENERGY_UPPER_BOUND - 5, 1);

        feed(creator, 3);
        assert!(get_energy_points(signer::address_of(creator)) == ENERGY_UPPER_BOUND - 2, 1);
    }
}