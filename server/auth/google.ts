import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "http://localhost:3109/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        // Aqui você salvaria ou buscaria o usuário no banco de dados
        // Por enquanto, retornamos o perfil do Google como usuário
        return cb(null, profile);
    }
));
