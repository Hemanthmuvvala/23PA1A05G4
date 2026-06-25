import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

export function NotificationCard({ notification }) {
  const { title, message, type, createdAt, read = false } = notification;
  const displayTitle = title || (type ? `${type} Notification` : "Notification");
  const displayMessage = message || "No additional details.";
  const formattedDate = new Date(createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: read ? 4 : 6,
        borderLeftColor: read ? "divider" : "primary.main",
        bgcolor: read ? "background.paper" : "primary.50",
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1}
          mb={1}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {displayTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {displayMessage}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={type} size="small" color="primary" variant="outlined" />
            {!read && <Chip label="New" size="small" color="success" />}
          </Stack>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {formattedDate}
        </Typography>
      </CardContent>
    </Card>
  );
}
