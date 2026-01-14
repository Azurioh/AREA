import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '@/components/SideBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/wrappers/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/wrappers/Card';
import { Input } from '@/components/wrappers/Input';
import { useServicesClient } from '@/features/connections/hooks/useServicesClient';
import { useActionReaction } from '@/features/workflows/context/ActionReactionContext';
import { useActionReturnedValues } from '@/features/workflows/hooks/useActionReturnedValues';
import type { ParamOption } from '@/features/workflows/hooks/useCreateActionReaction';
import { useListServices } from '@/features/workflows/hooks/useListServices';
import { useServiceReactions } from '@/features/workflows/hooks/useServiceReactions';
import { AppRoutesPaths } from '@/enums/routes';

const ChooseReaction: React.FC = () => {
  const { services, fetchServices } = useListServices();

  const servicesStatus = useServicesClient();

  React.useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    serviceReactions,
    loadingServices,
    selectedReaction,
    reactionParams,
    loadingParams,
    selectReaction,
    updateParam,
    setSelectedReaction,
  } = useServiceReactions(services);

  const navigate = useNavigate();
  const { setReaction, action } = useActionReaction();

  const { values: returnedValues } = useActionReturnedValues(action?.service, action?.name);

  const isServiceConnected = (serviceName: string) => {
    const service = servicesStatus.find((s) => s.name === serviceName);
    return service?.status === true;
  };

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <main className="flex-1 ml-24 pr-4 pt-4">
        <Card className="h-full w-full">
          <CardContent className="p-6 h-full overflow-y-auto">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold tracking-tighter text-primary">Choose your REAction</h1>
              <p className="text-muted-foreground">Choose the reaction you need, among all the choices you have</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
              {services.map((service) => {
                return (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <Card className="bg-primary text-center text-text-white overflow-hidden">
                      <CardHeader className="p-2">
                        <CardTitle className="text-2xl text-text-white">{service}</CardTitle>
                      </CardHeader>
                    </Card>

                    <div className="mt-4">
                      {loadingServices.includes(service) ? (
                        <div className="text-center py-8 text-muted-foreground">Loading reactions...</div>
                      ) : !serviceReactions[service] || serviceReactions[service].length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No reactions available</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(serviceReactions[service] as { name: string; description?: string }[]).map((reaction) => {
                            const lowerName = service.toLowerCase();
                            const logoUrl = `${import.meta.env.VITE_BASE_IMAGE_URL}/${lowerName}.png`;

                            return (
                              <Button
                                key={reaction.name}
                                variant={
                                  selectedReaction?.service === service && selectedReaction?.reaction === reaction.name
                                    ? 'default'
                                    : 'outline'
                                }
                                className="w-full justify-start h-auto py-3 relative overflow-hidden"
                                onClick={() => {
                                  if (!isServiceConnected(service)) {
                                    navigate(AppRoutesPaths.CONNECTIONS);
                                    return;
                                  }
                                  selectReaction(service, reaction.name);
                                }}
                              >
                                <img
                                  src={logoUrl}
                                  alt={service}
                                  className="absolute top-2 right-2 h-6 w-6 object-contain"
                                />

                                <div className="text-left">
                                  <div className="font-semibold">{reaction.name}</div>
                                  {reaction.description && (
                                    <div className="text-xs opacity-80 mt-1 whitespace-normal break-words">
                                      {reaction.description}
                                    </div>
                                  )}
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <AnimatePresence>
        {selectedReaction && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedReaction(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-primary overflow-hidden">
                <CardHeader className="bg-primary">
                  <CardTitle className="text-lg text-text-white text-center">
                    {selectedReaction.reaction}
                    {loadingParams && <span className="text-sm font-normal ml-2">(Loading...)</span>}
                  </CardTitle>
                </CardHeader>

                <CardContent className="mt-6">
                  {loadingParams ? (
                    <div className="text-center py-8 text-muted-foreground">Loading parameters...</div>
                  ) : (
                    <div className="space-y-4">
                      {reactionParams.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No parameters required for this reaction
                        </div>
                      ) : (
                        reactionParams.map((param, index) => {
                          const id = `param-${param.key}-${index}`;
                          return (
                            <div key={param.key} className="space-y-2">
                              <label htmlFor={id} className="text-sm font-medium">
                                {param.label}
                              </label>

                              {param.type === 'input' ? (
                                <div className="space-y-1">
                                  <Input
                                    id={id}
                                    placeholder={param.placeholder}
                                    value={typeof param.value === 'string' ? param.value : ''}
                                    onChange={(e) => updateParam(index, e.target.value)}
                                  />
                                  {returnedValues.length > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      Available variables: {returnedValues.map((v) => `\${${v.key}}`).join(', ')}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start" id={id}>
                                      {typeof param.value === 'object' && (param.value as ParamOption)?.name
                                        ? (param.value as ParamOption).name
                                        : param.placeholder}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-full">
                                    {(param.options && param.options.length > 0
                                      ? param.options
                                      : [{ name: 'No options available', id: 'none' }]
                                    ).map((opt: ParamOption) => (
                                      <DropdownMenuItem
                                        key={opt.id}
                                        onClick={() =>
                                          updateParam(index, {
                                            name: opt.name,
                                            id: opt.id,
                                          })
                                        }
                                      >
                                        {opt.name}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          );
                        })
                      )}

                      <div className="pt-4 flex gap-3">
                        <Button
                          className="flex-1 text-text-white"
                          onClick={() => {
                            if (!selectedReaction) {
                              return;
                            }

                            const paramsObj = reactionParams.reduce(
                              (acc, p) => {
                                acc[p.key] = p.value;
                                return acc;
                              },
                              {} as Record<string, unknown>,
                            );

                            setReaction(
                              selectedReaction.service,
                              {
                                service: selectedReaction.service,
                                name: selectedReaction.reaction,
                                params: paramsObj,
                              },
                              reactionParams,
                            );

                            setSelectedReaction(null);
                            navigate(AppRoutesPaths.CREATE);
                          }}
                        >
                          Save Configuration
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedReaction(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChooseReaction;
