import { createAgent } from "langchain";
import { googleGenAIModel, groqModel } from "./model";
import { beautyAgentPrompt } from "./prompt";
import { z } from "zod";
import { getUserFoodScanHistory } from "../tools/nutrition";


export const nutritionAgent = createAgent({
  model: googleGenAIModel,
  tools: [getUserFoodScanHistory],
  systemPrompt: '',
  contextSchema: z.object({
    userId: z.bigint(),
  }),
});


export const beautyAgent = createAgent({
    model: groqModel,
    tools: [],
    systemPrompt: beautyAgentPrompt,
    contextSchema: z.object({
        userId: z.bigint(),
    }),
});