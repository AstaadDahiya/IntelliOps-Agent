import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Alert } from "@/lib/data";
import { AlertTriangle, ChevronRight, Clock, Loader2, Server } from "lucide-react";
import type { WorkflowState } from "@/app/page";
import { formatDistanceToNow } from "date-fns";

type AlertCardProps = {
  alert: Alert | null;
  onAnalyze: () => void;
  workflowState: WorkflowState;
};

const severityMap = {
  Critical: "destructive",
  High: "destructive",
  Medium: "secondary",
  Low: "outline",
} as const;

export default function AlertCard({ alert, onAnalyze, workflowState }: AlertCardProps) {
  if (!alert) {
    return <AlertCardSkeleton />;
  }

  const isAnalyzed = workflowState !== 'idle';
  const isAnalyzing = workflowState === 'analyzing';

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="font-headline text-2xl">{alert.title}</CardTitle>
          <Badge variant={severityMap[alert.severity]} className="whitespace-nowrap">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {alert.severity}
          </Badge>
        </div>
        <CardDescription>A new incident has been reported and requires attention.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="leading-relaxed">{alert.description}</p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1.5 h-4 w-4" />
            {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
          </div>
          <div className="flex items-center">
            <Server className="mr-1.5 h-4 w-4" />
            Source: {alert.source}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onAnalyze} disabled={isAnalyzed || isAnalyzing} size="lg">
          {isAnalyzing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
          ) : isAnalyzed ? (
            "Analysis Complete"
          ) : (
            <>Analyze with AI <ChevronRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function AlertCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-11 w-40" />
      </CardFooter>
    </Card>
  );
}
