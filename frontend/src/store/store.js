import { create } from 'zustand';


export const useAuthStore = create((set) => ({
    user: undefined,
    token: undefined,
    setUser: (data) => set((state) => ({ user: data })),
    setUserFromLocalStorage: () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            set({ user: storedUser, token: storedToken });
        }
    },
    setToken: (data) => {
        set({ token: data });
    },
    clearAuthData: () => set({ user: undefined, token: undefined }),
    // updateUserProfileStatus : (data) => set((state) => ({ user: data})),
}))
