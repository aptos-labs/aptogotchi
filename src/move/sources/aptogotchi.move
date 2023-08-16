module aptogotchi::main {

    use aptos_framework::account::{Self, SignerCapability};
    use std::string::{Self, String};
    use aptos_framework::timestamp;
    use aptos_token_objects::collection;
    use std::option;
    use aptos_token_objects::token;

    struct AptoGotchi has key {
        name: String,
        birthday: u64,
        health_points: u8,
        happiness: u8,
        mutator_ref: token::MutatorRef,
    }

    /// Tokens require a signer to create, so this is the signer for the collection
    struct CollectionCapability has key, drop {
        capability: SignerCapability,
        burn_signer_capability: SignerCapability,
    }

    const APP_SIGNER_CAPABILITY_SEED: vector<u8> = b"APP_SIGNER_CAPABILITY";
    const BURN_SIGNER_CAPABILITY_SEED: vector<u8> = b"BURN_SIGNER_CAPABILITY";
    const APTOGOTCHI_COLLECTION_NAME: vector<u8> = b"Aptogotchi Collection Name";
    const APTOGOTCHI_COLLECTION_DESCRIPTION: vector<u8> = b"Aptogotchi Collection Description";
    const APTOGOTCHI_COLLECTION_URI: vector<u8> = b"https://knight.collection.uri";

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

        create_aptogotchi_collection(&token_resource);
    }

    fun get_token_signer(): signer acquires CollectionCapability {
        account::create_signer_with_capability(&borrow_global<CollectionCapability>(@aptogotchi_addr).capability)
    }

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

    public entry fun create_aptogotchi(user: &signer, name: String) acquires CollectionCapability {
        let uri = string::utf8(APTOGOTCHI_COLLECTION_URI);
        let description = string::utf8(APTOGOTCHI_COLLECTION_DESCRIPTION);

        let constructor_ref = token::create_named_token(
            &get_token_signer(),
            string::utf8(APTOGOTCHI_COLLECTION_NAME),
            description,
            name,
            option::none(),
            uri,
        );

        let mutator_ref = token::generate_mutator_ref(&constructor_ref);

        let gotchi = AptoGotchi {
            name,
            birthday: timestamp::now_seconds(),
            health_points: 100,
            happiness: 100,
            mutator_ref,
        };

        move_to(user, gotchi);
    }

    #[view]
    public fun get_name(user_addr: address): String acquires AptoGotchi {
        let gotchi = borrow_global_mut<AptoGotchi>(user_addr);

        gotchi.name
    }

    #[view]
    public fun get_health_points(user_addr: address): u8 acquires AptoGotchi {
        let gotchi = borrow_global_mut<AptoGotchi>(user_addr);

        gotchi.health_points
    }

    #[view]
    public fun get_happiness(user_addr: address): u8 acquires AptoGotchi {
        let gotchi = borrow_global_mut<AptoGotchi>(user_addr);

        gotchi.happiness
    }

    #[view]
    public fun has_aptogochi(user_addr: address): bool {
        exists<AptoGotchi>(user_addr)
    }

    public entry fun set_name(user_addr: address, name: String) acquires AptoGotchi {
        let gotchi = borrow_global_mut<AptoGotchi>(user_addr);
        gotchi.name = name;

        gotchi.name;
    }

    public entry fun change_health_points(user_addr: address, points_difference: u8) acquires AptoGotchi {
        let gotchi = borrow_global_mut<AptoGotchi>(user_addr);
        gotchi.health_points = gotchi.health_points + points_difference;

        gotchi.health_points;
    }

    public entry fun change_happiness(user_addr: address, happiness_difference: u8) acquires AptoGotchi {
        let gotchi = borrow_global_mut<AptoGotchi>(user_addr);
        gotchi.happiness = gotchi.happiness + happiness_difference;
    }
}
