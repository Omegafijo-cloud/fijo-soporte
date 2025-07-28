// components/widgets/CopilotWidget.jsx
'use client';

import React from 'react';

export default function CopilotWidget() {
    return (
        <div className="widget-panel fixed bottom-[75px] right-2 w-80 max-h-[70vh] overflow-hidden bg-white bg-opacity-95 rounded-2xl shadow-2xl flex flex-col border-t-4 border-t-blue-800 animate-fadeInScale p-0">
            <iframe
                src="https://copilotstudio.microsoft.com/environments/Default-35058e0b-9a5c-4d1c-aa8e-08d02cd58b1a/bots/cr32d_marketingDigitalPro/webchat?__version__=2"
                title="Chatbot Copilot"
                className="w-full h-full border-none rounded-b-xl"
            ></iframe>
        </div>
    );
}
