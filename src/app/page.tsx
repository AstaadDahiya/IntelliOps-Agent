'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import AlertCard from '@/components/dashboard/alert-card';
import AnalysisCard from '@/components/dashboard/analysis-card';
import ActionStatusCard from '@/components/dashboard/action-status-card';
import { mockAlert, type Alert } from '@/lib/data';

export type WorkflowState = 'idle' | 'analyzing' | 'awaiting-approval' | 'executing' | 'completed';
export type ActionResult = 'success' | 'failure' | 'rejected' | null;

export default function Home() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState>('idle');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [actionResult, setActionResult] = useState<ActionResult>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert(mockAlert);
      setWorkflowState('idle')
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = async () => {
    setWorkflowState('analyzing');
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalysisResult({
      analysis: 'The high CPU utilization is caused by the `data-cruncher.py` script, which appears to be stuck in an infinite loop. This is a known issue documented in our knowledge base article KB-4592.',
      suggestedAction: 'Run script "restart-service.sh" on web-server-01.',
      reasoning: 'Restarting the service will terminate the runaway process and restore normal operation. This is the standard procedure for this type of incident, minimizing downtime.',
    });
    setWorkflowState('awaiting-approval');
  };

  const handleApprove = async () => {
    setWorkflowState('executing');
    await new Promise(resolve => setTimeout(resolve, 4000));
    const success = Math.random() > 0.2; // Simulate success/failure
    setActionResult(success ? 'success' : 'failure');
    setWorkflowState('completed');
  };

  const handleReject = () => {
    setActionResult('rejected');
    setWorkflowState('completed');
  };

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
            />
          </div>
        </div>
      </main>
    </div>
  );
}
