const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// OAuth Configuration
const OAUTH_CONFIG = {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET
    },
    apple: {
        serviceId: process.env.APPLE_SERVICE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        keyId: process.env.APPLE_KEY_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY
    }
};

// Verify OAuth Token Helper
async function verifyOAuthToken(provider, token) {
    try {
        switch (provider) {
            case 'google':
                return await verifyGoogleToken(token);
            case 'facebook':
                return await verifyFacebookToken(token);
            case 'apple':
                return await verifyAppleToken(token);
            default:
                throw new Error('Unsupported OAuth provider');
        }
    } catch (error) {
        throw new Error(`OAuth verification failed: ${error.message}`);
    }
}

// Google Token Verification
async function verifyGoogleToken(token) {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(OAUTH_CONFIG.google.clientId);
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: OAUTH_CONFIG.google.clientId
    });
    
    const payload = ticket.getPayload();
    return {
        provider: 'google',
        providerId: payload.sub,
        email: payload.email,
        name: payload.name,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        emailVerified: payload.email_verified
    };
}

// Facebook Token Verification
async function verifyFacebookToken(token) {
    const axios = require('axios');
    
    // Verify token with Facebook
    const response = await axios.get(`https://graph.facebook.com/me`, {
        params: {
            access_token: token,
            fields: 'id,name,email,first_name,last_name,picture'
        }
    });
    
    const userData = response.data;
    return {
        provider: 'facebook',
        providerId: userData.id,
        email: userData.email,
        name: userData.name,
        firstName: userData.first_name,
        lastName: userData.last_name,
        picture: userData.picture?.data?.url
    };
}

// Apple Token Verification (simplified - in production, use proper JWT verification)
async function verifyAppleToken(token) {
    // In a real implementation, you would verify the JWT token with Apple's public keys
    // For now, we'll decode the token (this is not secure for production)
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
        throw new Error('Invalid Apple token');
    }
    
    const payload = decoded.payload;
    return {
        provider: 'apple',
        providerId: payload.sub,
        email: payload.email,
        name: payload.name ? `${payload.name.firstName} ${payload.name.lastName}` : 'Apple User',
        firstName: payload.name?.firstName,
        lastName: payload.name?.lastName,
        emailVerified: payload.email_verified !== false
    };
}

// OAuth Sign-In/Sign-Up Route
router.post('/auth', async (req, res) => {
    try {
        const { provider, accessToken } = req.body;

        if (!provider || !accessToken) {
            return res.status(400).json({
                success: false,
                message: 'Provider and access token are required'
            });
        }

        // Verify the OAuth token
        const oauthData = await verifyOAuthToken(provider, accessToken);

        if (!oauthData.email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required for account creation'
            });
        }

        // Check if user already exists
        let user = await User.findOne({ 
            $or: [
                { email: oauthData.email },
                { [`oauth.${provider}.id`]: oauthData.providerId }
            ]
        });

        if (user) {
            // Update existing user's OAuth info
            if (!user.oauth) user.oauth = {};
            user.oauth[provider] = {
                id: oauthData.providerId,
                email: oauthData.email,
                name: oauthData.name,
                picture: oauthData.picture
            };
            
            user.lastLogin = new Date();
            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id,
                    email: user.email 
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                message: `Successfully signed in with ${provider}`,
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    provider: provider,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                }
            });

        } else {
            // Create new user
            const newUser = new User({
                username: oauthData.email.split('@')[0], // Use email prefix as username
                email: oauthData.email,
                firstName: oauthData.firstName || 'User',
                lastName: oauthData.lastName || '',
                password: Math.random().toString(36).slice(-10), // Random password (won't be used)
                emailVerified: oauthData.emailVerified || false,
                oauth: {
                    [provider]: {
                        id: oauthData.providerId,
                        email: oauthData.email,
                        name: oauthData.name,
                        picture: oauthData.picture
                    }
                },
                lastLogin: new Date()
            });

            await newUser.save();

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: newUser._id,
                    email: newUser.email 
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.status(201).json({
                success: true,
                message: `Account created successfully with ${provider}`,
                token,
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    provider: provider,
                    createdAt: newUser.createdAt,
                    lastLogin: newUser.lastLogin
                }
            });
        }

    } catch (error) {
        console.error('OAuth authentication error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'OAuth authentication failed'
        });
    }
});

// Get OAuth Configuration (for frontend)
router.get('/config', (req, res) => {
    res.json({
        success: true,
        config: {
            google: {
                clientId: OAUTH_CONFIG.google.clientId,
                enabled: !!OAUTH_CONFIG.google.clientId
            },
            facebook: {
                appId: OAUTH_CONFIG.facebook.appId,
                enabled: !!OAUTH_CONFIG.facebook.appId
            },
            apple: {
                serviceId: OAUTH_CONFIG.apple.serviceId,
                enabled: !!OAUTH_CONFIG.apple.serviceId
            }
        }
    });
});

// Unlink OAuth Provider
router.delete('/unlink/:provider', async (req, res) => {
    try {
        const { provider } = req.params;
        const userId = req.user.userId; // From auth middleware

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.oauth && user.oauth[provider]) {
            delete user.oauth[provider];
            await user.save();

            res.json({
                success: true,
                message: `${provider} account unlinked successfully`
            });
        } else {
            res.status(400).json({
                success: false,
                message: `${provider} account not linked`
            });
        }

    } catch (error) {
        console.error('OAuth unlink error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unlink OAuth provider'
        });
    }
});

module.exports = router;
