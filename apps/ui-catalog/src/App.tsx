import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
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
import { Plus } from "@repo/ui/icons";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { NativeSelect, NativeSelectOption } from "@repo/ui/native-select";
import { themeStyles } from "@repo/ui/theme-styles";
import { colors, radii } from "@repo/ui/tokens.stylex";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState, type ReactNode } from "react";
import { mediaQueries } from "./media.stylex";

const componentSections = [
  { id: "alert", name: "Alert" },
  { id: "badge", name: "Badge" },
  { id: "button", name: "Button" },
  { id: "card", name: "Card" },
  { id: "code", name: "Code" },
  { id: "input", name: "Input" },
  { id: "label", name: "Label" },
  { id: "native-select", name: "NativeSelect" },
] as const;

type ComponentSectionId = (typeof componentSections)[number]["id"];

const styles = stylex.create({
  root: {
    backgroundColor: colors.background,
    backgroundImage: `linear-gradient(180deg, ${colors.muted} 0, ${colors.background} 24rem)`,
    paddingBlock: {
      default: "4rem",
      [mediaQueries.compact]: "2rem",
    },
    paddingInline: {
      default: "2rem",
      [mediaQueries.compact]: "1rem",
    },
  },
  page: {
    display: "grid",
    gap: {
      default: "4rem",
      [mediaQueries.compact]: "2.5rem",
    },
    marginInline: "auto",
    maxWidth: "76rem",
    width: "100%",
  },
  introduction: {
    alignItems: "end",
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: "1px",
    display: "grid",
    gap: "1.5rem",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) auto",
      [mediaQueries.narrow]: "minmax(0, 1fr)",
    },
    paddingBlockEnd: "2rem",
  },
  introductionCopy: {
    display: "grid",
    gap: "0.75rem",
  },
  eyebrow: {
    color: colors.mutedForeground,
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    margin: 0,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: {
      default: "3.5rem",
      [mediaQueries.compact]: "2.5rem",
    },
    fontWeight: 700,
    letterSpacing: "-0.055em",
    lineHeight: 0.95,
    margin: 0,
  },
  summary: {
    color: colors.mutedForeground,
    fontSize: "1rem",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: "40rem",
  },
  count: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.xxxl,
    borderStyle: "solid",
    borderWidth: "1px",
    color: colors.mutedForeground,
    fontSize: "0.8125rem",
    fontWeight: 600,
    paddingBlock: "0.55rem",
    paddingInline: "0.9rem",
    whiteSpace: "nowrap",
  },
  layout: {
    alignItems: "start",
    display: "grid",
    gap: {
      default: "4rem",
      [mediaQueries.compact]: "2.5rem",
    },
    gridTemplateColumns: {
      default: "12rem minmax(0, 1fr)",
      [mediaQueries.compact]: "minmax(0, 1fr)",
    },
  },
  sidebar: {
    alignSelf: "start",
    backgroundColor: {
      default: "transparent",
      [mediaQueries.compact]: colors.background,
    },
    borderBlockEndColor: {
      default: "transparent",
      [mediaQueries.compact]: colors.border,
    },
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: "1px",
    overflowX: {
      default: "visible",
      [mediaQueries.compact]: "auto",
    },
    paddingBlock: {
      default: 0,
      [mediaQueries.compact]: "0.75rem",
    },
    position: "sticky",
    top: {
      default: "2rem",
      [mediaQueries.compact]: 0,
    },
    zIndex: 10,
  },
  sidebarLabel: {
    color: colors.mutedForeground,
    display: {
      default: "block",
      [mediaQueries.compact]: "none",
    },
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    marginBlockEnd: "0.75rem",
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: "0.875rem",
    textTransform: "uppercase",
  },
  navigationList: {
    display: {
      default: "grid",
      [mediaQueries.compact]: "flex",
    },
    gap: {
      default: "0.125rem",
      [mediaQueries.compact]: "0.25rem",
    },
    listStyle: "none",
    margin: 0,
    padding: 0,
    width: "max-content",
  },
  navigationLink: {
    borderInlineStartColor: "transparent",
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: "2px",
    color: {
      default: colors.mutedForeground,
      ":hover": colors.foreground,
    },
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 450,
    lineHeight: 1.25,
    outlineColor: {
      default: "transparent",
      ":focus-visible": colors.ring,
    },
    outlineOffset: "2px",
    outlineStyle: {
      default: "none",
      ":focus-visible": "solid",
    },
    outlineWidth: {
      default: 0,
      ":focus-visible": "2px",
    },
    paddingBlock: "0.55rem",
    paddingInline: "0.75rem",
    textDecoration: "none",
    transitionDuration: {
      default: "160ms",
      [mediaQueries.reducedMotion]: "0ms",
    },
    transitionProperty: "color, border-color, font-size, font-weight",
    transitionTimingFunction: "ease",
    whiteSpace: "nowrap",
  },
  navigationLinkActive: {
    borderInlineStartColor: colors.foreground,
    color: colors.foreground,
    fontSize: "1rem",
    fontWeight: 700,
  },
  list: {
    display: "grid",
    gap: {
      default: "6rem",
      [mediaQueries.compact]: "4.5rem",
    },
    minWidth: 0,
    paddingBlockEnd: "30vh",
  },
  section: {
    display: "grid",
    gap: "1.5rem",
    scrollMarginTop: "6rem",
  },
  sectionHeader: {
    alignItems: "baseline",
    display: "flex",
    gap: "0.75rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: 650,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
    margin: 0,
  },
  sectionAnchor: {
    color: colors.mutedForeground,
    fontSize: "0.8125rem",
    textDecoration: "none",
  },
  componentPreview: {
    alignItems: "flex-start",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.xxxl,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: "0 16px 48px rgb(0 0 0 / 0.04)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "10rem",
    overflow: "hidden",
    padding: {
      default: "2rem",
      [mediaQueries.narrow]: "1.25rem",
    },
  },
  preview: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    width: "100%",
  },
  buttonIcon: {
    height: "1rem",
    width: "1rem",
  },
  stack: {
    display: "grid",
    gap: "1rem",
    width: "100%",
  },
  variantGroup: {
    display: "grid",
    gap: "0.75rem",
  },
  variantLabel: {
    color: colors.mutedForeground,
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
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
  id: ComponentSectionId;
  name: string;
}

function ShowcaseSection({ children, id, name }: ShowcaseSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section
      {...stylex.props(styles.section)}
      aria-labelledby={titleId}
      id={id}
    >
      <div {...stylex.props(styles.sectionHeader)}>
        <h2 {...stylex.props(styles.sectionTitle)} id={titleId}>
          {name}
        </h2>
        <a
          {...stylex.props(styles.sectionAnchor)}
          aria-label={`Link to ${name}`}
          href={`#${id}`}
        >
          #
        </a>
      </div>
      <div {...stylex.props(styles.componentPreview)}>{children}</div>
    </section>
  );
}

function App() {
  const [activeSection, setActiveSection] =
    useState<ComponentSectionId>("alert");

  useEffect(() => {
    let animationFrameId: number | undefined;

    const updateActiveSection = () => {
      const activationOffset = Math.min(window.innerHeight * 0.28, 180);
      let currentSection: ComponentSectionId = "alert";

      for (const section of componentSections) {
        const element = document.getElementById(section.id);

        if (
          element &&
          element.getBoundingClientRect().top <= activationOffset
        ) {
          currentSection = section.id;
        }
      }

      const isAtPageEnd =
        Math.ceil(window.scrollY + window.innerHeight) >=
        document.documentElement.scrollHeight - 2;

      setActiveSection(isAtPageEnd ? "native-select" : currentSection);
    };

    const scheduleUpdate = () => {
      if (animationFrameId !== undefined) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        updateActiveSection();
        animationFrameId = undefined;
      });
    };

    updateActiveSection();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);

      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <main {...stylex.props(themeStyles.root, styles.root)}>
      <div {...stylex.props(styles.page)}>
        <header {...stylex.props(styles.introduction)}>
          <div {...stylex.props(styles.introductionCopy)}>
            <p {...stylex.props(styles.eyebrow)}>@repo/ui</p>
            <h1 {...stylex.props(styles.heading)}>UI Catalog</h1>
            <p {...stylex.props(styles.summary)}>
              A living inventory of the shared components, their variants, and
              the patterns available to every application in the project.
            </p>
          </div>
          <span {...stylex.props(styles.count)}>
            {componentSections.length} components
          </span>
        </header>

        <div {...stylex.props(styles.layout)}>
          <aside {...stylex.props(styles.sidebar)}>
            <nav aria-label="Component index">
              <p {...stylex.props(styles.sidebarLabel)}>Components</p>
              <ul {...stylex.props(styles.navigationList)}>
                {componentSections.map((section) => {
                  const isActive = activeSection === section.id;

                  return (
                    <li key={section.id}>
                      <a
                        {...stylex.props(
                          styles.navigationLink,
                          isActive && styles.navigationLinkActive,
                        )}
                        aria-current={isActive ? "location" : undefined}
                        href={`#${section.id}`}
                      >
                        {section.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <div {...stylex.props(styles.list)}>
            <ShowcaseSection id="alert" name="Alert">
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

            <ShowcaseSection id="badge" name="Badge">
              <div {...stylex.props(styles.preview)}>
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </ShowcaseSection>

            <ShowcaseSection id="button" name="Button">
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
                      <Plus
                        {...stylex.props(styles.buttonIcon)}
                        aria-hidden="true"
                      />
                    </Button>
                    <Button aria-label="Default icon button" size="icon">
                      <Plus
                        {...stylex.props(styles.buttonIcon)}
                        aria-hidden="true"
                      />
                    </Button>
                    <Button aria-label="Large icon button" size="icon-lg">
                      <Plus
                        {...stylex.props(styles.buttonIcon)}
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </ShowcaseSection>

            <ShowcaseSection id="card" name="Card">
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

            <ShowcaseSection id="code" name="Code">
              <p {...stylex.props(styles.codeExample)}>
                Run <Code>pnpm build</Code> to create a production bundle.
              </p>
            </ShowcaseSection>

            <ShowcaseSection id="input" name="Input">
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

            <ShowcaseSection id="label" name="Label">
              <div {...stylex.props(styles.field)}>
                <Label htmlFor="label-example">Associated label</Label>
                <Input id="label-example" placeholder="Labeled control" />
              </div>
            </ShowcaseSection>

            <ShowcaseSection id="native-select" name="NativeSelect">
              <div {...stylex.props(styles.preview)}>
                <div {...stylex.props(styles.field)}>
                  <Label htmlFor="select-default">Default</Label>
                  <NativeSelect defaultValue="high" id="select-default">
                    <NativeSelectOption value="high">High</NativeSelectOption>
                    <NativeSelectOption value="medium">
                      Medium
                    </NativeSelectOption>
                    <NativeSelectOption value="low">Low</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div {...stylex.props(styles.field)}>
                  <Label htmlFor="select-small">Small</Label>
                  <NativeSelect
                    defaultValue="medium"
                    id="select-small"
                    size="sm"
                  >
                    <NativeSelectOption value="high">High</NativeSelectOption>
                    <NativeSelectOption value="medium">
                      Medium
                    </NativeSelectOption>
                    <NativeSelectOption value="low">Low</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
            </ShowcaseSection>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
