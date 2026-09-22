const API_URL = 'https://n8n.maik-bartels.com/webhook/25ec567c-52f5-4a6a-a10b-30ed3890b727';

export async function sendMessage(message) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        question: message
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Fehler beim Senden der Nachricht:', error);
    throw error;
  }
}