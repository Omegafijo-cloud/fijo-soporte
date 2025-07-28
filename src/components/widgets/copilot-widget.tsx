'use client';

import { Card, CardContent } from "@/components/ui/card";

export function CopilotWidget() {
    return (
        <Card className="w-96 h-[60vh] shadow-lg animate-in slide-in-from-bottom-10 flex flex-col">
            <CardContent className="p-2 flex-1">
                <iframe src="https://copilotstudio.microsoft.com/environments/Default-35058e0b-9a5c-4d1c-aa8e-08d02cd58b1a/bots/cr32d_marketingDigitalPro/webchat?__version__=2" className="w-full h-full border-0" title="Copilot Chat"></iframe>
            </CardContent>
        </Card>
    );
}
