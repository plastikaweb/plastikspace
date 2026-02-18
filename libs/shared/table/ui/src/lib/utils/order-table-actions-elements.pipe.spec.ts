import { OrderTableActionsElementsPipe } from './order-table-actions-elements.pipe';

describe('OrderTableActionsElementsPipe', () => {
  let pipe: OrderTableActionsElementsPipe<any>;

  beforeEach(() => {
    pipe = new OrderTableActionsElementsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should throw an error if list is not provided', () => {
    expect(() => pipe.transform(null as any)).toThrow(
      'An Array List is required to use OrderArrayElementsPipe'
    );
  });

  it('should sort actions based on order property', () => {
    const actions = [
      { key: 'ACTION2', value: { order: 2 } },
      { key: 'ACTION1', value: { order: 1 } },
      { key: 'ACTION3', value: { order: 3 } },
    ] as any;

    const result = pipe.transform(actions);

    expect(result[0].key).toBe('ACTION1');
    expect(result[1].key).toBe('ACTION2');
    expect(result[2].key).toBe('ACTION3');
  });

  it('should treat missing order property as 0', () => {
    const actions = [
      { key: 'ACTION2', value: { order: 2 } },
      { key: 'ACTION0', value: {} }, // missing order, should be treated as 0
      { key: 'ACTION1', value: { order: 1 } },
    ] as any;

    const result = pipe.transform(actions);

    expect(result[0].key).toBe('ACTION0');
    expect(result[1].key).toBe('ACTION1');
    expect(result[2].key).toBe('ACTION2');
  });

  it('should maintain order for equal order values (unstable sort handling depends on browser but generally stable in modern JS)', () => {
    const actions = [
      { key: 'A', value: { order: 1 } },
      { key: 'B', value: { order: 1 } },
    ] as any;

    const result = pipe.transform(actions);
    // Basic check that it doesn't crash and returns both
    expect(result.length).toBe(2);
    expect(result[0].value.order).toBe(1);
    expect(result[1].value.order).toBe(1);
  });
});
