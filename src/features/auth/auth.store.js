import { create } from "zustand";

const storedUser = localStorage.getItem("user");
const storedAccessToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken || null,
  refreshToken: storedRefreshToken || null,

  login: ({ user, accessToken, refreshToken }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    set({
      user,
      accessToken,
      refreshToken,
    });
  },

  logout: () => {
    localStorage.clear();

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));

    set({
      user: updatedUser,
    });
  },
}));