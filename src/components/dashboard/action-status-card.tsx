import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertCircle, Bot, CheckCircle2, Hourglass, Loader2, Terminal, XCircle } from "lucide-react";
import type { WorkflowState, ActionResult } from "@/app/page";
import React from "react";

type ActionStatusCardProps = {
  workflowState: WorkflowState;
  actionResult: ActionResult;
};

const StatusItem = ({ 
  icon, 
  title, 
  status,
  children
}: {
  icon: React.ReactNode; 
  title: string; 
  status: 'pending' | 'active' | 'complete' | 'error';
  children?: React.ReactNode;
}) => {
  const statusClasses = {
    pending: "text-muted-foreground/50",
    active: "text-primary",
    complete: "text-green-500",
    error: "text-destructive",
  };
  
  return (
    <div className="flex gap-4">
      <div className={cn("flex flex-col items-center", statusClasses[status])}>
        {icon}
        <div className={cn("w-px h-full flex-1", status !== 'pending' ? 'bg-current' : 'bg-border' )} />
      </div>
      <div className={cn("pb-8 -mt-1", status === 'pending' && 'text-muted-foreground/50')}>
        <h4 className="font-semibold">{title}</h4>
        {children && <div className="text-sm text-muted-foreground mt-1">{children}</div>}
      </div>
    </div>
  )
};

export default function ActionStatusCard({ workflowState, actionResult }: ActionStatusCardProps) {
  const getStatus = (step: number): 'pending' | 'active' | 'complete' | 'error' => {
    const stateMap: Record<WorkflowState, number> = {
      idle: 0,
      analyzing: 1,
      'awaiting-approval': 2,
      executing: 3,
      completed: 4
    };
    const currentStep = stateMap[workflowState];
    if (currentStep < step) return 'pending';
    if (currentStep > step) {
      if (step === 2 && actionResult === 'rejected') return 'error';
      return 'complete';
    }
    // currentStep === step
    if (workflowState === 'completed') {
       if (actionResult === 'failure' || actionResult === 'rejected') return 'error';
       return 'complete';
    }
    return 'active';
  };

  const alertStatus = getStatus(0);
  const analysisStatus = getStatus(1);
  const approvalStatus = getStatus(2);
  const executionStatus = getStatus(3);
  
  const progressValue = {
    'idle': 0,
    'analyzing': 25,
    'awaiting-approval': 50,
    'executing': 75,
    'completed': 100,
  }[workflowState];
  
  return (
    <Card className="shadow-lg sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Workflow Status</CardTitle>
        <CardDescription>Real-time execution timeline.</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progressValue} className="mb-6 h-2" />
        <div className="-mb-8">
          <StatusItem icon={<AlertCircle />} title="Alert Received" status={alertStatus} />
          <StatusItem 
            icon={analysisStatus === 'active' ? <Loader2 className="animate-spin" /> : <Bot />} 
            title="AI Analysis" 
            status={analysisStatus} 
          />
          <StatusItem 
            icon={approvalStatus === 'active' ? <Hourglass /> : approvalStatus === 'error' ? <XCircle /> : <CheckCircle2 />}
            title={actionResult === 'rejected' ? 'Action Rejected' : "Awaiting Approval"} 
            status={approvalStatus} 
          >
            {workflowState === 'awaiting-approval' && "Waiting for user to approve or reject."}
            {actionResult === 'rejected' && "User rejected the suggested action."}
          </StatusItem>
          <StatusItem 
            icon={executionStatus === 'active' ? <Loader2 className="animate-spin" /> : (actionResult === 'failure') ? <XCircle /> : actionResult === 'success' ? <CheckCircle2/> : <Terminal />}
            title={actionResult === 'failure' ? 'Action Failed' : "Action Execution"} 
            status={executionStatus} 
          >
            {workflowState === 'executing' && "Executing suggested action via SuperOps API..."}
            {actionResult === 'success' && "Action completed successfully."}
            {actionResult === 'failure' && "The action failed to execute."}
          </StatusItem>
        </div>
      </CardContent>
    </Card>
  );
}
