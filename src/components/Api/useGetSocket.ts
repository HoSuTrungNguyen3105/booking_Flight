// import { useSocket } from "../../context/use[custom]/useSocket";

// type Message = {
//   userId: number;
//   message: string;
// };

// export const useFlightMeals = (senderId: {id:number},receiverId:{id: number} ,currentUser:{id: number}) => {
// //   const { data, loading, emit } = useSocket<Message[]>({
// //     event: "get_messages",
// //     autoListen: true,
// //     onSuccess: (messages) => {
// //       console.log("Nhận được tin nhắn:", messages);
// //     },
// //     onError: (error) => {
// //       console.error("Lỗi khi lấy tin nhắn:", error);
// //     },
// //   });

// const { data: incomingMessage, isConnected } = useSocket<Message>({
//     event: 'new_message',
//     autoListen: true,
//     userId: currentUser.id,
//     onSuccess: (message) => {
//       // Chỉ thêm tin nhắn nếu liên quan đến cuộc trò chuyện hiện tại
//       if (
//         (message.senderId === currentUser.id && message.receiverId === selectedUser.id) ||
//         (message.senderId === selectedUser.id && message.receiverId === currentUser.id)
//       ) {
//         setMessages(prev => [...prev, message]);
//       }
//     },
//     onError: (error) => {
//       console.error('Socket error:', error);
//     }
//   });

//   // Hook để gửi tin nhắn
// //   const { emit: sendMessage, loading: sending } = useSocket({
// //     event: 'send_message',
// //     autoListen: false
// //   });

//   return {
//     incomingMessage,
//     isConnected,
//   };
// };

// // Gửi tin nhắn mới
// // const sendMessage = (content: string) => {
// //   emit({ content, userId: currentUser.id });
// // };

// // Sử dụng useFetch cho REST API và useSocketFetch cho real-time
// // const { data: userData } = useFetch<User>({
// //   url: '/api/user/profile',
// //   autoFetch: true
// // });

// // const { data: realTimeNotifications } = useSocketFetch<Notification[]>({
// //   event: 'notifications',
// //   autoListen: true
// // });
