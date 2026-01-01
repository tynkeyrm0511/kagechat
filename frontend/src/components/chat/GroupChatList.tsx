import { useChatStore } from "@/stores/useChatStore";
import GroupChatCard from "./GroupChatCard";

const GroupChatList = () => {

  const { conversations } = useChatStore();

  console.log('GroupChatList - conversations:', conversations);

  if (!conversations || !Array.isArray(conversations)) return null;

 const groupChats = conversations.filter(
    (conv) => conv.type === "group"
  );

  console.log('GroupChatList - groupChats:', groupChats);

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {groupChats.map((conv) => (
        <GroupChatCard key={conv._id} conv={conv} />
      ))}
    </div>
  );
};

export default GroupChatList;
