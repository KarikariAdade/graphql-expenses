import {ApolloServer} from "@apollo/server";
import {mergeTypeDef} from "./typeDefs/index.js";
import {mergedResolvers} from "./resolvers/index.js";
import express from 'express';
import http from 'http'
import cors from 'cors';
import dotenv from 'dotenv';

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import {expressMiddleware} from "@apollo/server/express4";
import {connectDB} from "./db/connectDB.js";
import passport from "passport";

import MongoStore from "connect-mongo";
import session from "express-session";
import {configurePassport} from "../passport/passport.config.js";
import mongoose from "mongoose";

dotenv.config()

configurePassport()

const app = express()
const httpServer = http.createServer(app)


const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
})
store.on('error', (error) => console.log('error', error))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true, // prevents xss attacks
        },
        store: store
    })
)

app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
    typeDefs: mergeTypeDef,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
});
try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log('conection successfully', conn, conn.connection.host)
} catch (error) {
    console.log('error', error.message)
    process.exit(1)
}



await server.start();

app.use(
    '/graphql',
    cors({
        origin: 'http://localhost:5174',
        credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({req}) => ({req})
    })
)

await new Promise((resolve) => {
    httpServer.listen({port:4000})
})

await connectDB()

console.log('server ready')
