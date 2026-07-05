* {
  box-sizing: border-box;
}
html,
body,
#root {
  margin: 0;
  padding: 0;
  min-height: 100%;
}
body {
  font-family: "Inter", "Noto Sans Thai", sans-serif;
  background: #0a0b14;
  -webkit-font-smoothing: antialiased;
}
button {
  cursor: pointer;
  font-family: inherit;
}
input {
  font-family: inherit;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #242640;
  border-radius: 999px;
}

.flex { display: flex; }
.grid { display: grid; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.flex-wrap { flex-wrap: wrap; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-7 { grid-template-columns: repeat(7, 1fr); }
