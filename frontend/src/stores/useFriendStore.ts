import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set) => ({
  loading: false,
  receivedList: [],
  sentList: [],
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

  getAllFriendRequests: async () => {
    try {
      set({ loading: true });
      const result = await friendService.getAllFriendRequests();
      if (!result) return;

      const { sent, received } = result;
      set({ sentList: sent, receivedList: received });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      set({ loading: false });
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.acceptFriendRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter((r) => r._id !== requestId),
      }));
    } catch (error) {
      console.error("Lỗi xảy ra khi acceptFriendRequest", error);
    } finally {
      set({ loading: false });
    }
  },
  
  declineFriendRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.declineFriendRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter((r) => r._id !== requestId),
      }));
    } catch (error) {
      console.error("Lỗi xảy ra khi declineRequest", error);
    } finally {
      set({ loading: false });
    }
  },
}));
