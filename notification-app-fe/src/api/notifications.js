const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM3BhMWEwNWc0QHZpc2hudS5lZHUuaW4iLCJleHAiOjE3ODIzODIxOTgsImlhdCI6MTc4MjM4MTI5OCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjQ3ZDkyMjY0LTFkZTItNDE4MS05NjViLTViZWQyM2FiYTlhNyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im11dnZhbGEgaGVtYW50aCB2ZW5rYXRhIG5hZ2EgcGF2YW4ga3VtYXIiLCJzdWIiOiI1NjAxMjdhNS0xOGViLTRmZTItYTMxMC1kYzlhYmExOGViNWUifSwiZW1haWwiOiIyM3BhMWEwNWc0QHZpc2hudS5lZHUuaW4iLCJuYW1lIjoibXV2dmFsYSBoZW1hbnRoIHZlbmthdGEgbmFnYSBwYXZhbiBrdW1hciIsInJvbGxObyI6IjIzcGExYTA1ZzQiLCJhY2Nlc3NDb2RlIjoiYWhYanZwIiwiY2xpZW50SUQiOiI1NjAxMjdhNS0xOGViLTRmZTItYTMxMC1kYzlhYmExOGViNWUiLCJjbGllbnRTZWNyZXQiOiJBWmRYa2Vjd1ZFZGRIek55In0.5yEZJ9nfwRkiCFP-8JbPRY0xywSpjFiMqK_hJMv7YRI";

function normalizeNotification(item) {
  return {
    id: item?.ID ?? item?.id ?? item?.notificationId ?? item?._id ?? Math.random().toString(36).slice(2),
    title: item?.Title ?? item?.title ?? item?.subject ?? item?.Type ?? "Notification",
    message: item?.Message ?? item?.message ?? item?.body ?? item?.description ?? "",
    type: item?.Type ?? item?.type ?? item?.category ?? "General",
    createdAt: item?.Timestamp ?? item?.createdAt ?? item?.created_at ?? item?.timestamp ?? new Date().toISOString(),
    read: Boolean(item?.read ?? item?.isRead ?? item?.readStatus),
  };
}

export async function fetchNotifications() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.notifications)
      ? data.notifications
      : Array.isArray(data?.data)
        ? data.data
        : [];

  return {
    notifications: list.map(normalizeNotification),
    totalPages: data?.totalPages ?? 1,
  };
}
