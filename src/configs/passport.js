const passport = require("passport");
const User = require("../models/user.model")
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {v4: uuidV4} = require("uuid")
const {newToken} = require("../controllers/auth.controller")
require("dotenv").config();

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2233/auth/google/callback",
    userProfileURL:"https://**www**.googleapis.com/oauth2/v3/userinfo",
    passReqToCallback   : true
  },

  async function(request, accessToken, refreshToken, profile, done) {
    // console.log("accessToken, refreshToken, profile", accessToken, refreshToken, profile)
    const email = profile?._json.email

    let user;
    try{
        user = await User.findOne({email}).lean().exec();

        if(!user){
            user = await User.create({
                email: email,
                password: uuidV4()
            })
        }
       const token = newToken(user)
        return done(null, {user,token})

    } catch(err){
        console.log("err:", err);
    }

    // return done(null ,"user")
  }
));

module.exports = passport;