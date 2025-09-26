import { useEffect } from "react";
import { useSocket } from "../../context/use[custom]/useSocket";
import type { ResConversationsResponse } from "../../utils/type";
import { socket } from "../../context/use[custom]/socket";

const Conversations = ({ userId }: { userId: number }) => {
  const { data, loading, isConnected } = useSocket<ResConversationsResponse>({
    event: "getConversationsResponse",
    autoListen: true,
    userId,
    onSuccess: (res) => {
      if (res?.resultCode === "00") {
        console.log("✅ Conversations:", res.list);
      } else {
        console.warn("❌ Server error:", res?.resultMessage);
      }
    },
  });

  // Khi socket sẵn sàng thì emit request
  useEffect(() => {
    if (isConnected) {
      socket.emit("getConversations", { userId });
    }
  }, [isConnected, userId]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {data?.resultCode === "00" ? (
        <ul>
          {data?.list?.map((c) => (
            <li key={c.userId}>
              <b>{c.name}</b>: {c.lastMessage}
            </li>
          ))}
        </ul>
      ) : (
        <div>{data?.resultMessage}</div>
      )}
    </div>
  );
};
export default Conversations;
