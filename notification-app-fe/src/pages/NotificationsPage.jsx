import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [priorityLimit, setPriorityLimit] = useState(10);

  const { notifications, priorityInbox, totalPages, unreadCount, loading, error } = useNotifications(filter, page, priorityLimit);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Priority Inbox
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Showing the top {priorityLimit} unread notifications by priority and recency.
          </Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="priority-limit-label">Priority count</InputLabel>
            <Select
              labelId="priority-limit-label"
              value={priorityLimit}
              label="Priority count"
              onChange={(event) => setPriorityLimit(event.target.value)}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {priorityInbox.length > 0 ? (
          <Stack spacing={1.5}>
            {priorityInbox.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </Stack>
        ) : (
          <Alert severity="info">No unread notifications are currently prioritized.</Alert>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Unable to load notifications: {error}</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications for this filter.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </Stack>
      )}

      {!loading && !error && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page - 1}
            onChange={(_, newPage) => handlePageChange(_, newPage + 1)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
