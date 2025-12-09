import { Input } from '@/components/wrappers/Input';
import { Button } from '@/components/wrappers/Button';
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
                    {param.value || param.placeholder}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(param.options ?? []).map((opt: any) => (
                    <DropdownMenuItem
                      key={opt.id}
                      onClick={() => updateParam(index, opt.full_name || opt.name || opt.id)}
                    >
                      {opt.full_name || opt.name}
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

export default ParamsForm;
