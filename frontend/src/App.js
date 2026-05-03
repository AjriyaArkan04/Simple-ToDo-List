import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/todos";

const styles = {
  app: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "2rem 1rem",
    fontFamily: "'Georgia', serif",
  },
  header: {
    marginBottom: "2rem",
    borderBottom: "1.5px solid #e5e5e5",
    paddingBottom: "1rem",
  },
  h1: {
    fontSize: "22px",
    fontWeight: "500",
    color: "#111",
    letterSpacing: "-0.3px",
  },
  headerSub: {
    fontSize: "13px",
    color: "#888",
    marginTop: "4px",
    fontFamily: "system-ui, sans-serif",
  },
  formCard: {
    background: "#fff",
    border: "0.5px solid #e0e0e0",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1.5rem",
  },
  formLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#888",
    marginBottom: "4px",
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  },
  formGroup: { marginBottom: "12px" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  input: {
    width: "100%",
    padding: "8px 10px",
    border: "0.5px solid #d0d0d0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "system-ui, sans-serif",
    color: "#111",
    background: "#f8f8f8",
    outline: "none",
    boxSizing: "border-box",
  },
  btnPrimary: {
    width: "100%",
    padding: "10px",
    marginTop: "4px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "system-ui, sans-serif",
    cursor: "pointer",
  },
  divider: {
    height: "0.5px",
    background: "#e5e5e5",
    margin: "0 0 1.25rem",
  },
  sectionLabel: {
    fontSize: "11px",
    color: "#888",
    fontFamily: "system-ui, sans-serif",
    fontWeight: "600",
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  todoList: { display: "flex", flexDirection: "column", gap: "8px" },
  todoItem: (overdue) => ({
    background: "#fff",
    border: overdue ? "2px solid #f5c400" : "0.5px solid #e0e0e0",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
  }),
  todoActivity: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#111",
    marginBottom: "4px",
    fontFamily: "system-ui, sans-serif",
  },
  todoMeta: {
    fontSize: "12px",
    color: "#999",
    fontFamily: "system-ui, sans-serif",
    marginBottom: "10px",
  },
  todoActions: { display: "flex", gap: "6px" },
  btn: {
    padding: "5px 10px",
    fontSize: "12px",
    fontWeight: "500",
    fontFamily: "system-ui, sans-serif",
    cursor: "pointer",
    border: "0.5px solid #d0d0d0",
    borderRadius: "8px",
    background: "transparent",
    color: "#444",
  },
  btnDanger: {
    border: "0.5px solid #f5c8c8",
    color: "#c0392b",
    background: "transparent",
  },
  btnSuccess: {
    border: "0.5px solid #c3e6cb",
    color: "#1a7a3f",
    background: "transparent",
  },
  badgeEdit: {
    fontSize: "10px",
    padding: "2px 8px",
    background: "#e8f0fe",
    color: "#1a56db",
    borderRadius: "20px",
    fontFamily: "system-ui, sans-serif",
    fontWeight: "600",
    marginLeft: "6px",
    verticalAlign: "middle",
  },
  emptyState: {
    textAlign: "center",
    padding: "2rem",
    color: "#aaa",
    fontSize: "14px",
    fontFamily: "system-ui, sans-serif",
    border: "0.5px dashed #ddd",
    borderRadius: "12px",
  },
};

function App() {
  const [todos, setTodos] = useState([]);
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async () => {
    if (!activity || !date || !time) return;

    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity, date, time }),
      });
      setEditId(null);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity, date, time }),
      });
    }

    setActivity("");
    setDate("");
    setTime("");
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (editId === id) {
      setEditId(null);
      setActivity("");
      setDate("");
      setTime("");
    }
    fetchTodos();
  };

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setActivity(todo.activity);
    setDate(todo.date.slice(0, 10));
    setTime(todo.time);
  };

  const handleDone = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const isPastPlus5 = (dateStr, time) => {
    const now = new Date();
    const todoTime = new Date(`${dateStr.slice(0, 10)}T${time}`);
    return now - todoTime >= 5 * 60 * 1000;
  };

  const formatDate = (dateStr, time) => {
    const d = new Date(dateStr);
    const day = d.toLocaleDateString("id-ID", { weekday: "long" });
    const tanggal = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${day}, ${tanggal} · ${time}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      todos.forEach((todo) => {
        const todoTime = new Date(`${todo.date.slice(0, 10)}T${todo.time}`);
        if (
          now.getHours() === todoTime.getHours() &&
          now.getMinutes() === todoTime.getMinutes()
        ) {
          alert(`Pengingat: ${todo.activity}`);
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [todos]);

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Jadwal Kegiatan</h1>
        <p style={styles.headerSub}>Kelola aktivitas harian kamu</p>
      </div>

      {/* FORM */}
      <div style={styles.formCard}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>
            Kegiatan
            {editId && <span style={styles.badgeEdit}>Sedang diedit</span>}
          </label>
          <input
            style={styles.input}
            type="text"
            placeholder="Nama kegiatan..."
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Tanggal</label>
            <input
              style={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Waktu</label>
            <input
              style={styles.input}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <button style={styles.btnPrimary} onClick={handleSubmit}>
          {editId ? "Simpan Perubahan" : "Tambah Kegiatan"}
        </button>
      </div>

      <div style={styles.divider} />
      <div style={styles.sectionLabel}>
        {todos.length > 0 ? `${todos.length} kegiatan` : "Belum ada kegiatan"}
      </div>

      {/* LIST */}
      <div style={styles.todoList}>
        {todos.length === 0 ? (
          <div style={styles.emptyState}>
            Belum ada kegiatan. Tambahkan di atas.
          </div>
        ) : (
          todos.map((todo) => {
            const past = isPastPlus5(todo.date, todo.time);
            return (
              <div key={todo._id} style={styles.todoItem(past)}>
                <div style={styles.todoActivity}>{todo.activity}</div>
                <div style={styles.todoMeta}>{formatDate(todo.date, todo.time)}</div>
                <div style={styles.todoActions}>
                  <button style={styles.btn} onClick={() => handleEdit(todo)}>
                    Edit
                  </button>
                  <button
                    style={{ ...styles.btn, ...styles.btnDanger }}
                    onClick={() => handleDelete(todo._id)}
                  >
                    Hapus
                  </button>
                  {past && (
                    <button
                      style={{ ...styles.btn, ...styles.btnSuccess }}
                      onClick={() => handleDone(todo._id)}
                    >
                      Selesai
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;