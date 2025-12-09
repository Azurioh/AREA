import { Card } from '@/components/wrappers/Card';
import { Button } from '@/components/wrappers/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ParamsForm from './ParamsForm';

const ActionSelector = ({
  services,
  actions,
  loading,
  selectedService,
  selectedAction,
  params,
  selectService,
  selectAction,
  updateParam,
}: any) => {
  return (
    <Card className="bg-muted p-6">
      <h2 className="text-xl font-semibold mb-4 text-primary">Choose an Action</h2>

      <div className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start bg-card">
              {selectedService ?? 'Choose action service'}
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
              {loading ? 'Loading...' : (selectedAction ?? 'Choose action')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {actions.map((a: any) => (
              <DropdownMenuItem key={a.name} onClick={() => selectAction(selectedService, a.name)}>
                {a.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedAction && params.length > 0 && <ParamsForm params={params} updateParam={updateParam} />}
      </div>
    </Card>
  );
};

export default ActionSelector;
