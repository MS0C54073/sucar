'use server';

/**
 * @fileOverview A flow to optimize driver routes using AI, considering real-time traffic and road closures.
 *
 * - optimizeDriverRoutes - A function that suggests the optimal route for drivers.
 * - OptimizeDriverRoutesInput - The input type for the optimizeDriverRoutes function, including current location and destinations.
 * - OptimizeDriverRoutesOutput - The return type for the optimizeDriverRoutes function, providing an optimized route.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeDriverRoutesInputSchema = z.object({
  currentLocation: z.string().describe('The current location of the driver (e.g., a street address or GPS coordinates).'),
  destinations: z.array(z.string()).describe('An array of destination addresses for pickups and deliveries.'),
  trafficConditions: z.string().optional().describe('Optional: Real-time traffic conditions report.'),
  roadClosures: z.array(z.string()).optional().describe('Optional: An array of road closures affecting routes.'),
});
export type OptimizeDriverRoutesInput = z.infer<typeof OptimizeDriverRoutesInputSchema>;

const OptimizeDriverRoutesOutputSchema = z.object({
  optimizedRoute: z.array(z.string()).describe('An ordered array of destination addresses representing the optimized route.'),
  estimatedTravelTime: z.string().describe('The estimated total travel time for the optimized route.'),
  instructions: z.string().describe('Step-by-step driving instructions for the optimized route.'),
});
export type OptimizeDriverRoutesOutput = z.infer<typeof OptimizeDriverRoutesOutputSchema>;

export async function optimizeDriverRoutes(input: OptimizeDriverRoutesInput): Promise<OptimizeDriverRoutesOutput> {
  return optimizeDriverRoutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeDriverRoutesPrompt',
  input: {schema: OptimizeDriverRoutesInputSchema},
  output: {schema: OptimizeDriverRoutesOutputSchema},
  prompt: `You are an AI-powered route optimization expert. Given the driver's current location, a list of destinations, real-time traffic conditions, and road closures, you will determine the most efficient route.

Current Location: {{{currentLocation}}}
Destinations: {{#each destinations}}{{{this}}}, {{/each}}
Traffic Conditions: {{{trafficConditions}}}
Road Closures: {{#each roadClosures}}{{{this}}}, {{/each}}

Provide the optimized route, estimated travel time, and step-by-step driving instructions.

Output the optimized route as an ordered list of destination addresses, the estimated travel time as a string, and step-by-step driving instructions.
`,
});

const optimizeDriverRoutesFlow = ai.defineFlow(
  {
    name: 'optimizeDriverRoutesFlow',
    inputSchema: OptimizeDriverRoutesInputSchema,
    outputSchema: OptimizeDriverRoutesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
