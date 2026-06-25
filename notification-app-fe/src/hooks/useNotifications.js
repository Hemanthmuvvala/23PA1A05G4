import { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";

const DEFAULT_PRIORITY_LIMIT = 10;
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getPriorityScore(item) {
  const typeWeight = TYPE_WEIGHT[item.type] ?? 0;
  const timeWeight = new Date(item.createdAt).getTime();
  return typeWeight * 1_000_000_000 + timeWeight;
}

function selectPriorityInbox(items, limit = DEFAULT_PRIORITY_LIMIT) {
  const unread = items.filter((item) => !item.read);
  const top = [];

  for (const item of unread) {
    const score = getPriorityScore(item);
    if (top.length < limit) {
      top.push({ item, score });
      top.sort((a, b) => b.score - a.score);
      continue;
    }

    const lowest = top[top.length - 1];
    if (score > lowest.score) {
      top[top.length - 1] = { item, score };
      top.sort((a, b) => b.score - a.score);
    }
  }

  return top.map((entry) => entry.item);
}

export function useNotifications(filter = "All", page = 1, priorityLimit = DEFAULT_PRIORITY_LIMIT) {
  const [notifications, setNotifications] = useState([]);
  const [priorityInbox, setPriorityInbox] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNotifications();
        if (!isMounted) return;

        const sorted = [...data.notifications].sort((a, b) => {
          const aTime = new Date(a.createdAt).getTime();
          const bTime = new Date(b.createdAt).getTime();
          return bTime - aTime;
        });

        const filtered =
          filter === "All"
            ? sorted
            : sorted.filter((item) => item.type === filter);

        const start = (page - 1) * 3;
        const paged = filtered.slice(start, start + 3);

        const inbox = selectPriorityInbox(filtered, priorityLimit);

        setNotifications(paged);
        setPriorityInbox(inbox);
        setUnreadCount(filtered.filter((item) => !item.read).length);
        setTotalPages(Math.max(1, Math.ceil(filtered.length / 3)) || 1);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load notifications");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [filter, page, priorityLimit]);

  return { notifications, priorityInbox, totalPages, unreadCount, loading, error };
}
