const passport = require('passport'); 
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = require('./configs/keys');
const uuidv4 = require('uuid/v4');

const User = require('./models/user');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async(payload, done) => {
    
    try {
        // Find the user specified in token
        const user = await User.findById(payload.sub);
        // If user doesn't exists, handle it 
        if (!user) {
            return done(null, false);
        }
        
        // Otherwise, return the user
        done(null, user);
    }catch(error) {
        done(error, false);
    }
}));


// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'username'
}, async (username, password, done) => {
    try {
        //console.log('fas local strategy? '+ username);
        //console.log({'username':username});
        // Find the user based on username
        const user = await User.findOne({'username':username});
        //console.log(user);
        //If not, handle it
        if(!user) {
            return done(null, false);
        }
        // Check if password is correct
        const isMatch = await user.isValidPassword(password);
        //console.log('compares? '+isMatch);
        // If not, handle it
        if (!isMatch) {
            return done(null, false);
        }
        //Otherwise, return the user
        done(null, user);
    } catch(error) {
        done(error, false);
    }
})); 

// GOOGLE OAUTH STRATEGY

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
    //then edit your /etc/hosts local file to point on your private IP. 
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    
  }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('accessToken', accessToken);
        console.log('profile', profile);
        console.log('refreshToken', refreshToken);
    
        // Check whether this current user exist in our DB
        const existingUser = await User.findOne({ "username" : profile.id });
        if (existingUser) {
            console.log('User already exists in our database')
            return done(null, existingUser);
        }
        
        console.log('User doesn\'t exist, let\'s create a new one');
        // If new account
        const newUser = new User ({
            socialId: profile.id,
            socialProvider: 'google',
            name: profile.displayName,
            username: profile.id, 
            mail: profile.emails[0].value
        });
    
        await newUser.save();
        done(null, newUser);
      } catch(error) {
            done(error, false, error.message); 
      }
}));
  
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "https://backend.bancdetemps.tk/users/oauth/facebook/callback",
    profileFields: ['id', 'displayName', 'picture', 'email']
  },
  async function(accessToken, refreshToken, profile, cb) {
      console.log('entres?');
      let userExist = User.findOne({ "username" : profile.id });
      if(!userExist){
        const newUser = new User ({
            socialId: profile.id,
            socialProvider: 'facebook',
            name: profile.displayName,
            username: profile.id, 
            mail: "anonymus@anonymus.anonymus",
            password: uuidv4()
        });

        try{
           let finalUser = newUser.save();
           console.log('guardes?');
           console.log(finalUser);
           cb(undefined,finalUser);
        }catch (err) {
            console.log('error?');
            console.log(err);
            cb(err,undefined);
        }
        return;
      } else {
          console.log('carregues un usuari?');
          console.log(userExist);
          cb(undefined,userExist);
      }
  }
));
