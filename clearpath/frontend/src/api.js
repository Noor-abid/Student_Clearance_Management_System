// All API calls to the Flask backend live here
const BASE = "http://localhost:5000/api";

const api = {
  // Auth
  login: (email, password) =>
    fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()),

  register: (data) =>
    fetch(`${BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  // Requests
  getRequests: () =>
    fetch(`${BASE}/requests`).then(r => r.json()),

  createRequest: (data) =>
    fetch(`${BASE}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  deptAction: (reqId, dept, action, actor) =>
    fetch(`${BASE}/requests/${reqId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dept, action, actor }),
    }).then(r => r.json()),

  resetData: () =>
    fetch(`${BASE}/requests/reset`, { method: "POST" }).then(r => r.json()),
};

export default api;