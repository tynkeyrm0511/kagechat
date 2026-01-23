import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set) => ({
  loading: false,
  searchByUserName: async (username) => {
    try {
      set({ loading: true });
      const user = await friendService.searchByUserName(username);
      return user;
    } catch (error) {
      console.error("Error searching user by username:", error);
    } finally {
      set({ loading: false });
    }
  },

  addFriend: async (to, message) => {
    try {
      set({ loading: true });
      const resultMessage = await friendService.sendFriendRequest(to, message);
      return resultMessage;
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
