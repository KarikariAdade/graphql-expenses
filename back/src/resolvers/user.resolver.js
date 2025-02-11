
import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";

export const userResolver =  {
    Query: {
        authUser: async(_,__, context) => {
            try {

                const user = await context.getUser();
                return user;

            } catch (error) {

                console.log('Error: ', error)
                throw new Error(error.message || "internal server error")
            }
        },
        user: async (_, {userId}) => {

            try {

                const user = await User.findById(userId)

                return user

            } catch (error) {
                console.log('Error: ', error)
                throw new Error(error.message || "internal server error")
            }
        }
    },
    Mutation: {
        signUp: async(_, {input}, context) => {
            
            try {
                const {username, name, password, gender} = input

                if (!username || !name || !password || !gender) {
                    throw new Error("All fields are required")
                }

                const existingUser = await User.findOne({username})
                if(existingUser)
                    throw new Error("Username already exists")

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                const boyProfilePic = `https://avatar.iran.liara.run/username?username=${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/username?username=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePic: gender === "Male"? boyProfilePic : girlProfilePic
                })

                await newUser.save();

                await context.login(newUser)

                return newUser;

            } catch (error) {
                console.log('Error in create User: ', error)
                throw new Error(error.message || "internal server error")
            }
        },
        login: async (_, {input}, context) => {
            try {
                const {username, password} = input

                const {user} = await context.authenticate('graphql-local', {username, password})
                await context.login(user)
                return user

            } catch (error) {
                console.log('Error in login User: ', error)
                throw new Error(error.message || "internal server error")
            }
        },
        logout: async (_, __, context) => {
            try {
                await context.logout()
                req.session.destroy((error) => {
                    if (error) throw error
                })

                res.clearCookie('connect.sid')
                return {message: 'logged out'}
            } catch (error) {
                console.log('Error in logout User: ', error)
                throw new Error(error.message || "internal server error")
            }
        }
    }
}