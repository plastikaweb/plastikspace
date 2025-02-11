import { addSearchInput } from './input-search-util';

describe('addSearchInput', () => {
  it('should return a FormlyFieldConfig with default properties', () => {
    const label = 'Search';
    const config = addSearchInput({ label });
    expect(config.key).toBe('text');
    expect(config.type).toBe('input');
    expect(config.defaultValue).toBe('');
    expect(config.className).toBe('w-full');
    expect(config.props?.label).toBe(label);
    expect(config.props?.type).toBe('search');
    expect(config.props?.placeholder).toBe(label);
    expect(config.props?.['addonLeft']?.icon).toBe('search');
    expect(config.props?.['addonRight']?.icon).toBe('cancel');
  });
});
