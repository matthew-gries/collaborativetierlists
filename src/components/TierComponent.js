import { Box } from "@mui/material";

export const TierComponent = (props) => {

  const color = props.color;
  const tag = props.tag;

  return (
    <div>
      <Box sx={{
        backgroundColor: color
      }}
      >
        {tag}
      </Box>
    </div>
  )
}