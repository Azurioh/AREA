import type { IAction } from '@area/shared/types/services.types';
import type { ActionPayload } from '@/types/action-reaction';
import { ServiceManager } from '../../_manager/service.manager';
import { Reaction } from '../reaction.interface';

class TestReaction extends Reaction {}

describe('Reaction', () => {
  describe('parseActionVariables', () => {
    beforeEach(() => {});

    const mockAction: IAction = {
      name: 'test-action',
      description: 'Test Action',
      params: [],
      refreshParams: jest.fn(),
      returnedValues: [
        { key: 'user.name', path: 'user.name', description: 'User Name', type: 'string' },
        { key: 'repo.id', path: 'repository.id', description: 'Repo ID', type: 'string' },
      ],
    };

    it('should return inputs unchanged if action is not found', () => {
      jest.spyOn(ServiceManager.instance, 'get').mockReturnValueOnce(undefined);

      const issuedAction: Omit<ActionPayload, 'trigger'> = {
        service: 'unknown-service' as any,
        name: 'unknown-action',
        content: {},
      };

      const inputs = [`Hello \${user.name}`];

      const result = TestReaction.parseActionVariables(issuedAction, inputs);

      expect(result).toEqual(inputs);
    });

    it('should replace variables correctly', () => {
      jest.spyOn(ServiceManager.instance, 'get').mockReturnValueOnce({
        name: 'test-service',
        actions: [mockAction],
        reactions: [],
      });

      const issuedAction: Omit<ActionPayload, 'trigger'> = {
        service: 'test-service' as any,
        name: 'test-action',
        content: {
          user: { name: 'Alice' },
          repository: { id: 123 },
        },
      };

      const inputs = [`Hello \${user.name}`, `Repo ID: \${repo.id}`];

      const result = TestReaction.parseActionVariables(issuedAction, inputs);

      expect(result).toEqual(['Hello Alice', 'Repo ID: 123']);
    });

    it('should handle undefined values gracefully', () => {
      jest.spyOn(ServiceManager.instance, 'get').mockReturnValueOnce({
        name: 'test-service',
        actions: [mockAction],
        reactions: [],
      });

      const issuedAction: Omit<ActionPayload, 'trigger'> = {
        service: 'test-service' as any,
        name: 'test-action',
        content: {},
      };

      const inputs = [`Hello \${user.name}`];

      const result = TestReaction.parseActionVariables(issuedAction, inputs);

      expect(result).toEqual(['Hello undefined']);
    });

    it('should handle nested paths correctly', () => {
      jest.spyOn(ServiceManager.instance, 'get').mockReturnValueOnce({
        name: 'test-service',
        actions: [mockAction],
        reactions: [],
      });

      const issuedAction: Omit<ActionPayload, 'trigger'> = {
        service: 'test-service' as any,
        name: 'test-action',
        content: {
          repository: { id: 999 },
          user: { name: 'Bob' },
        },
      };

      const inputs = [`\${repo.id}`];
      const result = TestReaction.parseActionVariables(issuedAction, inputs);
      expect(result).toEqual(['999']);
    });

    it('should return undefined string for invalid paths in getValueInObject', () => {
      jest.spyOn(ServiceManager.instance, 'get').mockReturnValueOnce({
        name: 'test-service',
        actions: [mockAction],
        reactions: [],
      });

      const issuedAction: Omit<ActionPayload, 'trigger'> = {
        service: 'test-service' as any,
        name: 'test-action',
        content: {
          user: { name: 'Alice' },
        },
      };

      const mockActionInvalidPath: IAction = {
        ...mockAction,
        returnedValues: [{ key: 'invalid.path', path: 'user.address.street', description: 'Address', type: 'string' }],
      };

      jest
        .spyOn(ServiceManager.instance, 'get')
        .mockReset()
        .mockReturnValueOnce({
          name: 'test-service',
          actions: [mockActionInvalidPath],
          reactions: [],
        });

      const inputs = [`\${invalid.path}`];
      const result = TestReaction.parseActionVariables(issuedAction, inputs);
      expect(result).toEqual(['undefined']);
    });

    it('should return undefined for malformed paths (leading dot)', () => {
      jest.spyOn(ServiceManager.instance, 'get').mockReturnValueOnce({
        name: 'test-service',
        actions: [mockAction],
        reactions: [],
      });

      const issuedAction: Omit<ActionPayload, 'trigger'> = {
        service: 'test-service' as any,
        name: 'test-action',
        content: {
          user: { name: 'Alice' },
        },
      };

      const mockActionMalformedPath: IAction = {
        ...mockAction,
        returnedValues: [{ key: 'malformed.path', path: '.user.name', description: 'Malformed', type: 'string' }],
      };

      jest
        .spyOn(ServiceManager.instance, 'get')
        .mockReset()
        .mockReturnValueOnce({
          name: 'test-service',
          actions: [mockActionMalformedPath],
          reactions: [],
        });

      const inputs = [`\${malformed.path}`];
      const result = TestReaction.parseActionVariables(issuedAction, inputs);
      expect(result).toEqual(['undefined']);
    });
  });

  describe('refreshParams', () => {
    it('should resolve without errors', async () => {
      const reaction = new TestReaction('test', 'desc', []);
      await expect(reaction.refreshParams('user-id')).resolves.toBeUndefined();
    });
  });
});
