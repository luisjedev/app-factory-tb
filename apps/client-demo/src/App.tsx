import { Button } from "@repo/ui/button";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  root: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    justifyContent: "center",
    minHeight: "100dvh",
  },
});

function App() {
  return (
    <main {...stylex.props(styles.root)}>
      <h1>Hello world</h1>
      <Button>Shared UI is ready</Button>
    </main>
  );
}

export default App;
