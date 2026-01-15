import { Action, Reaction } from '../index';

describe('Integrations Definitions Index', () => {
  it('should export Action, Reaction, and Service', () => {
    expect(Action).toBeDefined();
    expect(Reaction).toBeDefined();
    // Service is a type, so we can't check it at runtime, but if the import works, it's good.
  });
});
