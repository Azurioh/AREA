import { Input } from '@/components/wrappers/Input';
import { Button } from '@/components/wrappers/Button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ParamsForm = ({ params, updateParam }: any) => {
  return (
    <div className="space-y-3 pt-2">
      <h3 className="font-semibold text-sm">Parameters</h3>

      {params.map((param: any, index: number) => {
        const id = `param-${param.key}-${index}`;
        return (
          <div key={param.key} className="space-y-1">
            <label className="text-sm text-muted-foreground" htmlFor={id}>
              {param.label}
            </label>

            {param.type === 'input' ? (
              <Input
                id={id}
                placeholder={param.placeholder}
                value={param.value}
                onChange={(e) => updateParam(index, e.target.value)}
                className="bg-card"
              />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-card">
                    {typeof param.value === 'object' ? param.value.name : param.placeholder}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(param.options ?? []).map((opt: any) => (
                    <DropdownMenuItem key={opt.id} onClick={() => updateParam(index, { name: opt.name, id: opt.id })}>
                      {opt.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ReactionSelector = ({
  services,
  reactions,
  loading,
  selectedService,
  selectedReaction,
  params,
  selectService,
  selectReaction,
  updateParam,
}: any) => {
  return (
    <Card className="bg-muted p-6">
      <h2 className="text-xl font-semibold mb-4 text-primary">Choose a Reaction</h2>

      <div className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start bg-card">
              {selectedService ?? 'Choose reaction service'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {services.map((srv: string) => (
              <DropdownMenuItem key={srv} onClick={() => selectService(srv)}>
                {srv}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={!selectedService} className="w-full justify-start bg-card">
              {loading ? 'Loading...' : (selectedReaction ?? 'Choose reaction')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {reactions.map((r: any) => (
              <DropdownMenuItem key={r.name} onClick={() => selectReaction(selectedService, r.name)}>
                {r.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedReaction && params.length > 0 && <ParamsForm params={params} updateParam={updateParam} />}
      </div>
    </Card>
  );
};

export default ReactionSelector;
