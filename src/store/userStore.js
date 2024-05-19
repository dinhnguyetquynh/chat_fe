import { create } from 'zustand';

const userStore = create((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
  unSetUser: () => set(() => ({ user: null })),
}));

export default userStore;
