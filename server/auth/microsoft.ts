import passport from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    callbackURL: "http://localhost:3109/auth/microsoft/callback",
    scope: ['user.read']
},
    function (accessToken: string, refreshToken: string, profile: any, done: any) {
        // Aqui você salvaria ou buscaria o usuário no banco de dados
        // Por enquanto, retornamos o perfil da Microsoft como usuário
        return done(null, profile);
    }
));
