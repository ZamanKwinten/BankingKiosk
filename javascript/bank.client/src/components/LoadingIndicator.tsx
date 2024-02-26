import { Card } from "@mui/material";
import { Container } from "@mui/system";

export function LoadingIndicator() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ padding: "0 35px" }}>
        <h1 style={{ padding: "50px" }}>Bezig met Laden</h1>
      </Card>
    </Container>
  );
}
