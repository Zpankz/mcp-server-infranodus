import { z } from "zod";
import { GenerateGoogleSearchResultsGraphSchema } from "../schemas/index.js";
import { makeInfraNodusRequest } from "../api/client.js";
import { transformToStructuredOutput } from "../utils/transformers.js";

export const generateGoogleSearchResultsGraphTool = {
	name: "generate_google_search_graph",
	definition: {
		title: "Generate a Google Search Results Graph",
		description: "Generate a Google search results graph from search queries",
		inputSchema: GenerateGoogleSearchResultsGraphSchema.shape,
	},
	handler: async (
		params: z.infer<typeof GenerateGoogleSearchResultsGraphSchema>
	) => {
		try {
			const includeGraph = params.includeSearchResultsOnly ? false : true;
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
				doNotAddGraph: params.includeSearchResultsOnly ? "true" : "false",
				aiTopics: "true",
				importLanguage: params.importLanguage || "EN",
				importCountry: params.importCountry || "US",
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
