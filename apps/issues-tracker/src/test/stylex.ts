export function create<Styles extends Record<string, unknown>>(
  styles: Styles,
): Styles {
  return styles;
}

export function defineConsts<Constants extends Record<string, string>>(
  constants: Constants,
): Constants {
  return constants;
}

export function defineVars<Variables extends Record<string, string>>(
  variables: Variables,
): Variables {
  return variables;
}

export function props(...styles: readonly unknown[]): Record<string, never> {
  void styles;
  return {};
}
