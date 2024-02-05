module aptogotchi::main {
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::timestamp;
    use aptos_framework::object::ExtendRef;
    use aptos_framework::randomness;
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
    /// name length exceeded limit
    const ENAME_LIMIT: u64 = 2;
    /// user already has aptogotchi
    const EUSER_ALREADY_HAS_APTOGOTCHI: u64 = 3;
    /// invalid body value
    const EBODY_VALUE_INVALID: u64 = 4;
    /// invalid ear value
    const EEAR_VALUE_INVALID: u64 = 5;
    /// invalid face value
    const EFACE_VALUE_INVALID: u64 = 6;

    // maximum health points: 5 hearts * 2 HP/heart = 10 HP
    const ENERGY_UPPER_BOUND: u64 = 10;
    const NAME_UPPER_BOUND: u64 = 40;


    struct AptogotchiParts has copy, drop, key, store {
        body: u8,
        ear: u8,
        face: u8,
    }

    struct Aptogotchi has key {
        name: String,
        birthday: u64,
        energy_points: u64,
        parts: AptogotchiParts,
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
    }

    struct MintAptogotchiEvents has key {
        mint_aptogotchi_events: event::EventHandle<MintAptogotchiEvent>,
    }

    struct MintAptogotchiEvent has drop, store {
        token_name: String,
        aptogotchi_name: String,
        parts: AptogotchiParts,
    }

    // Tokens require a signer to create, so this is the signer for the collection
    struct CollectionCapability has key {
        extend_ref: ExtendRef,
    }

    const APP_OBJECT_SEED: vector<u8> = b"APTOGOTCHI";
    const APTOGOTCHI_COLLECTION_NAME: vector<u8> = b"Aptogotchi Collection";
    const APTOGOTCHI_COLLECTION_DESCRIPTION: vector<u8> = b"Aptogotchi Collection Description";
    const APTOGOTCHI_COLLECTION_URI: vector<u8> = b"https://otjbxblyfunmfblzdegw.supabase.co/storage/v1/object/public/aptogotchi/aptogotchi.png";
    // Body value range is [0, 4] inslusive
    const BODY_MAX_VALUE: u8 = 4;
    // Ear value range is [0, 5] inslusive
    const EAR_MAX_VALUE: u8 = 6;
    // Face value range is [0, 3] inslusive
    const FACE_MAX_VALUE: u8 = 3;


    // This function is only called once when the module is published for the first time.
    fun init_module(account: &signer) {
        let constructor_ref = object::create_named_object(
            account,
            APP_OBJECT_SEED,
        );
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let app_signer = &object::generate_signer(&constructor_ref);

        move_to(account, MintAptogotchiEvents {
            mint_aptogotchi_events: account::new_event_handle<MintAptogotchiEvent>(account),
        });

        move_to(app_signer, CollectionCapability {
            extend_ref,
        });

        create_aptogotchi_collection(app_signer);
    }

    fun get_app_signer_addr(): address {
        object::create_object_address(&@aptogotchi, APP_OBJECT_SEED)
    }

    fun get_app_signer(): signer acquires CollectionCapability {
        object::generate_signer_for_extending(&borrow_global<CollectionCapability>(get_app_signer_addr()).extend_ref)
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
    // Because this function calls random it must not be public so user can only call it from a transaction instead of another contract.
    // This prevents users seeing the result of random and act on it, e.g. see the mint result and abort if they don't like it.
    entry fun create_aptogotchi(
        user: &signer,
        name: String,
    ) acquires CollectionCapability, MintAptogotchiEvents {
        assert!(string::length(&name) <= NAME_UPPER_BOUND, error::invalid_argument(ENAME_LIMIT));
        let body = randomness::u8_range(0, BODY_MAX_VALUE + 1);
        let ear = randomness::u8_range(0, EAR_MAX_VALUE + 1);
        let face = randomness::u8_range(0, FACE_MAX_VALUE + 1);

        let uri = string::utf8(APTOGOTCHI_COLLECTION_URI);
        let description = string::utf8(APTOGOTCHI_COLLECTION_DESCRIPTION);
        let user_addr = address_of(user);
        let token_name = to_string(&user_addr);
        let parts = AptogotchiParts {
            body,
            ear,
            face,
        };
        assert!(!has_aptogotchi(user_addr), error::already_exists(EUSER_ALREADY_HAS_APTOGOTCHI));

        let constructor_ref = token::create_named_token(
            &get_app_signer(),
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
        let gotchi = Aptogotchi {
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
                token_name,
                aptogotchi_name: name,
                parts,
            },
        );

        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), address_of(user));
    }

    // Sets aptogotchi's name
    public entry fun set_name(owner: signer, name: String) acquires Aptogotchi {
        let owner_addr = signer::address_of(&owner);
        assert!(has_aptogotchi(owner_addr), error::unavailable(ENOT_AVAILABLE));
        assert!(string::length(&name) <= NAME_UPPER_BOUND, error::invalid_argument(ENAME_LIMIT));
        let token_address = get_aptogotchi_address(owner_addr);
        let gotchi = borrow_global_mut<Aptogotchi>(token_address);
        gotchi.name = name;
    }

    // Feeds aptogotchi to increase its energy points
    public entry fun feed(owner: &signer, points: u64) acquires Aptogotchi {
        let owner_addr = signer::address_of(owner);
        assert!(has_aptogotchi(owner_addr), error::unavailable(ENOT_AVAILABLE));
        let token_address = get_aptogotchi_address(owner_addr);
        let gotchi = borrow_global_mut<Aptogotchi>(token_address);

        gotchi.energy_points = if (gotchi.energy_points + points > ENERGY_UPPER_BOUND) {
            ENERGY_UPPER_BOUND
        } else {
            gotchi.energy_points + points
        };
    }

    // Plays with aptogotchi to consume its energy points
    public entry fun play(owner: &signer, points: u64) acquires Aptogotchi {
        let owner_addr = signer::address_of(owner);
        assert!(has_aptogotchi(owner_addr), error::unavailable(ENOT_AVAILABLE));
        let token_address = get_aptogotchi_address(owner_addr);
        let gotchi = borrow_global_mut<Aptogotchi>(token_address);

        gotchi.energy_points = if (gotchi.energy_points < points) {
            0
        } else {
            gotchi.energy_points - points
        };
    }

    // Sets Aptogotchi's parts
    public entry fun set_parts(owner: &signer, body: u8, ear: u8, face: u8) acquires Aptogotchi {
        let owner_addr = signer::address_of(owner);
        assert!(has_aptogotchi(owner_addr), error::unavailable(ENOT_AVAILABLE));
        let token_address = get_aptogotchi_address(owner_addr);
        let gotchi = borrow_global_mut<Aptogotchi>(token_address);
        gotchi.parts.body = body;
        gotchi.parts.ear = ear;
        gotchi.parts.face = face;
    }

    // Get reference to Aptogotchi token object (CAN'T modify the reference)
    #[view]
    fun get_aptogotchi_address(creator_addr: address): (address) {
        let collection = string::utf8(APTOGOTCHI_COLLECTION_NAME);
        let token_name = to_string(&creator_addr);
        let creator_addr = get_app_signer_addr();
        let token_address = token::create_token_address(
            &creator_addr,
            &collection,
            &token_name,
        );

        token_address
    }

    // Get collection ID of aptogotchi collection
    #[view]
    public fun get_aptogotchi_collection_id(): (address) {
        let collection_name = string::utf8(APTOGOTCHI_COLLECTION_NAME);
        let creator_addr = get_app_signer_addr();
        collection::create_collection_address(&creator_addr, &collection_name)
    }

    // Returns true if this address owns an Aptogotchi
    #[view]
    public fun has_aptogotchi(owner_addr: address): (bool) {
        let token_address = get_aptogotchi_address(owner_addr);
        let has_gotchi = exists<Aptogotchi>(token_address);

        has_gotchi
    }

    // Returns all fields for this Aptogotchi (if found)
    #[view]
    public fun get_aptogotchi(
        owner_addr: address
    ): (String, u64, u64, AptogotchiParts) acquires Aptogotchi {
        // if this address doesn't have an Aptogotchi, throw error
        assert!(has_aptogotchi(owner_addr), error::unavailable(ENOT_AVAILABLE));

        let token_address = get_aptogotchi_address(owner_addr);
        let gotchi = borrow_global<Aptogotchi>(token_address);

        // view function can only return primitive types.
        (gotchi.name, gotchi.birthday, gotchi.energy_points, gotchi.parts)
    }

    // ==== TESTS ====
    // Setup testing environment
    #[test_only]
    use aptos_framework::account::create_account_for_test;
    #[test_only]
    use std::string::utf8;
    #[test_only]
    use aptos_std::crypto_algebra::enable_cryptography_algebra_natives;

    #[test_only]
    fun setup_test(
        aptos: &signer,
        fx: &signer,
        account: &signer,
        creator: &signer,
    ) {
        enable_cryptography_algebra_natives(fx);
        randomness::initialize_for_testing(fx);
        randomness::set_seed(x"0000000000000000000000000000000000000000000000000000000000000000");

        // create a fake account (only for testing purposes)
        create_account_for_test(signer::address_of(creator));
        create_account_for_test(signer::address_of(account));

        timestamp::set_time_has_started_for_testing(aptos);
        init_module(account);
    }

    // Test creating an Aptogotchi
    #[test(
        aptos = @0x1,
        fx = @aptos_framework,
        account = @aptogotchi,
        creator = @0x123
    )]
    fun test_create_aptogotchi(
        aptos: &signer,
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, MintAptogotchiEvents {
        setup_test(aptos, fx, account, creator);

        create_aptogotchi(creator, utf8(b"test"));

        let has_aptogotchi = has_aptogotchi(signer::address_of(creator));
        assert!(has_aptogotchi, 1);
    }

    // Test getting an Aptogotchi, when user has not minted
    #[test(
        aptos = @0x1,
        fx = @aptos_framework,
        account = @aptogotchi,
        creator = @0x123
    )]
    #[expected_failure(abort_code = 851969, location = aptogotchi::main)]
    fun test_get_aptogotchi_without_creation(
        aptos: &signer,
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires Aptogotchi {
        setup_test(aptos, fx, account, creator);

        // get aptogotchi without creating it
        get_aptogotchi(signer::address_of(creator));
    }

    // Test getting an Aptogotchi, when user has not minted
    #[test(
        aptos = @0x1,
        fx = @aptos_framework,
        account = @aptogotchi,
        creator = @0x123
    )]
    fun test_feed_and_play(
        aptos: &signer,
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, MintAptogotchiEvents, Aptogotchi {
        setup_test(aptos, fx, account, creator);
        let creator_address = signer::address_of(creator);
        create_aptogotchi(creator, utf8(b"test"));

        let (_, _, energe_point_1, _) = get_aptogotchi(creator_address);
        assert!(energe_point_1 == ENERGY_UPPER_BOUND, 1);

        play(creator, 5);
        let (_, _, energe_point_2, _) = get_aptogotchi(creator_address);
        assert!(energe_point_2 == ENERGY_UPPER_BOUND - 5, 1);

        feed(creator, 3);
        let (_, _, energe_point_3, _) = get_aptogotchi(creator_address);
        assert!(energe_point_3 == ENERGY_UPPER_BOUND - 2, 1);
    }

    // Test getting an Aptogotchi, when user has not minted
    #[test(
        aptos = @0x1,
        fx = @aptos_framework,
        account = @aptogotchi,
        creator = @0x123
    )]
    #[expected_failure(abort_code = 524291, location = aptogotchi::main)]
    fun test_create_aptogotchi_twice(
        aptos: &signer,
        fx: &signer,
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, MintAptogotchiEvents {
        setup_test(aptos, fx, account, creator);

        create_aptogotchi(creator, utf8(b"test"));
        create_aptogotchi(creator, utf8(b"test"));
    }
}
