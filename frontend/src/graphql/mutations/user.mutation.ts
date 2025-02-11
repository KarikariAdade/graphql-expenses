import {gql} from "@apollo/client";

// the data here should match the ones in your backend resolvers
export const SIGN_UP = gql`
    mutation SignUp($input: SignUpInput!) {
        signUp(input: $input){
            _id,
            name
            username
        }
    }
`