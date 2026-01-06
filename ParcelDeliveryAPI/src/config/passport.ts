import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../modules/user/user.model';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

console.log('🔧 Configuring Google OAuth Strategy...');
console.log(`   Client ID: ${GOOGLE_CLIENT_ID ? '✅ Set (' + GOOGLE_CLIENT_ID.substring(0, 20) + '...)' : '❌ Missing'}`);
console.log(`   Client Secret: ${GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   Callback URL: ${GOOGLE_CALLBACK_URL}`);

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('❌ ERROR: Google OAuth credentials not configured!');
  console.error('   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables');
  console.error('   Google login will NOT work until these are set!');
} else {
  console.log('✅ Google OAuth credentials configured successfully');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        
        if (!email) {
          return done(new Error('No email found in Google profile'), false);
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
          // Create new user from Google profile
          user = new User({
            name: profile.displayName || 'Google User',
            email: email,
            password: Math.random().toString(36).slice(-8) + 'Aa1!', // Random password
            role: 'sender', // Default role
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
            },
            googleId: profile.id,
            isEmailVerified: true, // Google emails are verified
          });
          await user.save();
        } else if (!user.googleId) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.isEmailVerified = true;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

export default passport;
