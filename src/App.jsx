import { useEffect, useState } from "react";

const STORAGE_KEY = "local_notifications";
const DAY_24 = 24 * 60 * 60 * 1000;

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [time, setTime] = useState("");

  // Notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setMessages(
      saved.map((m) => ({
        ...m,
        time: new Date(m.time),
      }))
    );
  }, []);

  // Time checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;

      setMessages((prev) => {
        const updated = prev.map((msg) => {
          if (!msg.isNew && !msg.triggeredAt && now >= msg.time.getTime()) {
            if (Notification.permission === "granted") {
              new Notification("🔔 Yangi xabar", {
                body: msg.text,
              });
            }
            changed = true;
            return { ...msg, isNew: true, triggeredAt: now };
          }

          if (
            msg.isNew &&
            msg.triggeredAt &&
            now - msg.triggeredAt >= DAY_24
          ) {
            changed = true;
            return { ...msg, isNew: false };
          }

          return msg;
        });

        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Add message
  function addMessage() {
    if (!text || !time) {
      alert("Habar va vaqtni kiriting");
      return;
    }

    const newMessage = {
      id: Date.now(),
      text,
      time: new Date(time),
      isNew: false,
      triggeredAt: null,
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setText("");
    setTime("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-black flex flex-col">
      {/* HEADER */}
      <header className="bg-blue-300 py-5 sm:py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            📢 Habarnoma tizimi
          </h1>
          <p className="text-sm sm:text-base opacity-80">
            Belgilangan vaqtda ish stolida chiqadigan xabarlar
          </p>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* ADD MESSAGE */}
          <section className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              ➕ Habar qo‘shish
            </h2>

            <input
              className="mb-4 p-3 border rounded-lg text-black text-sm sm:text-base"
              placeholder="Habar matni"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <input
              type="datetime-local"
              className="mb-6 p-3 border rounded-lg text-black text-sm sm:text-base"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <button
              onClick={addMessage}
              className="mt-auto bg-blue-500 text-black py-3 rounded-xl font-semibold hover:bg-blue-600 transition text-sm sm:text-base"
            >
              Qo‘shish
            </button>
          </section>

          {/* NEW INFO */}
          <section className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 overflow-y-auto max-h-[420px] sm:max-h-[520px]">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              🆕 New info (24 soat)
            </h2>

            {messages.filter((m) => m.isNew).length === 0 && (
              <p className="opacity-60 text-sm sm:text-base">
                Hozircha yangi habar yo‘q
              </p>
            )}

            {messages
              .filter((m) => m.isNew)
              .map((m) => (
                <div
                  key={m.id}
                  className="p-4 mb-3 bg-green-100 rounded-xl shadow text-sm sm:text-base"
                >
                  🔔 {m.text}
                </div>
              ))}
          </section>

          {/* OLD MESSAGES */}
          <section className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 overflow-y-auto max-h-[420px] sm:max-h-[520px]">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              📂 Old messages
            </h2>

            {messages
              .filter((m) => !m.isNew)
              .map((m) => (
                <div
                  key={m.id}
                  className="p-4 mb-3 bg-gray-100 rounded-xl"
                >
                  <p className="text-sm sm:text-base">{m.text}</p>
                  <span className="text-xs sm:text-sm opacity-70">
                    {m.time.toLocaleString()}
                  </span>
                </div>
              ))}
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;
