import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const filters = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value || "All"}
      exclusive
      size="small"
      sx={{ flexWrap: "wrap", gap: 0.5 }}
      onChange={(_, nextValue) => {
        if (nextValue !== null) {
          onChange(nextValue);
        }
      }}
    >
      {filters.map((type) => (
        <ToggleButton key={type} value={type} sx={{ textTransform: "none", px: 2 }}>
          {type}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}