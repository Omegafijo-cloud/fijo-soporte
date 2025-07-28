'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ChatRequestSchema = z.object({
  history: z.array(MessageSchema),
  prompt: z.string(),
});

export const copilotChatFlow = ai.defineFlow(
  {
    name: 'copilotChatFlow',
    inputSchema: ChatRequestSchema,
    outputSchema: z.string(),
  },
  async ({ history, prompt }) => {
    const chatHistory = history.map(h => ({
      role: h.role,
      content: [{ text: h.content }],
    }));

    const llmResponse = await ai.generate({
      prompt: prompt,
      history: chatHistory,
      config: {
        // Un-comment to lower the temperature for more consistent results.
        // temperature: 0.2,
      },
      system: `Eres OMEGA Copilot, un asistente experto en soporte técnico de telecomunicaciones.
      Tu propósito es ayudar a los agentes de soporte a resolver problemas de clientes de manera rápida y eficiente.
      Responde de forma concisa y directa a las preguntas. Proporciona soluciones, guías paso a paso y explicaciones claras.
      Cuando sea apropiado, sugiere qué plantillas o herramientas de la aplicación OMEGA podrían ser útiles.
      Mantén un tono profesional y servicial.`,
    });

    return llmResponse.text;
  }
);

export async function copilotChat(request: z.infer<typeof ChatRequestSchema>): Promise<string> {
    return copilotChatFlow(request);
}
