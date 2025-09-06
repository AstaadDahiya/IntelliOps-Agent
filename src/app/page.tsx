'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import AlertCard from '@/components/dashboard/alert-card';
import AnalysisCard from '@/components/dashboard/analysis-card';
import ActionStatusCard from '@/components/dashboard/action-status-card';
import { mockAlert, type Alert } from '@/lib/data';
import { runIntelliOpsAgent } from '@/ai/flows/run-intelliops-agent';
import { useToast } from '@/hooks/use-toast';

export type WorkflowState = 'idle' | 'analyzing' | 'awaiting-approval' | 'executing' | 'completed';
export type ActionResult = 'success' | 'failure' | 'rejected' | null;

export default function Home() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState>('idle');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [actionResult, setActionResult] = useState<ActionResult>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setAlert(mockAlert);
      setWorkflowState('idle')
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = async () => {
    if (!alert) return;
    setWorkflowState('analyzing');
    try {
      const result = await runIntelliOpsAgent({
        alertTitle: alert.title,
        alertDescription: alert.description,
      });
      setAnalysisResult({
        analysis: result.analysis,
        suggestedAction: result.suggestedAction,
        reasoning: result.reasoning,
      });
      setWorkflowState('awaiting-approval');
    } catch (error) {
      console.error('Error running IntelliOps agent:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "The AI agent failed to process the alert. Please try again.",
      });
      setWorkflowState('idle');
    }
  };

  const handleApprove = async () => {
    setWorkflowState('executing');
    // This is a placeholder for the actual API call
    await new Promise(resolve => setTimeout(resolve, 4000));
    const success = Math.random() > 0.2; // Simulate success/failure
    setActionResult(success ? 'success' : 'failure');
    setWorkflowState('completed');
  };

  const handleReject = () => {
    setActionResult('rejected');
    setWorkflowState('completed');
  };
  
  const handleReset = () => {
    setAlert(null);
    setAnalysisResult(null);
    setActionResult(null);
    setWorkflowState('idle');
    const timer = setTimeout(() => {
      setAlert(mockAlert);
    }, 1000);
    return () => clearTimeout(timer);
  }

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-3">
          <div className="grid gap-8 lg:col-span-2">
            <AlertCard 
              alert={alert}
              onAnalyze={handleAnalyze}
              workflowState={workflowState}
            />
            <AnalysisCard 
              workflowState={workflowState}
              result={analysisResult}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
          <div className="lg:col-span-1">
            <ActionStatusCard 
              workflowState={workflowState}
              actionResult={actionResult}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
