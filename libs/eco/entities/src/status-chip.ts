import { SharedChipType } from '@plastik/shared/entities';

/** What a status chip draws for one state: its colour family and its Material Symbols icon. */
export interface EcoStatusChipConfig {
  type: SharedChipType;
  icon: string;
}

/** One state of a family as a select option, with its chip. */
export interface EcoStatusChipOption<S extends string> {
  value: S;
  label: string;
  icon: string;
  type: SharedChipType;
}

/** The maps a status family exports, all derived from one config. */
export interface EcoStatusChipMaps<S extends string> {
  labels: Record<S, string>;
  icons: Record<S, string>;
  types: Record<S, SharedChipType>;
  options: EcoStatusChipOption<S>[];
}

/**
 * Builds the label, icon, type and option maps of a status family from one config.
 * The label is the translation key `<labelPrefix>.<state in lower case>`, as the order family
 * does; each app that renders the family translates it.
 * @param {readonly S[]} states The states, in display order.
 * @param {Record<S, EcoStatusChipConfig>} config The chip of each state.
 * @param {string} labelPrefix The translation key the labels start with.
 * @returns {EcoStatusChipMaps<S>} The four maps.
 */
export function ecoStatusChipMaps<S extends string>(
  states: readonly S[],
  config: Record<S, EcoStatusChipConfig>,
  labelPrefix: string
): EcoStatusChipMaps<S> {
  const label = (state: S) => `${labelPrefix}.${state.toLowerCase()}`;
  const byState = <V>(pick: (state: S) => V) =>
    Object.fromEntries(states.map(state => [state, pick(state)])) as Record<S, V>;

  return {
    labels: byState(label),
    icons: byState(state => config[state].icon),
    types: byState(state => config[state].type),
    options: states.map(state => ({
      value: state,
      label: label(state),
      icon: config[state].icon,
      type: config[state].type,
    })),
  };
}
