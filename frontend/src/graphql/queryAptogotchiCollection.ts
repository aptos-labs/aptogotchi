export const queryAptogotchiCollection = `
query MyQuery($collection_id: String) {
  current_collections_v2(
    where: { collection_id: { _eq: $collection_id } }
  ) {
    collection_id
    collection_name
    current_supply
    description
    creator_address
    last_transaction_timestamp
    max_supply
    last_transaction_version
    mutable_description
    mutable_uri
    token_standard
    table_handle_v1
    total_minted_v2
    uri
  }
  current_collection_ownership_v2_view(
    where: { collection_id: { _eq: $collection_id } }
  ) {
    owner_address
  }
}
`;
