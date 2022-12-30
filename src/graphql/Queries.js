import { gql } from "@apollo/client";

export const GET_DOMAINS = gql`
    query Domains( $labels: [String] ) {
        domains ( 
            where: {
                id_in: $labels
            }
        )
        {
            id
            label
            extension
            expires
            registered
            created
            owner {
              id
              primaryName
            }
            registrant {
              id
              primaryName
            }
        }
    }
`;