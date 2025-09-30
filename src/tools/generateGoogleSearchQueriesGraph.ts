import { z } from "zod";
import { GenerateGoogleSearchQueriesGraphSchema } from "../schemas/index.js";
import { makeInfraNodusRequest } from "../api/client.js";
import { transformToStructuredOutput } from "../utils/transformers.js";

export const generateGoogleSearchQueriesGraphTool = {
	name: "generate_search_queries_graph",
	definition: {
		title: "Generate a Google Search Queries Graph",
		description:
			"Generate a graph of search requests related to search queries provided",
		inputSchema: GenerateGoogleSearchQueriesGraphSchema.shape,
	},
	handler: async (
		params: z.infer<typeof GenerateGoogleSearchQueriesGraphSchema>
	) => {
		try {
			const includeGraph = params.includeSearchQueriesOnly ? false : true;
			const includeStatements = params.showGraphOnly ? false : true;

			// First generate the graph with focus on insights
			const queryParams = new URLSearchParams({
				doNotSave: "true",
				addStats: "true",
				includeGraphSummary: "true",
				extendedGraphSummary: "true",
				includeGraph: includeGraph ? "false" : "true",
				includeStatements: includeStatements ? "true" : "false",
				compactGraph: "true",
				compactStatements: "true",
				aiTopics: "true",
			});

			const endpoint = `/import/googleSearchResultsGraph?${queryParams.toString()}`;

			const response = await makeInfraNodusRequest(endpoint, {
				searchQuery: params.queries.join(","),
				doNotAddGraph: includeGraph ? "false" : "true",
				keywordsSource: params.keywordsSource,
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

			const textOverview = transformToStructuredOutput(
				response,
				includeGraph,
				includeStatements
			);

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(textOverview, null, 2),
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
