
import React from "react";
import { Button } from '@/components/wrappers/Button';
import WorkflowsCard from '@/components/WorkflowsCard';
import { Search } from "lucide-react";
import { Input } from '@/components/wrappers/Input';
import SideBar from "@/components/SideBar";
import { Card, CardContent } from "@/components/wrappers/Card";
import { useNavigate } from "react-router-dom"

const workflowsMock = [
    {
        title: 'Workflow A',
        Description: 'Description A',
        Value: '42',
        Last: '5',
        activated: true,
        Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
        Service2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
        title: 'Workflow A',
        Description: 'Description A',
        Value: '42',
        Last: '5',
        activated: true,
        Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
        Service2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
        title: 'Workflow A',
        Description: 'Description A',
        Value: '42',
        Last: '5',
        activated: true,
        Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
        Service2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
        title: 'Workflow B',
        Description: 'Description B',
        Value: '123',
        Last: '10',
        activated: false,
        Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
        Service2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
        title: 'Workflow C',
        Description: 'Description C',
        Value: '300',
        Last: '60',
        activated: true,
        Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
        Service2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
        title: 'Workflow D',
        Description: 'Description D',
        Value: '88',
        Last: '12',
        activated: false,
        Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
        Service2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
        title: 'Workflow E',
        Description: 'Description E',
        Value: '150',
        Last: '20',
        activated: true,
        Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
        Service2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    {
        title: 'Workflow F',
        Description: 'Description F',
        Value: '75',
        Last: '8',
        activated: false,
        Service1: 'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png',
        Service2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
];

const WorkflowPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-background">
            <SideBar />
            <main className="flex-1 ml-24 pr-4 pt-4">
                <Card className="h-full w-full rounded-b-none flex flex-col items-center justify-start">
                    <CardContent className="p-6 h-full overflow-y-auto">

                        <h1 className="text-5xl mt-12 mb-14 font-text text-center !font-text font-bold tracking-tighter text-primary">
                            Build &amp; Manage Your Workflows
                        </h1>
                        <div className="w-full flex justify-center mb-8">
                            <div className="relative w-full max-w-4xl">
                                <Input
                                    id="search-workflows"
                                    placeholder="Search your workflow ..."
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Search size={28} />
                                </span>
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-4 mb-12">
                                {workflowsMock.map((wf, idx) => (
                                    <WorkflowsCard
                                    key={idx}
                                    title={wf.title}
                                    Description={wf.Description}
                                    Value={wf.Value}
                                    Last={wf.Last}
                                    activated={wf.activated}
                                    Service1={wf.Service1}
                                    Service2={wf.Service2}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="fixed bottom-8">
                                <Button
                                    size="icon"
                                    className={`w-60 h-10 rounded-[var(--small-radius)]`}
                                    onClick={() => navigate("/test")}
                                >
                                    <p className="text-2xl"> Create workflow </p>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default WorkflowPage;