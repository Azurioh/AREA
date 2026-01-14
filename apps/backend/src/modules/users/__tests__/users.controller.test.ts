import type { FastifyReply, FastifyRequest } from 'fastify';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

jest.mock('../users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;
  let request: Partial<FastifyRequest>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    service = new UsersService({} as any) as jest.Mocked<UsersService>;
    controller = new UsersController(service);

    request = {
      user: { _id: 'user-id' },
      body: {},
      params: {},
    } as any;

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('getUserMe', () => {
    it('should return user profile without password', async () => {
      const mockUser = {
        _id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
      };

      service.getUserById.mockResolvedValue(mockUser as any);

      await controller.getUserMe(request as FastifyRequest, reply as FastifyReply);

      expect(service.getUserById).toHaveBeenCalledWith('user-id');
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        _id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
      });
      const sendArgs = (reply.send as jest.Mock).mock.calls[0][0];
      expect(sendArgs).not.toHaveProperty('password');
    });
  });

  describe('updateUserMe', () => {
    it('should update user and return 204', async () => {
      request.body = { name: 'New Name' };

      await controller.updateUserMe(request as FastifyRequest<{ Body: any }>, reply as FastifyReply);

      expect(service.updateUser).toHaveBeenCalledWith('user-id', { name: 'New Name' });
      expect(reply.status).toHaveBeenCalledWith(204);
      expect(reply.send).toHaveBeenCalled();
    });
  });

  describe('deleteUserMe', () => {
    it('should delete user and return 204', async () => {
      await controller.deleteUserMe(request as FastifyRequest, reply as FastifyReply);

      expect(service.deleteUser).toHaveBeenCalledWith('user-id');
      expect(reply.status).toHaveBeenCalledWith(204);
      expect(reply.send).toHaveBeenCalled();
    });
  });

  describe('createUserMeState', () => {
    it('should create state token and return 200', async () => {
      await controller.createUserMeState(request as FastifyRequest, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({ stateToken: expect.any(String) }));
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' },
      ];
      service.getAllUsers.mockResolvedValue(mockUsers as any);

      await controller.getAllUsers(request as FastifyRequest, reply as FastifyReply);

      expect(service.getAllUsers).toHaveBeenCalled();
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { _id: 'user-123', name: 'Test User', email: 'test@example.com' };
      request.params = { id: 'user-123' };
      service.getUserById.mockResolvedValue(mockUser as any);

      await controller.getUserById(request as FastifyRequest<{ Params: any }>, reply as FastifyReply);

      expect(service.getUserById).toHaveBeenCalledWith('user-123');
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateUserById', () => {
    it('should update user by id and return 204', async () => {
      request.params = { id: 'user-123' };
      request.body = { name: 'Updated Name' };

      await controller.updateUserById(request as FastifyRequest<{ Params: any; Body: any }>, reply as FastifyReply);

      expect(service.updateUser).toHaveBeenCalledWith('user-123', { name: 'Updated Name' });
      expect(reply.status).toHaveBeenCalledWith(204);
      expect(reply.send).toHaveBeenCalled();
    });
  });

  describe('deleteUserById', () => {
    it('should delete user by id and return 204', async () => {
      request.params = { id: 'user-123' };

      await controller.deleteUserById(request as FastifyRequest<{ Params: any }>, reply as FastifyReply);

      expect(service.deleteUser).toHaveBeenCalledWith('user-123');
      expect(reply.status).toHaveBeenCalledWith(204);
      expect(reply.send).toHaveBeenCalled();
    });
  });
});
