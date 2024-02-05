script {
    use std::string::utf8;

    fun create_gotchi(user: &signer) {
        let gotchi_name = utf8(b"gotchi");
        aptogotchi::main::create_aptogotchi(user, gotchi_name, 1, 1, 1);
    }
}
