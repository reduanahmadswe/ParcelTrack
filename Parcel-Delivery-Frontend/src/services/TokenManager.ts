import Cookies from 'js-cookie';

export class TokenManager {
    private static ACCESS_TOKEN_KEY = 'accessToken';
    private static REFRESH_TOKEN_KEY = 'refreshToken';

    private static TOKEN_SET_AT_KEY = 'tokenSetAt';

    static setTokens(accessToken: string, refreshToken?: string) {
        try {
            console.log('🔑 [TokenManager] setTokens called');
            console.log('📦 Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'null');
            console.log('🔄 Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null');

            if (typeof window !== 'undefined') {
                localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
                console.log('✅ Access token saved to localStorage');

                if (refreshToken) {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
                    console.log('✅ Refresh token saved to localStorage');
                }

                try {
                    localStorage.setItem(this.TOKEN_SET_AT_KEY, String(Date.now()));
                } catch (e) {
                    console.warn('⚠️ Failed to set token timestamp');
                }

                // Verify tokens were saved
                const savedAccessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
                const savedRefreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
                console.log('🔍 Verification - Access Token in localStorage:', savedAccessToken ? 'EXISTS' : 'MISSING');
                console.log('🔍 Verification - Refresh Token in localStorage:', savedRefreshToken ? 'EXISTS' : 'MISSING');
            } else {
                console.warn('⚠️ Window is undefined, cannot save to localStorage');
            }

            try {
                Cookies.set(this.ACCESS_TOKEN_KEY, accessToken, {
                    expires: 7,
                    secure: false, // Changed to false for localhost
                    sameSite: 'lax' // Changed to lax for localhost
                });
                console.log('🍪 Access token saved to cookies');

                if (refreshToken) {
                    Cookies.set(this.REFRESH_TOKEN_KEY, refreshToken, {
                        expires: 30,
                        secure: false, // Changed to false for localhost
                        sameSite: 'lax' // Changed to lax for localhost
                    });
                    console.log('🍪 Refresh token saved to cookies');
                }
            } catch (cookieError) {
                console.error('❌ Failed to save cookies:', cookieError);
            }

            console.log('✅ [TokenManager] setTokens completed successfully');
        } catch (error) {
            console.error('❌ [TokenManager] setTokens failed:', error);
        }
    }

    static getAccessToken(): string | null {
        try {

            if (typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
                if (localToken) {
                    return localToken;
                }
            }

            const cookieToken = Cookies.get(this.ACCESS_TOKEN_KEY);
            if (cookieToken) {

                if (typeof window !== 'undefined') {
                    localStorage.setItem(this.ACCESS_TOKEN_KEY, cookieToken);
                }
                return cookieToken;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    static getRefreshToken(): string | null {
        try {

            if (typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
                if (localToken) {
                    return localToken;
                }
            }

            const cookieToken = Cookies.get(this.REFRESH_TOKEN_KEY);
            if (cookieToken) {

                if (typeof window !== 'undefined') {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, cookieToken);
                }
                return cookieToken;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    static clearTokens() {
        try {

            try {
                if (typeof window !== 'undefined') {

                    console.debug('[TokenManager] clearTokens called');

                    try {

                        console.trace('[TokenManager] clearTokens stack trace');
                    } catch (e) {

                    }
                }
            } catch (err) { }

            try {
                if (typeof window !== 'undefined') {
                    const ts = localStorage.getItem(this.TOKEN_SET_AT_KEY);
                    if (ts) {
                        const then = parseInt(ts, 10);
                        if (!isNaN(then) && Date.now() - then < 2000) {
                            console.debug('[TokenManager] skip clearing tokens: recent set detected');
                            return;
                        }
                    }
                }
            } catch (e) {

            }

            Cookies.remove(this.ACCESS_TOKEN_KEY);
            Cookies.remove(this.REFRESH_TOKEN_KEY);

            if (typeof window !== 'undefined') {
                localStorage.removeItem(this.ACCESS_TOKEN_KEY);
                localStorage.removeItem(this.REFRESH_TOKEN_KEY);
                localStorage.removeItem('userData');
                try {
                    localStorage.removeItem(this.TOKEN_SET_AT_KEY);
                } catch (e) {

                }
            }
        } catch (error) {

        }
    }

    static hasValidTokens(): boolean {
        const accessToken = this.getAccessToken();
        return !!accessToken;
    }
}

