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
import { Code } from "@repo/ui/code";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@repo/ui/native-select";
import { themeStyles } from "@repo/ui/theme-styles";
import { colors, radii } from "@repo/ui/tokens.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

const styles = stylex.create({
  root: {
    paddingBlock: "3rem",
    paddingInline: "1.5rem",
  },
  page: {
    display: "grid",
    gap: "3rem",
    marginInline: "auto",
    maxWidth: "56rem",
    width: "100%",
  },
  introduction: {
    display: "grid",
    gap: "0.5rem",
  },
  eyebrow: {
    color: colors.mutedForeground,
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
    color: colors.mutedForeground,
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "38rem",
  },
  list: {
    display: "grid",
    gap: "3rem",
  },
  section: {
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: "1px",
    display: "grid",
    gap: "1.25rem",
    paddingBlockEnd: "3rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    letterSpacing: "-0.01em",
    margin: 0,
  },
  preview: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  stack: {
    display: "grid",
    gap: "0.75rem",
  },
  variantGroup: {
    display: "grid",
    gap: "0.5rem",
  },
  variantLabel: {
    color: colors.mutedForeground,
    fontSize: "0.75rem",
    fontWeight: 600,
    margin: 0,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: radii.xxxl,
    maxWidth: "34rem",
    width: "100%",
  },
  cardFooter: {
    justifyContent: "flex-end",
  },
  field: {
    display: "grid",
    gap: "0.5rem",
    maxWidth: "20rem",
    width: "100%",
  },
  validationMessage: {
    color: colors.destructive,
    fontSize: "0.75rem",
  },
  codeExample: {
    lineHeight: 1.5,
    margin: 0,
  },
});

interface ShowcaseSectionProps {
  children: ReactNode;
  name: string;
}

function ShowcaseSection({ children, name }: ShowcaseSectionProps) {
  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.sectionTitle)}>{name}</h2>
      {children}
    </section>
  );
}

function App() {
  return (
    <main {...stylex.props(themeStyles.root, styles.root)}>
      <div {...stylex.props(styles.page)}>
        <header {...stylex.props(styles.introduction)}>
          <p {...stylex.props(styles.eyebrow)}>@repo/ui</p>
          <h1 {...stylex.props(styles.heading)}>Component showcase</h1>
          <p {...stylex.props(styles.summary)}>
            A minimal, single-page inventory of the shared components and their
            public variants.
          </p>
        </header>

        <div {...stylex.props(styles.list)}>
          <ShowcaseSection name="Alert">
            <div {...stylex.props(styles.stack)}>
              <Alert>
                <AlertTitle>Default alert</AlertTitle>
                <AlertDescription>
                  Useful information for the current workflow.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Destructive alert</AlertTitle>
                <AlertDescription>
                  Something needs attention before continuing.
                </AlertDescription>
              </Alert>
            </div>
          </ShowcaseSection>

          <ShowcaseSection name="Badge">
            <div {...stylex.props(styles.preview)}>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </ShowcaseSection>

          <ShowcaseSection name="Button">
            <div {...stylex.props(styles.stack)}>
              <div {...stylex.props(styles.variantGroup)}>
                <p {...stylex.props(styles.variantLabel)}>Variants</p>
                <div {...stylex.props(styles.preview)}>
                  <Button>Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              <div {...stylex.props(styles.variantGroup)}>
                <p {...stylex.props(styles.variantLabel)}>Sizes</p>
                <div {...stylex.props(styles.preview)}>
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                  <Button aria-label="Small icon button" size="icon-sm">
                    +
                  </Button>
                  <Button aria-label="Default icon button" size="icon">
                    +
                  </Button>
                  <Button aria-label="Large icon button" size="icon-lg">
                    +
                  </Button>
                </div>
              </div>
            </div>
          </ShowcaseSection>

          <ShowcaseSection name="Card">
            <Card style={styles.card}>
              <CardHeader>
                <CardTitle>ISS-0001</CardTitle>
                <CardDescription>
                  A composed card with header, content, and footer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Card content can contain any issue details or controls.
              </CardContent>
              <CardFooter style={styles.cardFooter}>
                <Button size="sm">Open issue</Button>
              </CardFooter>
            </Card>
          </ShowcaseSection>

          <ShowcaseSection name="Code">
            <p {...stylex.props(styles.codeExample)}>
              Run <Code>pnpm build</Code> to create a production bundle.
            </p>
          </ShowcaseSection>

          <ShowcaseSection name="Input">
            <div {...stylex.props(styles.stack)}>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor="input-default">Default</Label>
                <Input id="input-default" placeholder="Search issues" />
              </div>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor="input-disabled">Disabled</Label>
                <Input
                  defaultValue="Unavailable"
                  disabled
                  id="input-disabled"
                />
              </div>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor="input-invalid">Invalid</Label>
                <Input
                  aria-describedby="input-invalid-message"
                  aria-invalid="true"
                  defaultValue="Unknown issue"
                  id="input-invalid"
                />
                <span
                  id="input-invalid-message"
                  {...stylex.props(styles.validationMessage)}
                >
                  Enter a valid issue ID.
                </span>
              </div>
            </div>
          </ShowcaseSection>

          <ShowcaseSection name="Label">
            <div {...stylex.props(styles.field)}>
              <Label htmlFor="label-example">Associated label</Label>
              <Input id="label-example" placeholder="Labeled control" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection name="NativeSelect">
            <div {...stylex.props(styles.preview)}>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor="select-default">Default</Label>
                <NativeSelect defaultValue="high" id="select-default">
                  <NativeSelectOption value="high">High</NativeSelectOption>
                  <NativeSelectOption value="medium">Medium</NativeSelectOption>
                  <NativeSelectOption value="low">Low</NativeSelectOption>
                </NativeSelect>
              </div>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor="select-small">Small</Label>
                <NativeSelect defaultValue="medium" id="select-small" size="sm">
                  <NativeSelectOption value="high">High</NativeSelectOption>
                  <NativeSelectOption value="medium">Medium</NativeSelectOption>
                  <NativeSelectOption value="low">Low</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>
          </ShowcaseSection>
        </div>
      </div>
    </main>
  );
}

export default App;
