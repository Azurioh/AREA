import React from 'react';
import { motion } from 'framer-motion';
import SideBar from '@/components/SideBar';
import { Card, CardContent } from '@/components/wrappers/Card';
import { Button } from '@/components/wrappers/Button';
import { Input } from '@/components/wrappers/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useListActions } from '@/features/workflows/hooks/useListActions';
import { useListReactions } from '@/features/workflows/hooks/useListReactions';
import { useCreateActionReaction } from '@/features/workflows/hooks/useCreateActionReaction';
import { useApp } from '@/hooks/useApp';
import { toast } from 'sonner';

const CreateWorkflows: React.FC = () => {
  const { servicesClient } = useApp();

  const [services, setServices] = React.useState<string[]>([]);
  React.useEffect(() => {
    servicesClient.listServices().then(setServices);
  }, []);

  const [selectedActionService, setSelectedActionService] = React.useState<string | null>(null);
  const [selectedAction, setSelectedAction] = React.useState<string | null>(null);
  const [actionParams, setActionParams] = React.useState<
    {
      key: string;
      label: string;
      placeholder: string;
      type: string;
      options?: { value: string; label: string }[];
      value?: string;
    }[]
  >([]);

  const { actions, loading: loadingActions, fetchActions } = useListActions();

  const [selectedReactionService, setSelectedReactionService] = React.useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] = React.useState<string | null>(null);
  const [reactionParams, setReactionParams] = React.useState<
    {
      key: string;
      label: string;
      placeholder: string;
      type: string;
      options?: { value: string; label: string }[];
      value?: string;
    }[]
  >([]);

  const { reactions, loading: loadingReactions, fetchReactions } = useListReactions();

  const { setAction, setReaction, createActionReaction, loading: loadingCreation } = useCreateActionReaction();

  const handleSelectAction = async (service: string, action: string) => {
    setSelectedAction(action);
    const details = await servicesClient.getActionDetails(service, action);
    setAction({
      trigger: '',
      service,
      name: action,
      params: {},
    });
    setActionParams(details?.params?.map((p: any) => ({ ...p, value: '' })) ?? []);
  };

  const handleSelectReaction = async (service: string, reaction: string) => {
    setSelectedReaction(reaction);
    const details = await servicesClient.getReactionDetails(service, reaction);
    setReaction({
      trigger: '',
      service,
      name: reaction,
      params: {},
    });
    setReactionParams(details?.params?.map((p: any) => ({ ...p, value: '' })) ?? []);
  };

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full rounded-b-none">
          <CardContent className="p-6 h-full overflow-y-auto">
            <div className="text-center space-y-2 mb-6">
              <h1 className="font-bold tracking-tighter text-primary">Create Workflow</h1>
              <p className="text-foreground">Connect actions and reactions to automate your tasks</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl mx-auto space-y-6"
            >
              <Card className="bg-muted p-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">Choose an Action</h2>

                <div className="space-y-4">
                  <div className="w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          {selectedActionService ?? 'Choose action service'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {services.map((srv) => (
                          <DropdownMenuItem
                            key={srv}
                            onClick={() => {
                              setSelectedActionService(srv);
                              setSelectedAction(null);
                              fetchActions(srv);
                            }}
                          >
                            {srv}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" disabled={!selectedActionService} className="w-full justify-start">
                          {loadingActions ? 'Loading actions...' : (selectedAction ?? 'Choose action')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {actions.map((a: any) => (
                          <DropdownMenuItem
                            key={a.name}
                            onClick={() => handleSelectAction(selectedActionService!, a.name)}
                          >
                            {a.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {selectedAction && actionParams.length > 0 && (
                    <div className="w-full space-y-3 pt-2">
                      <h3 className="font-semibold text-sm">Action Parameters</h3>
                      {actionParams.map((param, index) => {
                        const id = `param-${param.key}-${index}`;
                        return (
                          <div key={param.key} className="space-y-1">
                            <label htmlFor={id} className="text-sm text-muted-foreground">
                              {param.label}
                            </label>
                            {param.type === 'input' ? (
                              <Input
                                id={id}
                                placeholder={param.placeholder}
                                value={param.value || ''}
                                onChange={(e) => {
                                  const newParams = [...actionParams];
                                  newParams[index].value = e.target.value;
                                  setActionParams(newParams);
                                }}
                              />
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    id={id}
                                    aria-labelledby={id}
                                  >
                                    {param.value || param.placeholder}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                  {(param.options && param.options.length > 0
                                    ? param.options
                                    : [{ value: 'test', label: 'test' }]
                                  ).map((opt) => (
                                    <DropdownMenuItem
                                      key={opt.value}
                                      onClick={() => {
                                        const newParams = [...actionParams];
                                        newParams[index].value = opt.value;
                                        setActionParams(newParams);
                                      }}
                                    >
                                      {opt.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex justify-center">
                <div className="bg-primary rounded-full p-3">
                  <svg className="w-6 h-6 text-card" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img">
                    <title>Arrow separator between action and reaction</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              <Card className="bg-muted p-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">Choose a Reaction</h2>

                <div className="space-y-4">
                  <div className="w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          {selectedReactionService ?? 'Choose reaction service'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {services.map((srv) => (
                          <DropdownMenuItem
                            key={srv}
                            onClick={() => {
                              setSelectedReactionService(srv);
                              setSelectedReaction(null);
                              fetchReactions(srv);
                            }}
                          >
                            {srv}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" disabled={!selectedReactionService} className="w-full justify-start">
                          {loadingReactions ? 'Loading reactions...' : (selectedReaction ?? 'Choose reaction')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {reactions.map((r: any) => (
                          <DropdownMenuItem
                            key={r.name}
                            onClick={() => handleSelectReaction(selectedReactionService!, r.name)}
                          >
                            {r.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {selectedReaction && reactionParams.length > 0 && (
                    <div className="w-full space-y-3 pt-2">
                      <h3 className="font-semibold text-sm">Reaction Parameters</h3>
                      {reactionParams.map((param, index) => {
                        const id = `param-${param.key}-${index}`;
                        return (
                          <div key={param.key} className="space-y-1">
                            <label htmlFor={id} className="text-sm text-muted-foreground">
                              {param.label}
                            </label>
                            {param.type === 'input' ? (
                              <Input
                                id={id}
                                placeholder={param.placeholder}
                                value={param.value || ''}
                                onChange={(e) => {
                                  const newParams = [...reactionParams];
                                  newParams[index].value = e.target.value;
                                  setReactionParams(newParams);
                                }}
                              />
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    id={id}
                                    aria-labelledby={id}
                                  >
                                    {param.value || param.placeholder}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                  {(param.options && param.options.length > 0
                                    ? param.options
                                    : [{ value: 'test', label: 'test' }]
                                  ).map((opt) => (
                                    <DropdownMenuItem
                                      key={opt.value}
                                      onClick={() => {
                                        const newParams = [...reactionParams];
                                        newParams[index].value = opt.value;
                                        setReactionParams(newParams);
                                      }}
                                    >
                                      {opt.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex justify-center pt-4 pb-6">
                <Button
                  onClick={async () => {
                    setAction((prev: any) =>
                      prev
                        ? {
                            ...prev,
                            params: actionParams.reduce((acc: any, p: any) => ({ ...acc, [p.key]: p.value }), {}),
                          }
                        : prev,
                    );
                    setReaction((prev: any) =>
                      prev
                        ? {
                            ...prev,
                            params: reactionParams.reduce((acc: any, p: any) => ({ ...acc, [p.key]: p.value }), {}),
                          }
                        : prev,
                    );
                    await createActionReaction();
                    toast.success('Workflow created successfully !');
                  }}
                  className="w-full max-w-xs"
                  disabled={!selectedAction || !selectedReaction || loadingCreation}
                >
                  {loadingCreation ? 'Creating...' : 'Create Workflow'}
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateWorkflows;
