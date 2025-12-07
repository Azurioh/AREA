import { ApiClient } from '@/lib/ApiClient';

export interface WorkflowActionOrReaction {
  service: string;
  name: string;
  params: Record<string, any>;
}

export interface Workflow {
  action: WorkflowActionOrReaction;
  reaction: WorkflowActionOrReaction;
}

export class AllWorkflowsClient extends ApiClient {
  /**
   * get all the workflows of the authenticated user
   * @returns {Promise<Workflow[]>}
   */
  async getAllWorkflows(): Promise<Workflow[]> {
    return this.fetch<Workflow[]>('/actions-reactions/v1/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
