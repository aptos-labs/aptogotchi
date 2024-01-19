script {
    // Running this script will feed user's gotchi twice in one transaction
    // Increasing gotchi's energy point by 2.
    fun feed_gotchi(user: &signer) {
        let energy_points = 1;
        aptogotchi::main::feed(user, energy_points);
        aptogotchi::main::feed(user, energy_points);
    }
}
