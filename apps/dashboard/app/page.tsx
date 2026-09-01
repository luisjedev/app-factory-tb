import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { ArrowRight } from "@repo/ui/icons";
import { colors, effects, radii } from "@repo/ui/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

const modules = [
  {
    name: "Dashboard",
    technicalName: "dashboard",
    description:
      "Punto de entrada local para conocer la fábrica y acceder a sus herramientas.",
  },
  {
    name: "Sistema de diseño",
    technicalName: "ui-catalog",
    description:
      "Catálogo visual de los componentes, temas y tokens compartidos de @repo/ui.",
    href: "http://localhost:3001",
  },
  {
    name: "Gestor de tareas",
    technicalName: "issues-tracker",
    description:
      "Tablero de solo lectura para consultar las issues y planes Markdown del monorepo.",
    href: "http://localhost:3002",
  },
] as const;

const stack = ["Turborepo", "pnpm", "TypeScript", "React", "Next.js"];

const styles = stylex.create({
  page: {
    marginInline: "auto",
    maxWidth: "76rem",
    minHeight: "100vh",
    paddingBlock: {
      default: "3rem",
      "@media (min-width: 48rem)": "5rem",
    },
    paddingInline: {
      default: "1rem",
      "@media (min-width: 48rem)": "2rem",
    },
    width: "100%",
  },
  hero: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    maxWidth: "50rem",
  },
  heading: {
    fontSize: {
      default: "2.5rem",
      "@media (min-width: 48rem)": "4.5rem",
    },
    marginTop: 0,
    marginBottom: 20,
    fontWeight: 700,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    textWrap: "balance",
  },
  section: {
    marginTop: {
      default: "1rem",
      "@media (min-width: 48rem)": "3rem",
    },
  },
  sectionHeading: {
    fontSize: "1.5rem",
    fontWeight: 650,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
    marginBottom: "1.25rem",
  },
  stackList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    listStyle: "none",
  },
  modulesGrid: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      "@media (min-width: 48rem)": "repeat(3, minmax(0, 1fr))",
    },
  },
  moduleCard: {
    height: "100%",
    minWidth: 0,
  },
  featuredCard: {
    borderColor: colors.ring,
  },
  cardHeader: {
    gap: "0.75rem",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  cardHeading: {
    fontSize: "1.125rem",
    lineHeight: 1.35,
  },
  cardDescription: {
    color: colors.mutedForeground,
    lineHeight: 1.6,
  },
  cardFooter: {
    marginTop: "auto",
  },
  moduleLink: {
    alignItems: "center",
    backgroundColor: {
      default: colors.primary,
      ":hover": colors.accentForeground,
    },
    borderRadius: radii.md,
    boxShadow: {
      default: "none",
      ":focus-visible": effects.focusRingShadow,
    },
    color: colors.primaryForeground,
    display: "inline-flex",
    fontSize: "0.875rem",
    fontWeight: 600,
    justifyContent: "space-between",
    outline: "none",
    overflowWrap: "anywhere",
    paddingBlock: "0.75rem",
    paddingInline: "1rem",
    textDecoration: "none",
    transitionDuration: "150ms",
    transitionProperty: "background-color, box-shadow",
    transitionTimingFunction: "ease",
    width: "100%",
  },
  arrow: {
    flexShrink: 0,
    height: "1rem",
    marginLeft: "0.75rem",
    width: "1rem",
  },
});

export default function Home() {
  return (
    <main {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.hero)}>
        <h1 {...stylex.props(styles.heading)}>Bienvenido a App Factory</h1>
      </header>

      <section {...stylex.props(styles.section)} aria-labelledby="stack-title">
        <h2 id="stack-title" {...stylex.props(styles.sectionHeading)}>
          Stack principal
        </h2>
        <ul {...stylex.props(styles.stackList)}>
          {stack.map((technology) => (
            <li key={technology}>
              <Badge variant="secondary">{technology}</Badge>
            </li>
          ))}
        </ul>
      </section>

      <section
        {...stylex.props(styles.section)}
        aria-labelledby="modules-title"
      >
        <h2 id="modules-title" {...stylex.props(styles.sectionHeading)}>
          Aplicaciones de la fábrica
        </h2>
        <div {...stylex.props(styles.modulesGrid)}>
          {modules.map((module) => (
            <Card
              key={module.name}
              style={[
                styles.moduleCard,
                "href" in module && styles.featuredCard,
              ]}
            >
              <CardHeader style={styles.cardHeader}>
                <div {...stylex.props(styles.badgeRow)}>
                  <Badge variant="outline">{module.technicalName}</Badge>
                  {"href" in module && <Badge>Acceso local</Badge>}
                </div>
                <CardTitle>
                  <h3 {...stylex.props(styles.cardHeading)}>{module.name}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p {...stylex.props(styles.cardDescription)}>
                  {module.description}
                </p>
              </CardContent>
              {"href" in module && (
                <CardFooter style={styles.cardFooter}>
                  <a href={module.href} {...stylex.props(styles.moduleLink)}>
                    Abrir {module.name.toLocaleLowerCase("es")}
                    <ArrowRight
                      {...stylex.props(styles.arrow)}
                      aria-hidden="true"
                    />
                  </a>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
