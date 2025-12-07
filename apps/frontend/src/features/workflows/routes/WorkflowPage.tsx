import React, { useState } from "react";
import { Button } from '@/components/wrappers/Button';
import WorkflowsCard from '@/components/WorkflowsCard';
import { Search } from "lucide-react";
import { Input } from '@/components/wrappers/Input';
import SideBar from "@/components/SideBar";
import { Card, CardContent } from "@/components/wrappers/Card";
import { useNavigate } from "react-router-dom"
import { useGetAllWorkflows } from "@/features/workflows/hooks/useGetAllWorkflows";
import { useFilter } from "@/features/workflows/hooks/useFilter";
import { AppRoutesPaths } from '@/enums/routes';

const WorkflowPage: React.FC = () => {
    const navigate = useNavigate();
    const { workflows, isLoading, error } = useGetAllWorkflows();

    const [search, setSearch] = useState("");

    const filteredWorkflows = useFilter(workflows, search, wf =>
        (wf.action?.service || "").toLowerCase()
    );

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
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Search size={28} />
                                </span>
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-4 mb-12">
                                {isLoading && <div className="col-span-3 text-center text-lg">Chargement...</div>}
                                {error && <div className="col-span-3 text-center text-red-500">{error}</div>}
                                {!isLoading && !error && filteredWorkflows.map((wf, idx) => (
                                    <WorkflowsCard
                                        key={idx}
                                        title={wf.action?.service || 'Unknown'}
                                        Description={wf.action?.name || ''}
                                        Value={wf.action?.params?.value || ''}
                                        Last={wf.action?.params?.last || ''}
                                        activated={true}
                                        Service1={'https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png'}
                                        Service2={'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png'}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="fixed bottom-8">
                                <Button
                                    size="icon"
                                    className={`w-60 h-10 rounded-[var(--small-radius)]`}
                                    onClick={() => navigate(AppRoutesPaths.CREATE)}
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
