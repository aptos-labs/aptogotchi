script {
    fun create_gotchi(user: &signer) {
        aptogotchi::main::create_aptogotchi(user);
    }
}
