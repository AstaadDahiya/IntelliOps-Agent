import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, FileText, Lightbulb, Loader2, ThumbsDown, ThumbsUp, BrainCircuit } from "lucide-react";
import type { WorkflowState } from "@/app/page";

type AnalysisResult = {
  analysis: string;
  suggestedAction: string;
  reasoning: string;
};

type AnalysisCardProps = {
  workflowState: WorkflowState;
  result: AnalysisResult | null;
  onApprove: () => void;
  onReject: () => void;
};

export default function AnalysisCard({ workflowState, result, onApprove, onReject }: AnalysisCardProps) {
  const isLoading = workflowState === 'analyzing';
  const isAwaitingApproval = workflowState === 'awaiting-approval';
  const isCompleted = workflowState === 'completed' || workflowState === 'executing';

  if (workflowState === 'idle') {
    return null;
  }

  if (isLoading) {
    return <AnalysisCardSkeleton />;
  }

  if (!result) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Bot className="h-7 w-7 text-primary" />
          AI Analysis &amp; Recommendation
        </CardTitle>
        <CardDescription>
          Gemini has analyzed the alert and proposes the following course of action.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 flex items-center font-semibold text-lg">
            <FileText className="mr-2 h-5 w-5 text-accent" />
            Analysis
          </h3>
          <p className="text-muted-foreground">{result.analysis}</p>
        </div>
        <Separator />
        <div>
          <h3 className="mb-2 flex items-center font-semibold text-lg">
            <Lightbulb className="mr-2 h-5 w-5 text-accent" />
            Suggested Action
          </h3>
          <p className="font-mono text-sm bg-muted p-3 rounded-md border">{result.suggestedAction}</p>
        </div>
        <Separator />
        <div>
          <h3 className="mb-2 flex items-center font-semibold text-lg">
            <BrainCircuit className="mr-2 h-5 w-5 text-accent" />
            Reasoning
          </h3>
          <p className="text-muted-foreground">{result.reasoning}</p>
        </div>
      </CardContent>
      {isAwaitingApproval && (
         <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onReject} disabled={isCompleted}>
              <ThumbsDown className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button onClick={onApprove} disabled={isCompleted} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white">
              <ThumbsUp className="mr-2 h-4 w-4" /> Approve &amp; Execute
            </Button>
      </CardFooter>
      )}
    </Card>
  );
}

function AnalysisCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          AI is Analyzing...
        </CardTitle>
        <CardDescription>
          Please wait while our AI agent processes the alert data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Separator />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Separator />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
