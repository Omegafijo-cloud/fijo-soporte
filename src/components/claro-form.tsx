"use client";

import { useState, useEffect } from "react";
import type { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Wifi, Signal, Smartphone, MessageSquare, Network, ClipboardCopy, ClipboardCheck, type LucideProps } from "lucide-react";

type Test = {
  id: string;
  label: string;
  Icon: FC<LucideProps>;
};

const tests: Test[] = [
  { id: "internet", label: "Internet Speed Test", Icon: Wifi },
  { id: "signal", label: "Signal Strength Check", Icon: Signal },
  { id: "device", label: "Device Compatibility", Icon: Smartphone },
  { id: "messaging", label: "Messaging Service Test", Icon: MessageSquare },
  { id: "network", label: "Network Coverage Check", Icon: Network },
];

const initialCheckedState = tests.reduce((acc, test) => {
    acc[test.id] = false;
    return acc;
}, {} as Record<string, boolean>);


export function ClaroForm() {
  const [checkedTests, setCheckedTests] = useState<Record<string, boolean>>(initialCheckedState);
  const [resultString, setResultString] = useState("No tests selected.");
  const [isCopied, setIsCopied] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const completedTests = tests
      .filter(test => checkedTests[test.id])
      .map(test => test.label);

    if (completedTests.length > 0) {
      setResultString(`Completed Tests:\n- ${completedTests.join("\n- ")}`);
    } else {
      setResultString("No tests selected.");
    }
  }, [checkedTests]);

  const handleCheckboxChange = (testId: string, checked: boolean | 'indeterminate') => {
    setCheckedTests(prevState => ({
      ...prevState,
      [testId]: !!checked,
    }));
  };

  const handleCopy = async () => {
    if (isCopied) return;

    try {
      await navigator.clipboard.writeText(resultString);
      setIsCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "The test results are now on your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy text to clipboard.",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl border-2 border-border/60">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-3">
          <Signal className="h-10 w-10 text-primary"/>
          <CardTitle className="text-4xl font-headline tracking-tight">
            Claro Template Generator
          </CardTitle>
        </div>
        <CardDescription className="text-lg text-muted-foreground pt-2">
          Select the tests that have been completed to generate a report.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Select Completed Tests:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map(test => (
              <div key={test.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border transition-all hover:bg-muted">
                <Checkbox
                  id={test.id}
                  checked={checkedTests[test.id]}
                  onCheckedChange={(checked) => handleCheckboxChange(test.id, checked)}
                  className="h-5 w-5"
                />
                <test.Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <Label htmlFor={test.id} className="text-base font-medium leading-none cursor-pointer flex-1">
                  {test.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Label htmlFor="result" className="text-lg font-semibold text-foreground">Formatted Result:</Label>
          <Textarea
            id="result"
            readOnly
            value={resultString}
            className="h-40 text-base bg-muted/50 focus-visible:ring-primary"
            aria-live="polite"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCopy} className="w-full text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
          {isCopied ? <ClipboardCheck className="mr-2 h-6 w-6" /> : <ClipboardCopy className="mr-2 h-6 w-6" />}
          {isCopied ? "Copied!" : "Copy to Clipboard"}
        </Button>
      </CardFooter>
    </Card>
  );
}
