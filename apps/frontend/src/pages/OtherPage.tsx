import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApi } from '@/hooks/useApiHook';

export default function OtherPage() {
  const { webhookService, githubService } = useApi();
  const [repositories, setRepositories] = useState<string[]>([]);
  const [githubRepository, setGithubRepository] = useState<string>('');
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState<string>('');
  const [pushAction, setPushAction] = useState<boolean>(true);
  const [pullRequestAction, setPullRequestAction] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('Please select a repository');
  const navigate = useNavigate();

  const fetchRepositories = async () => {
    const repos = await githubService.listRepositories();
    setRepositories(repos);
  };

  const createRepository = async () => {
    console.log(githubRepository, discordWebhookUrl);
    if (!discordWebhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      alert('Please provide a valid webhook URL');
      return;
    }
    await webhookService.createWebhook({
      githubUrl: githubRepository,
      discordWebhookUrl,
      actions: [pushAction ? 'push' : '', pullRequestAction ? 'pull_request' : ''],
    });
    navigate('/');
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  useEffect(() => {
    if (githubRepository.length === 0) {
      setTitle('Please select a repository');
      return;
    }
    setTitle('Please provide a webhook URL');
  }, [githubRepository, discordWebhookUrl]);

  return (
    <div className="flex flex-col items-center p-20 gap-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <Select value={githubRepository} onValueChange={setGithubRepository}>
        <SelectTrigger className="max-w-md">
          <SelectValue placeholder="Select a repository" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Repositories</SelectLabel>
            {repositories.map((repo) => (
              <SelectItem key={repo} value={repo}>
                {repo}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="push"
            defaultChecked={true}
            checked={pushAction}
            onCheckedChange={(checked) => setPushAction(checked === true)}
          />
          <Label htmlFor="push">Push</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="pull-request"
            defaultChecked={true}
            checked={pullRequestAction}
            onCheckedChange={(checked) => setPullRequestAction(checked === true)}
          />
          <Label htmlFor="pull-request">Pull Request</Label>
        </div>
      </div>

      <Input
        value={discordWebhookUrl}
        type="url"
        onChange={(e) => setDiscordWebhookUrl(e.target.value)}
        placeholder="Type your URL..."
        className="max-w-md"
      />

      <Button onClick={createRepository}>Create</Button>
    </div>
  );
}
