module aptogotchi::main{
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
    use std::string::{Self, String};

    /// name length exceeded limit
    const ENAME_LIMIT: u64 = 1;

    const APP_OBJECT_SEED: vector<u8> = b"APTOGOTCHI";
    const APTOGOTCHI_COLLECTION_NAME: vector<u8> = b"Aptogotchi Collection";
    const APTOGOTCHI_COLLECTION_DESCRIPTION: vector<u8> = b"Aptogotchi Collection Description";
    const APTOGOTCHI_COLLECTION_URI: vector<u8> = b"https://otjbxblyfunmfblzdegw.supabase.co/storage/v1/object/public/aptogotchi/aptogotchi.png";

    // Body value range is [0, 5)
    const BODY_MAX_VALUE_EXCL: u8 = 5;
    // Ear value range is [0, 6)
    const EAR_MAX_VALUE_EXCL: u8 = 6;
    // Face value range is [0, 4)
    const FACE_MAX_VALUE_EXCL: u8 = 4;
    // maximum length of name
    const NAME_UPPER_BOUND: u64 = 40;

    struct AptogotchiParts has copy, drop, key, store {
        body: u8,
        ear: u8,
        face: u8,
    }

    struct Aptogotchi has key {
        name: String,
        birthday: u64,
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

    // Create an Aptogotchi token object.
    // Because this function calls random it must not be public.
    // This ensures user can only call it from a transaction instead of another contract.
    // This prevents users seeing the result of mint and act on it, e.g. see the result and abort the tx if they don't like it.
    entry fun create_aptogotchi(
        user: &signer,
        name: String,
    ) acquires CollectionCapability, MintAptogotchiEvents {
        assert!(string::length(&name) <= NAME_UPPER_BOUND, error::invalid_argument(ENAME_LIMIT));
        let body = randomness::u8_range(0, BODY_MAX_VALUE_EXCL);
        let ear = randomness::u8_range(0, EAR_MAX_VALUE_EXCL);
        let face = randomness::u8_range(0, FACE_MAX_VALUE_EXCL);

        let uri = string::utf8(APTOGOTCHI_COLLECTION_URI);
        let description = string::utf8(APTOGOTCHI_COLLECTION_DESCRIPTION);
        let user_addr = address_of(user);
        let token_name = to_string(&user_addr);
        let parts = AptogotchiParts {
            body,
            ear,
            face,
        };

        let constructor_ref = &token::create(
            &get_app_signer(),
            string::utf8(APTOGOTCHI_COLLECTION_NAME),
            description,
            token_name,
            option::none(),
            uri,
        );

        let token_signer = object::generate_signer(constructor_ref);
        let mutator_ref = token::generate_mutator_ref(constructor_ref);
        let burn_ref = token::generate_burn_ref(constructor_ref);
        let transfer_ref = object::generate_transfer_ref(constructor_ref);

        // initialize/set default Aptogotchi struct values
        let gotchi = Aptogotchi {
            name,
            birthday: timestamp::now_seconds(),
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

    // Get collection name of aptogotchi collection
    #[view]
    public fun get_aptogotchi_collection_name(): (String) {
        string::utf8(APTOGOTCHI_COLLECTION_NAME)
    }

    // Get creator address of aptogotchi collection
    #[view]
    public fun get_aptogotchi_collection_creator_address(): (address) {
        get_app_signer_addr()
    }

    // Get collection ID of aptogotchi collection
    #[view]
    public fun get_aptogotchi_collection_address(): (address) {
        let collection_name = string::utf8(APTOGOTCHI_COLLECTION_NAME);
        let creator_addr = get_app_signer_addr();
        collection::create_collection_address(&creator_addr, &collection_name)
    }

    // Returns all fields for this Aptogotchi (if found)
    #[view]
    public fun get_aptogotchi(
        aptogotchi_addr: address
    ): (String, u64, AptogotchiParts) acquires Aptogotchi {
        let gotchi = borrow_global<Aptogotchi>(aptogotchi_addr);
        (gotchi.name, gotchi.birthday, gotchi.parts)
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
        create_account_for_test(address_of(creator));
        create_account_for_test(address_of(account));

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
    }
}
