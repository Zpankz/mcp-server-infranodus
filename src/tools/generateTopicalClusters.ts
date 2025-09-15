import { z } from "zod";
import { GenerateTopicalClustersSchema } from "../schemas/index.js";
import { makeInfraNodusRequest } from "../api/client.js";
import { generateTopics } from "../utils/transformers.js";

export const generateTopicalClustersTool = {
	name: "generateTopicalClusters",
	definition: {
		title: "Generate Topical Clusters",
		description:
			"Generate topics and clusters of keywords from text using knowledge graph analysis",
		inputSchema: GenerateTopicalClustersSchema.shape,
	},
	handler: async (params: z.infer<typeof GenerateTopicalClustersSchema>) => {
		try {
			// First generate the graph with focus on insights
			const queryParams = new URLSearchParams({
				doNotSave: "true",
				addStats: "true",
				includeGraphSummary: "false",
				extendedGraphSummary: "true",
				includeGraph: "false",
				includeStatements: "false",
				aiTopics: "true",
			});

			const endpoint = `/graphAndStatements?${queryParams.toString()}`;

			const response = await makeInfraNodusRequest(endpoint, {
				text: params.text,
			});

			if (response.error) {
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify({ error: response.error }),
						},
					],
					isError: true,
				};
			}

			const insights = generateTopics(response);

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(insights, null, 2),
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify({
							error: error instanceof Error ? error.message : String(error),
						}),
					},
				],
				isError: true,
			};
		}
	},
};
