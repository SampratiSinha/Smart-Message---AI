const BASE_URL = "http://127.0.0.1:9000";

const getToken = () => localStorage.getItem("token");

export const sendMessage = async (conv_id, text) => {
  const res = await fetch(`${BASE_URL}/api/messages/${conv_id}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ text }),
  });

  return res.json();
};