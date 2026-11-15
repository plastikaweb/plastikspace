import ca from '../../public/i18n/ca.json';
import es from '../../public/i18n/es.json';

type TranslationTree = { [key: string]: string | TranslationTree };

/**
 * Flattens a translation file into its dotted leaf keys.
 * @param {TranslationTree} tree The translation object, or one of its branches.
 * @param {string} prefix The dotted path of the branch.
 * @returns {string[]} Every leaf key under the branch, sorted.
 */
function leafKeys(tree: TranslationTree, prefix = ''): string[] {
  return Object.entries(tree)
    .flatMap(([key, value]) =>
      typeof value === 'string' ? [`${prefix}${key}`] : leafKeys(value, `${prefix}${key}.`)
    )
    .sort();
}

/**
 * Lists the ICU placeholders of a translation, so a renamed argument is caught too.
 * @param {TranslationTree} tree The translation object.
 * @returns {Record<string, string[]>} The placeholder names of each leaf key.
 */
function placeholders(tree: TranslationTree): Record<string, string[]> {
  const flat: Record<string, string[]> = {};

  /**
   * Walks one branch.
   * @param {TranslationTree} branch The branch to walk.
   * @param {string} prefix The dotted path of the branch.
   */
  function walk(branch: TranslationTree, prefix: string): void {
    for (const [key, value] of Object.entries(branch)) {
      if (typeof value === 'string') {
        flat[`${prefix}${key}`] = [...value.matchAll(/\{(\w+)/g)].map(match => match[1]).sort();
      } else {
        walk(value, `${prefix}${key}.`);
      }
    }
  }

  walk(tree, '');

  return flat;
}

// `tools/scripts/validate-i18n-keys.cjs` only reports keys the code uses and the source file
// lacks. It does not compare the two languages, so that check lives here.
describe('eco-admin translation files', () => {
  it('hold the same keys in Catalan and Spanish', () => {
    expect(leafKeys(es)).toEqual(leafKeys(ca));
  });

  it('use the same placeholders in both languages', () => {
    expect(placeholders(es)).toEqual(placeholders(ca));
  });
});
