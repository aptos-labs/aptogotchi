script {
    use std::string::utf8;

    fun create_gotchi(user: &signer) {
        let gotchi_name = utf8(b"gotchi");
        let gotchi_parts = vector[1, 1, 1];
        aptogotchi::main::create_aptogotchi(user, gotchi_name, gotchi_parts);
    }
}
