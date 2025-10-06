import { z } from "zod";
import { GenerateSEOGraphSchema } from "../schemas/index.js";
import { makeInfraNodusRequest } from "../api/client.js";
import {
	generateKeywordsFromBigrams,
	generateTopicNames,
	generateSummaryFromTopicsAndGaps,
	extractInsightsFromExtendedGraphSummary,
	extractStatementStrings,
} from "../utils/transformers.js";

interface SEOResults {
	inSearchResultsNotInText: any;
	inSearchQueriesNotInText: any;
	inSearchQueriesNotInResults: any;
	topMissingQueries: any;
}

export const generateSEOGraphTool = {
	name: "generate_seo_graph",
	definition: {
		title: "Generate SEO Analysis Graph",
		description:
			"Analyze content for SEO optimization by comparing it with Google search results and search queries to identify content gaps and opportunities",
		inputSchema: GenerateSEOGraphSchema.shape,
	},
	handler: async (params: z.infer<typeof GenerateSEOGraphSchema>) => {
		try {
			// Step 1: Generate topical clusters from the original text
			const topicalClustersResponse = await makeInfraNodusRequest(
				"/graphAndStatements?doNotSave=true&addStats=true&includeGraphSummary=false&extendedGraphSummary=true&includeGraph=false&includeStatements=false&aiTopics=true",
				{
					text: params.text,
				}
			);

			if (topicalClustersResponse.error) {
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify({ error: topicalClustersResponse.error }),
						},
					],
					isError: true,
				};
			}

			const keywords = generateKeywordsFromBigrams(topicalClustersResponse);
			const topicNames = generateTopicNames(topicalClustersResponse);

			// Combine both keywords and topic names, removing duplicates
			const combinedQueries = [
				...(keywords.keywords?.slice(0, 3) || []),
				...(topicNames.topicNames?.slice(0, 3) || []),
			];
			const queries = [...new Set(combinedQueries)];

			if (queries.length === 0) {
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify({
								error: "No keywords found in the text for SEO analysis",
							}),
						},
					],
					isError: true,
				};
			}

			// Step 2: Get Google search results for the main keywords
			const searchResultsResponse = await makeInfraNodusRequest(
				"/import/googleSearchResultsGraph?doNotSave=true&addStats=true&includeGraphSummary=true&extendedGraphSummary=true&includeGraph=false&includeStatements=false&compactGraph=true&compactStatements=true&aiTopics=true",
				{
					searchQuery: queries.join(","),
					aiTopics: "true",
					importLanguage: params.importLanguage,
					importCountry: params.importCountry,
				}
			);

			if (searchResultsResponse.error) {
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify({ error: searchResultsResponse.error }),
						},
					],
					isError: true,
				};
			}

			const searchResultsTopicsAndClusters = generateSummaryFromTopicsAndGaps(
				searchResultsResponse
			);

			// Step 3: Get Google search queries for the main keywords
			const searchQueriesResponse = await makeInfraNodusRequest(
				"/import/googleSearchIntentGraph?doNotSave=true&addStats=true&includeGraphSummary=true&extendedGraphSummary=true&includeGraph=false&includeStatements=false&compactGraph=true&compactStatements=true&aiTopics=true",
				{
					searchQuery: queries.join(","),
					aiTopics: "true",
					keywordsSource: "related",
					importLanguage: params.importLanguage,
					importCountry: params.importCountry,
				}
			);

			if (searchQueriesResponse.error) {
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify({ error: searchQueriesResponse.error }),
						},
					],
					isError: true,
				};
			}

			const searchQueriesTopicsAndClusters = generateSummaryFromTopicsAndGaps(
				searchQueriesResponse
			);

			// Step 4: Compare original text vs search results
			const textVsSearchResultsResponse = await makeInfraNodusRequest(
				"/graphsAndStatements?doNotSave=true&addStats=true&includeStatements=false&includeGraphSummary=false&extendedGraphSummary=true&includeGraph=false&compactGraph=true&compactStatements=true&aiTopics=true&compareMode=difference",
				{
					contexts: [
						{
							text: params.text,
							modifyAnalyzedText: "none",
						},
						{
							text: searchResultsTopicsAndClusters.summary || "",
							modifyAnalyzedText: "none",
						},
					],
					aiTopics: "true",
				}
			);

			const textVsSearchResultsInsights =
				extractInsightsFromExtendedGraphSummary(textVsSearchResultsResponse);

			// Step 5: Compare original text vs search queries
			const textVsSearchQueriesResponse = await makeInfraNodusRequest(
				"/graphsAndStatements?doNotSave=true&addStats=true&includeStatements=false&includeGraphSummary=false&extendedGraphSummary=true&includeGraph=false&compactGraph=true&compactStatements=true&aiTopics=true&compareMode=difference",
				{
					contexts: [
						{
							text: params.text,
							modifyAnalyzedText: "none",
						},
						{
							text: searchQueriesTopicsAndClusters.summary || "",
							modifyAnalyzedText: "none",
						},
					],
					aiTopics: "true",
				}
			);

			const textVsSearchQueriesInsights =
				extractInsightsFromExtendedGraphSummary(textVsSearchQueriesResponse);

			// Step 6: Compare search queries vs search results
			const queriesVsResultsResponse = await makeInfraNodusRequest(
				"/import/googleSearchVsIntentGraph?doNotSave=true&addStats=true&includeGraphSummary=false&extendedGraphSummary=true&includeGraph=false&includeStatements=true&compactGraph=true&compactStatements=true&aiTopics=true",
				{
					searchQuery: queries.join(","),
					aiTopics: "true",
					importLanguage: params.importLanguage,
					importCountry: params.importCountry,
				}
			);

			const queriesVsResultsInsights = extractInsightsFromExtendedGraphSummary(
				queriesVsResultsResponse
			);

			const topMissingQueries = extractStatementStrings(
				queriesVsResultsResponse
			);

			// Prepare the final results
			const seoResults: SEOResults = {
				inSearchResultsNotInText: textVsSearchResultsInsights,
				inSearchQueriesNotInText: textVsSearchQueriesInsights,
				inSearchQueriesNotInResults: queriesVsResultsInsights,
				topMissingQueries: topMissingQueries.statements,
			};

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(seoResults, null, 2),
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
