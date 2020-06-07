const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
    createUser: async (args) => {
        try {
            const existedUser = await User.findOne({
                email: args.userInput.email
            })
            if (existedUser) {
                throw new Error("User exist already.")
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save()
            return {...result._doc, password: null, _id: result.id}
        }
        catch (err) {
            throw err
        }
    },
    login: async ({email, password})=>{
        const userLogin = await User.findOne({email: email});
        if (!userLogin){
            throw new Error('User does not exist!');
        }

        const isEqual = await bcrypt.compare(password, userLogin.password);
        if(!isEqual){
            throw new Error('Password is not correct!')
        }
        
        const token= jwt.sign({
            userId: userLogin.id,
            email: userLogin.email
        }, 'somesupersecretkey', {
            expiresIn: '1h'
        });

        return {
            userId: userLogin.id,
            token: token,
            tokenExpiration: 1
        }
    }
}