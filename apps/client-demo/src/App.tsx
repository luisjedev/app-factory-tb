import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/alert";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@repo/ui/native-select";
import { themeStyles } from "@repo/ui/theme-styles";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  root: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    paddingBlock: "3rem",
    paddingInline: "1.5rem",
  },
  page: {
    display: "grid",
    gap: "1.5rem",
    maxWidth: "44rem",
    width: "100%",
  },
  introduction: {
    display: "grid",
    gap: "0.5rem",
  },
  eyebrow: {
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    margin: 0,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: "2rem",
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
    margin: 0,
  },
  summary: {
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "38rem",
  },
  metadata: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  form: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) minmax(0, 1fr)",
      "@media (max-width: 640px)": "minmax(0, 1fr)",
    },
  },
  field: {
    display: "grid",
    gap: "0.5rem",
  },
  footer: {
    justifyContent: "flex-end",
  },
});

function App() {
  return (
    <main {...stylex.props(themeStyles.root, styles.root)}>
      <div {...stylex.props(styles.page)}>
        <header {...stylex.props(styles.introduction)}>
          <p {...stylex.props(styles.eyebrow)}>Shared UI</p>
          <h1 {...stylex.props(styles.heading)}>Issue board primitives</h1>
          <p {...stylex.props(styles.summary)}>
            This Vite consumer compiles reusable StyleX components directly
            from the workspace package.
          </p>
        </header>

        <Alert>
          <AlertTitle>Components ready for composition</AlertTitle>
          <AlertDescription>
            Native controls preserve browser semantics, keyboard behavior, and
            accessible labels.
          </AlertDescription>
        </Alert>

        <Card aria-labelledby="issue-title" className="client-demo-card">
          <CardHeader>
            <div {...stylex.props(styles.metadata)}>
              <Badge>ISS-0001</Badge>
              <Badge variant="secondary">Feature</Badge>
              <Badge variant="outline">High priority</Badge>
            </div>
            <CardTitle id="issue-title">
              Expand the shared UI package
            </CardTitle>
            <CardDescription>
              A representative card for the Markdown issue board.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form {...stylex.props(styles.form)}>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor="search">Search issues</Label>
                <Input id="search" name="search" placeholder="ISS-0001" />
              </div>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor="priority">Priority</Label>
                <NativeSelect defaultValue="high" id="priority" name="priority">
                  <NativeSelectOption value="high">High</NativeSelectOption>
                  <NativeSelectOption value="medium">Medium</NativeSelectOption>
                  <NativeSelectOption value="low">Low</NativeSelectOption>
                </NativeSelect>
              </div>
            </form>
          </CardContent>

          <CardFooter {...stylex.props(styles.footer)}>
            <Button>Open issue</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

export default App;
