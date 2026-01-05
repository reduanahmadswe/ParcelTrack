// Emergency Token Fix Script
// This script will save the current session token to localStorage

import { TokenManager } from '../services/TokenManager';
import { store } from '../store/store';

export function fixTokenStorage() {
    try {
        const state = store.getState();
        const { token, refreshToken, user } = state.auth;

        if (token && user) {
            console.log('🔧 Fixing token storage...');

            // Save tokens to localStorage
            TokenManager.setTokens(token, refreshToken || undefined);

            // Save user data
            localStorage.setItem('userData', JSON.stringify(user));

            console.log('✅ Token storage fixed!');
            console.log('📦 User:', user.email);
            console.log('🔑 Token saved to localStorage');

            return true;
        } else {
            console.warn('⚠️ No active session found in Redux store');
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to fix token storage:', error);
        return false;
    }
}

// Auto-run on import
if (typeof window !== 'undefined') {
    // Wait for store to be ready
    setTimeout(() => {
        const fixed = fixTokenStorage();
        if (fixed) {
            console.log('🎉 Token storage has been fixed! You can now refresh the page.');
        }
    }, 1000);
}
