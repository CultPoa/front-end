const BASE_URL = "http://localhost:8000/api";

const getAuthToken = () => {
  return localStorage.getItem("auth");
};

export async function sendSecretMessage(placeId: string, content: string) {
  const res = await fetch(`${BASE_URL}/secret-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ place_id: placeId, content }),
  });

  if (!res.ok) throw new Error("Erro ao enviar mensagem");

  console.log(res);

  return res.json();
}

export async function fetchNewestMessage(placeId: string) {
  const res = await fetch(`${BASE_URL}/secret-message/newest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ place_id: placeId }),
  });

  if (!res.ok) {
    const error = new Error("Request failed");

    (error as any).status = res.status;

    throw error;
  }

  const data = await res.json();

  return data[0];
}
