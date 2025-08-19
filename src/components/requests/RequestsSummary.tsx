// src/components/requests/RequestsSummary.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, XCircle, Hourglass } from "lucide-react";

interface SummaryProps {
  summary: {
    total: number;
    rejected: number;
    pending: number;
  };
}

export function RequestsSummary({ summary }: SummaryProps) {
  const summaryItems = [
    {
      title: "Total Requests",
      value: summary.total,
      icon: ListChecks,
      color: "text-blue-500",
    },
    {
      title: "Rejected",
      value: summary.rejected,
      icon: XCircle,
      color: "text-red-500",
    },
    {
      title: "Pending",
      value: summary.pending,
      icon: Hourglass,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
