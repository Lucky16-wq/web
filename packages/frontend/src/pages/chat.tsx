import { useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import Layout from '../components/Layout';

type Chat = {
  id: string;
  customer: { fullName: string; email: string };
  admin?: { fullName: string; email: string };
  status: string;
  messages: Array<{ id: string; senderId: string; senderRole: string; content: string; createdAt: string }>;
};

type Message = {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
};

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000/api';
  const socketUrl = baseUrl.replace('/api', '');

  useEffect(() => {
    // Generate atau ambil Guest Session ID
    let guestId = localStorage.getItem('guest_session_id');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guest_session_id', guestId);
    }

    const token = localStorage.getItem('venue_rental_token');

    Promise.all([
      fetch(`${baseUrl}/auth/me`, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      }).then((res) => res.ok ? res.json() : { role: 'Guest' }),
      fetch(`${baseUrl}/chats?guestId=${guestId}`, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      }).then((res) => res.json()),
    ])
      .then(([profileData, chatsData]) => {
        setChats(Array.isArray(chatsData) ? chatsData : []);
        setIsAdmin(profileData?.role === 'Admin');
        if (Array.isArray(chatsData) && chatsData.length > 0) {
          setActiveChatId(chatsData[0].id);
        }
      })
      .catch(() => setError('Gagal memuat data chat.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeChatId) {
      return;
    }

    const socketClient = io(socketUrl);

    socketClient.on('connect', () => {
      socketClient.emit('chat:join', { chatId: activeChatId });
    });

    socketClient.on('chat:history', (history: Message[]) => {
      setMessages(history);
    });

    socketClient.on('chat:message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketClient.on('chat:error', (payload: any) => {
      setError(payload?.message || 'Terjadi kesalahan chat.');
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [activeChatId, socketUrl]);

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) || null, [chats, activeChatId]);

  const refreshChats = async (query = '') => {
    const token = localStorage.getItem('venue_rental_token');
    try {
      const response = await fetch(`${baseUrl}/chats?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal memuat daftar chat');
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      refreshChats(`search=${searchTerm}&status=${filterStatus === 'all' ? '' : filterStatus}`);
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm, filterStatus]);

  const createChat = async () => {
    setError('');
    const guestId = localStorage.getItem('guest_session_id');
    try {
      const response = await fetch(`${baseUrl}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestSessionId: guestId }), 
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Gagal membuat chat baru.');
        return;
      }
      await refreshChats();
      setActiveChatId(data.id);
    } catch (err) {
      setError('Gagal membuat chat baru. Pastikan koneksi ke server stabil.');
    }
  };

  const sendMessage = async () => {
    if (!activeChatId || !newMessage.trim()) {
      return;
    }
    setError('');
    if (socket) {
      socket.emit('chat:message', { chatId: activeChatId, content: newMessage.trim() });
      setNewMessage('');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/chats/${activeChatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, data]);
        setNewMessage('');
      } else {
        setError(data.message || 'Gagal mengirim pesan.');
      }
    } catch (err) {
      setError('Gagal mengirim pesan. Cek koneksi internet Anda.');
    }
  };

  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  return (
    <Layout>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Chat Privat</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Hubungi admin secara langsung atau kelola chat customer.</p>
          </div>
          {!isAdmin && (
            <button onClick={createChat} className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-200 transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:shadow-none">
              Mulai Chat Baru
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-slate-600 dark:text-slate-300">Memuat chat...</p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Cari customer..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:ring-2 focus:ring-slate-200 outline-none dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div className="mt-4 space-y-3">
                {chats.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">Belum ada chat. Buat chat baru untuk menghubungi admin.</p>
                ) : (
                  chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => selectChat(chat.id)}
                      className={`block w-full rounded-3xl px-4 py-3 text-left transition ${activeChatId === chat.id ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'}`}
                    >
                      <div className="text-sm font-semibold">{isAdmin ? chat.customer.fullName : chat.admin?.fullName || 'Admin'} </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{chat.status}</div>
                    </button>
                  ))
                )}
              </div>
            </aside>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              {activeChat ? (
                <>
                  <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Chat dengan {isAdmin ? activeChat.customer.fullName : activeChat.admin?.fullName || 'Admin'}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Status: {activeChat.status}</p>
                    </div>
                  </div>

                  <div className="mb-6 max-h-[480px] space-y-4 overflow-y-auto pr-2">
                    {messages.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">Tidak ada pesan. Kirim pesan pertama Anda.</p>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                          <div className="mb-2 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            <span>{message.senderRole}</span>
                            <span>{new Date(message.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-200">{message.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={newMessage}
                      onChange={(event) => setNewMessage(event.target.value)}
                      rows={4}
                      className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Ketik pesan Anda di sini..."
                    />
                    <button
                      onClick={sendMessage}
                      className="rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
                    >
                      Kirim Pesan
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">Pilih chat untuk mulai berkomunikasi.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </Layout>
  );
}
