"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this section. Please try again later.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-destructive">{title}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              LeetCode API Error
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
