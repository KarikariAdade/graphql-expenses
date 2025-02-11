import { GraphQLLocalStrategy, buildContext } from "graphql-passport";
import passport from "passport";
import {User} from "../src/models/user.model.js";

export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        console.log('serializing user', user)
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {

        try {
            const user = await User.findById(id);
            done(null, user)
        } catch (error) {
            done(error)
        }

    })


    passport.use(
        new GraphQLLocalStrategy(async (username, passpowrd, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user ||!(await user.isCorrectPassword(password))) {
                    throw new Error("invalid username or password")
                }
                const validPassword = await bcrypt.compare(password, user.password)

                if (!validPassword)
                    throw  new Error("invalid username or password")

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    )
}