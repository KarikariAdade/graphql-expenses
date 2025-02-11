
import { mergeTypeDefs } from "@graphql-tools/merge";
import {userTypeDef} from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";


export const mergeTypeDef = mergeTypeDefs([userTypeDef, transactionTypeDef])