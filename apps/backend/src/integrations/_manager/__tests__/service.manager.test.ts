import type { Service } from '@/integrations/_definitions/service.interface';
import { ServiceManager } from '../service.manager';

describe('ServiceManager', () => {
  let serviceManager: ServiceManager;

  beforeEach(() => {
    serviceManager = ServiceManager.instance;
    (serviceManager as any).services.clear();
  });

  it('should be a singleton', () => {
    const instance1 = ServiceManager.instance;
    const instance2 = ServiceManager.instance;
    expect(instance1).toBe(instance2);
  });

  it('should register and retrieve a service', () => {
    const mockService: Service = {
      name: 'TestService',
      actions: [],
      reactions: [],
    };

    serviceManager.register(mockService);

    const retrieved = serviceManager.get('TestService');
    expect(retrieved).toBe(mockService);
  });

  it('should retrieve a service case-insensitively', () => {
    const mockService: Service = {
      name: 'CaseSensitiveService',
      actions: [],
      reactions: [],
    };

    serviceManager.register(mockService);

    const retrievedLower = serviceManager.get('casesensitiveservice');
    const retrievedUpper = serviceManager.get('CASESENSITIVESERVICE');

    expect(retrievedLower).toBe(mockService);
    expect(retrievedUpper).toBe(mockService);
  });

  it('should return undefined for non-existent service', () => {
    const retrieved = serviceManager.get('NonExistentService');
    expect(retrieved).toBeUndefined();
  });

  it('should return all registered services', () => {
    const mockService1: Service = { name: 'Service1', actions: [], reactions: [] };
    const mockService2: Service = { name: 'Service2', actions: [], reactions: [] };

    serviceManager.register(mockService1);
    serviceManager.register(mockService2);

    const allServices = serviceManager.getAll();

    expect(allServices).toHaveLength(2);
    expect(allServices).toContain(mockService1);
    expect(allServices).toContain(mockService2);
  });
});
