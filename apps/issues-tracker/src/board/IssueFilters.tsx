import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@repo/ui/native-select";
import * as stylex from "@stylexjs/stylex";
import { mediaQueries } from "../media.stylex";
import type { Issue } from "../issues/types";

export interface IssueFilterValue {
  readonly app: string;
  readonly priority: Issue["priority"] | "";
  readonly query: string;
  readonly type: Issue["type"] | "";
}

type IssueFiltersProps = {
  readonly apps: readonly string[];
  readonly onChange: (value: IssueFilterValue) => void;
  readonly onReset: () => void;
  readonly value: IssueFilterValue;
};

const styles = stylex.create({
  controls: {
    alignItems: "end",
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [mediaQueries.desktop]:
        "minmax(16rem, 2fr) repeat(3, minmax(9rem, 1fr)) auto",
    },
    marginBlockEnd: "1.5rem",
  },
  field: {
    display: "grid",
    gap: "0.5rem",
    minWidth: 0,
  },
  resetButton: {
    width: {
      default: "100%",
      [mediaQueries.desktop]: "auto",
    },
  },
});

function isIssueType(value: string): value is Issue["type"] {
  return value === "feature" || value === "fix" || value === "chore";
}

function isIssuePriority(value: string): value is Issue["priority"] {
  return value === "high" || value === "medium" || value === "low";
}

export function IssueFilters({
  apps,
  onChange,
  onReset,
  value,
}: IssueFiltersProps) {
  return (
    <div {...stylex.props(styles.controls)}>
      <div {...stylex.props(styles.field)}>
        <Label htmlFor="issue-search">Buscar issues</Label>
        <Input
          id="issue-search"
          onChange={(event) =>
            onChange({ ...value, query: event.currentTarget.value })
          }
          placeholder="ID o título"
          type="search"
          value={value.query}
        />
      </div>
      <div {...stylex.props(styles.field)}>
        <Label htmlFor="app-filter">Aplicación</Label>
        <NativeSelect
          id="app-filter"
          onChange={(event) => {
            const app = event.currentTarget.value;
            onChange({ ...value, app: apps.includes(app) ? app : "" });
          }}
          value={value.app}
        >
          <NativeSelectOption value="">Todas</NativeSelectOption>
          {apps.map((app) => (
            <NativeSelectOption key={app} value={app}>
              {app}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div {...stylex.props(styles.field)}>
        <Label htmlFor="type-filter">Tipo</Label>
        <NativeSelect
          id="type-filter"
          onChange={(event) => {
            const type = event.currentTarget.value;
            onChange({ ...value, type: isIssueType(type) ? type : "" });
          }}
          value={value.type}
        >
          <NativeSelectOption value="">Todos</NativeSelectOption>
          <NativeSelectOption value="feature">Feature</NativeSelectOption>
          <NativeSelectOption value="fix">Fix</NativeSelectOption>
          <NativeSelectOption value="chore">Chore</NativeSelectOption>
        </NativeSelect>
      </div>
      <div {...stylex.props(styles.field)}>
        <Label htmlFor="priority-filter">Prioridad</Label>
        <NativeSelect
          id="priority-filter"
          onChange={(event) => {
            const priority = event.currentTarget.value;
            onChange({
              ...value,
              priority: isIssuePriority(priority) ? priority : "",
            });
          }}
          value={value.priority}
        >
          <NativeSelectOption value="">Todas</NativeSelectOption>
          <NativeSelectOption value="high">Alta</NativeSelectOption>
          <NativeSelectOption value="medium">Media</NativeSelectOption>
          <NativeSelectOption value="low">Baja</NativeSelectOption>
        </NativeSelect>
      </div>
      <Button onClick={onReset} style={styles.resetButton} variant="outline">
        Restablecer filtros
      </Button>
    </div>
  );
}
