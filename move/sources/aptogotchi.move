module aptogotchi::main {
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::object::{Self, ExtendRef, object_exists};
    use aptos_std::string_utils::{to_string};
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Self, Token};
    use std::error;
    use std::option;
    use std::signer::address_of;
    use std::string::{Self, String};

    /// aptogotchi not available
    const ENOT_AVAILABLE: u64 = 1;
    /// user already has aptogotchi
    const EUSER_ALREADY_HAS_APTOGOTCHI: u64 = 3;

    struct MintAptogotchiEvents has key {
        mint_aptogotchi_events: event::EventHandle<MintAptogotchiEvent>,
    }

    struct MintAptogotchiEvent has drop, store {
        token_name: String,
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
        let collection_signer = &object::generate_signer(&constructor_ref);

        move_to(account, MintAptogotchiEvents {
            mint_aptogotchi_events: account::new_event_handle<MintAptogotchiEvent>(account),
        });

        move_to(collection_signer, CollectionCapability {
            extend_ref,
        });

        create_aptogotchi_collection(collection_signer);
    }

    // Collection signer is the signer holds the collection object
    // This is different from token signer of each Aptogotchi NFT token
    // Each Aptogotchi token has its own signer which controls the token object
    // Since each object has its own address, i.e. each Aptogotchi token has its own address
    // Technically you can store all Aptogotchi tokens under the collection object because object can own objects
    // But in this code we store each Aptogotchi token under the user creating it, see L129
    fun get_collection_signer_addr(): address {
        object::create_object_address(&@aptogotchi, APP_OBJECT_SEED)
    }

    fun get_collection_signer(): signer acquires CollectionCapability {
        object::generate_signer_for_extending(
            &borrow_global<CollectionCapability>(get_collection_signer_addr()).extend_ref
        )
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
    ) acquires CollectionCapability, MintAptogotchiEvents {
        let user_addr = address_of(user);
        assert!(!has_aptogotchi(user_addr), error::already_exists(EUSER_ALREADY_HAS_APTOGOTCHI));
        // We use creator address as token name, so when we check if a user has an Aptogotchi later
        // We can easily construct the token address, token_addr = create_token_address(creator_addr, collection, token_name)
        let token_name = to_string(&user_addr);

        // In practice you probably want each token to have its own URI and description
        // URI is usually collection_uri/token_name
        // Description is usually collection_description + token_name
        let token_uri = string::utf8(APTOGOTCHI_COLLECTION_URI);
        string::append_utf8(&mut token_uri, b"/");
        string::append(&mut token_uri, token_name);
        let token_description = string::utf8(APTOGOTCHI_COLLECTION_DESCRIPTION);
        string::append_utf8(&mut token_description, b"/");
        string::append(&mut token_description, token_name);

        let constructor_ref = token::create_named_token(
            &get_collection_signer(),
            string::utf8(APTOGOTCHI_COLLECTION_NAME),
            token_description,
            token_name,
            option::none(),
            token_uri,
        );

        let transfer_ref = object::generate_transfer_ref(&constructor_ref);

        // Emit event for minting Aptogotchi token
        event::emit_event<MintAptogotchiEvent>(
            &mut borrow_global_mut<MintAptogotchiEvents>(@aptogotchi).mint_aptogotchi_events,
            MintAptogotchiEvent {
                token_name,
            },
        );

        // Transfer the token to the user
        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), address_of(user));
    }

    // Get collection ID of aptogotchi collection
    #[view]
    public fun get_aptogotchi_collection_id(): (address) {
        let collection_name = string::utf8(APTOGOTCHI_COLLECTION_NAME);
        let creator_addr = get_collection_signer_addr();
        collection::create_collection_address(&creator_addr, &collection_name)
    }

    // Get reference to Aptogotchi token object (CAN'T modify the reference)
    #[view]
    public fun get_aptogotchi_address(creator_addr: address): (address) {
        let collection = string::utf8(APTOGOTCHI_COLLECTION_NAME);
        let token_name = to_string(&creator_addr);
        let creator_addr = get_collection_signer_addr();
        let token_address = token::create_token_address(
            &creator_addr,
            &collection,
            &token_name,
        );
        token_address
    }

    // Returns true if this address owns an Aptogotchi
    #[view]
    public fun has_aptogotchi(owner_addr: address): (bool) {
        let token_address = get_aptogotchi_address(owner_addr);
        let has_gotchi = object_exists<Token>(token_address);
        has_gotchi
    }

    // Returns all fields for this Aptogotchi NFT token
    #[view]
    public fun get_aptogotchi(
        owner_addr: address
    ): (String, String, String) {
        // if this address doesn't have an Aptogotchi, throw error
        assert!(has_aptogotchi(owner_addr), error::unavailable(ENOT_AVAILABLE));

        let token_address = get_aptogotchi_address(owner_addr);
        let token_obj = object::address_to_object<Token>(token_address);
        let uri = token::uri(token_obj);
        let name = token::name(token_obj);
        let description = token::description(token_obj);

        (name, description, uri)
    }

    // ==== TESTS ====
    // Setup testing environment
    #[test_only]
    use aptos_framework::account::create_account_for_test;
    #[test_only]
    use aptos_std::debug;

    #[test_only]
    fun setup_test(account: &signer, creator: &signer) {
        // create a fake account (only for testing purposes)
        create_account_for_test(address_of(creator));
        create_account_for_test(address_of(account));

        init_module(account);
    }

    // Test creating an Aptogotchi
    #[test(account = @aptogotchi, creator = @0x123)]
    fun test_create_aptogotchi(
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, MintAptogotchiEvents {
        setup_test(account, creator);

        create_aptogotchi(creator);
        let has_aptogotchi = has_aptogotchi(address_of(creator));
        assert!(has_aptogotchi, 1);
        let (name, description, uri) = get_aptogotchi(address_of(creator));
        debug::print(&name);
        debug::print(&description);
        debug::print(&uri);
    }

    // Test getting an Aptogotchi, when user has not minted
    #[test(account = @aptogotchi, creator = @0x123)]
    #[expected_failure(abort_code = 851969, location = aptogotchi::main)]
    fun test_get_aptogotchi_without_creation(
        account: &signer,
        creator: &signer
    ) {
        setup_test(account, creator);

        // get aptogotchi without creating it
        get_aptogotchi(address_of(creator));
    }

    // Test getting an Aptogotchi, when user has not minted
    #[test(account = @aptogotchi, creator = @0x123)]
    #[expected_failure(abort_code = 524291, location = aptogotchi::main)]
    fun test_create_aptogotchi_twice(
        account: &signer,
        creator: &signer
    ) acquires CollectionCapability, MintAptogotchiEvents {
        setup_test(account, creator);

        create_aptogotchi(creator);
        create_aptogotchi(creator);
    }
}
