import { z } from "zod";
import { CreateGraphSchema } from "../schemas/index.js";
import { makeInfraNodusRequest } from "../api/client.js";
import { transformToStructuredOutput } from "../utils/transformers.js";

export const createKnowledgeGraphTool = {
	name: "create_knowledge_graph",
	definition: {
		title: "Create a Knowledge Graph in InfraNodus from Text",
		description:
			"Create a knowledge graph in InfraNodus from text, save it, and provide its name and a link to it for future use. ",
		inputSchema: CreateGraphSchema.shape,
	},
	handler: async (params: z.infer<typeof CreateGraphSchema>) => {
		try {
			const includeNodesAndEdges = params.addNodesAndEdges;
			const includeGraph = params.includeGraph;
			// Build query parameters
			const queryParams = new URLSearchParams({
				doNotSave: "false",
				addStats: "true",
				includeStatements: params.includeStatements.toString(),
				includeGraphSummary: "false",
				extendedGraphSummary: "true",
				includeGraph: includeGraph ? "true" : "false",
				aiTopics: "true",
				optimize: "develop",
			});

			const endpoint = `/graphAndStatements?${queryParams.toString()}`;

			const requestBody: any = {
				name: params.graphName,
				text: params.text,
				aiTopics: "true",
			};

			if (params.modifyAnalyzedText && params.modifyAnalyzedText !== "none") {
				requestBody.modifyAnalyzedText = params.modifyAnalyzedText;
			}

			const response = await makeInfraNodusRequest(endpoint, requestBody);

			if (response.error) {
				return {
					content: [
						{
							type: "text" as const,
							text: `Error: ${response.error}`,
						},
					],
					isError: true,
				};
			}

			const structuredOutput = transformToStructuredOutput(
				response,
				includeGraph,
				includeNodesAndEdges
			);

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(structuredOutput, null, 2),
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
