import { z } from "zod";

export const GenerateGraphSchema = z.object({
	text: z
		.string()
		.min(1, "Text is required for analysis")
		.describe("Text that you'd like to analyze"),
	includeStatements: z
		.boolean()
		.default(false)
		.describe(
			"Include processed statements in response (add only if explicitly needed)"
		),
	includeGraph: z
		.boolean()
		.default(false)
		.describe(
			"Include full graph structure in response (add only if explicitly needed)"
		),
	addNodesAndEdges: z
		.boolean()
		.default(false)
		.describe(
			"Include nodes and edges in response (add only if explicitly needed, not recommended for longer texts)"
		),
	modifyAnalyzedText: z
		.enum(["none", "detectEntities", "extractEntitiesOnly"])
		.default("none")
		.describe(
			"Entity detection: none (normal), detectEntities (detect entities and keywords), extractEntitiesOnly (only entities)"
		),
});

export const CreateGraphSchema = z.object({
	graphName: z
		.string()
		.min(1, "Graph name is required")
		.describe("Name of the graph to create in InfraNodus"),
	text: z
		.string()
		.min(1, "Text is required for analysis")
		.describe("Text that you'd like to analyze"),
	includeStatements: z
		.boolean()
		.default(false)
		.describe(
			"Include processed statements in response (add only if explicitly needed)"
		),
	includeGraph: z
		.boolean()
		.default(false)
		.describe(
			"Include full graph structure in response (add only if explicitly needed)"
		),
	addNodesAndEdges: z
		.boolean()
		.default(false)
		.describe(
			"Include nodes and edges in response (add only if explicitly needed, not recommended for longer texts)"
		),
	modifyAnalyzedText: z
		.enum(["none", "detectEntities", "extractEntitiesOnly"])
		.default("none")
		.describe(
			"Entity detection: none (normal), detectEntities (detect entities and keywords), extractEntitiesOnly (only entities)"
		),
});

export const AnalyzeExistingGraphSchema = z.object({
	graphName: z
		.string()
		.min(1, "Graph name is required")
		.describe(
			"Name of the existing InfraNodus graph in your account to retrieve"
		),
	includeStatements: z
		.boolean()
		.default(true)
		.describe(
			"Include processed statements in response (add only if explicitly needed)"
		),
	includeGraph: z
		.boolean()
		.default(false)
		.describe(
			"Include full graph structure in response (add only if explicitly needed)"
		),
	addNodesAndEdges: z
		.boolean()
		.default(false)
		.describe(
			"Include nodes and edges in response (add only if explicitly needed, not recommended for longer texts)"
		),
	includeGraphSummary: z
		.boolean()
		.default(false)
		.describe("Include AI-generated graph summary for RAG prompt augmentation"),
	modifyAnalyzedText: z
		.enum(["none", "detectEntities", "extractEntitiesOnly"])
		.default("none")
		.describe(
			"Entity detection: none (normal), detectEntities (detect entities and keywords), extractEntitiesOnly (only entities)"
		),
});

export const SearchExistingGraphsSchema = z.object({
	query: z
		.string()
		.min(1, "Search query is required")
		.describe("Query to search for in existing InfraNodus graphs"),
	contextNames: z
		.array(z.string())
		.default([])
		.describe(
			"Names of the existing InfraNodus graphs to search in (comma-separated list, empty for all)"
		),
});

export const SearchExistingGraphsFetchSchema = z.object({
	id: z
		.string()
		.min(1, "ID of the Search Result is required")
		.describe(
			"ID of the search result to retrieve (username:graph_name:search_query"
		),
});

export const GenerateContentGapsSchema = z.object({
	text: z
		.string()
		.min(1, "Text is required for analysis")
		.describe("Text that you'd like to retrieve content gaps from"),
});

export const GenerateTextOverviewSchema = z.object({
	text: z
		.string()
		.min(1, "Text is required for analysis")
		.describe("Text that you'd like to get an overview of"),
});

export const GenerateTopicalClustersSchema = z.object({
	text: z
		.string()
		.min(1, "Text is required for analysis")
		.describe(
			"Text that you'd like to retrieve topics and topical clusters from"
		),
});

export const GenerateResearchQuestionsSchema = z.object({
	text: z
		.string()
		.min(1, "Text is required for analysis")
		.describe("Text that you'd like to generate research questions from"),
	useSeveralGaps: z
		.boolean()
		.default(false)
		.describe("Generate questions for several content gaps found in text"),
	gapDepth: z
		.number()
		.default(0)
		.describe("Depth of content gaps to generate questions for"),
	modelToUse: z
		.enum([
			"claude-opus-4.1",
			"claude-sonnet-4",
			"gemini-2.5-flash",
			"gemini-2.5-flash-lite",
			"gpt-4o",
			"gpt-4o-mini",
			"gpt-5",
			"gpt-5-mini",
		])
		.default("gpt-4o")
		.describe(
			"AI model to use for generating research questions: claude-opus-4.1, claude-sonnet-4, gemini-2.5-flash, gemini-2.5-flash-lite, gpt-4o, gpt-4o-mini, gpt-5, gpt-5-mini"
		),
});

export const GenerateResearchQuestionsFromGraphSchema = z.object({
	graphName: z
		.string()
		.min(1, "Graph name is required")
		.describe(
			"Name of the existing InfraNodus graph in your account to retrieve"
		),
	useSeveralGaps: z
		.boolean()
		.default(false)
		.describe("Generate questions for several content gaps found in text"),
	gapDepth: z
		.number()
		.default(0)
		.describe("Depth of content gaps to generate questions for"),
	modelToUse: z
		.enum([
			"claude-opus-4.1",
			"claude-sonnet-4",
			"gemini-2.5-flash",
			"gemini-2.5-flash-lite",
			"gpt-4o",
			"gpt-4o-mini",
			"gpt-5",
			"gpt-5-mini",
		])
		.default("gpt-4o")
		.describe(
			"AI model to use for generating research questions: claude-opus-4.1, claude-sonnet-4, gemini-2.5-flash, gemini-2.5-flash-lite, gpt-4o, gpt-4o-mini, gpt-5, gpt-5-mini"
		),
});

export const GenerateResponsesFromGraphSchema = z.object({
	graphName: z
		.string()
		.min(1, "Graph name is required")
		.describe(
			"Name of the existing InfraNodus graph in your account to retrieve"
		),
	prompt: z
		.string()
		.min(1, "Prompt is required")
		.describe("Prompt to generate responses to from the graph"),
	modelToUse: z
		.enum([
			"claude-opus-4.1",
			"claude-sonnet-4",
			"gemini-2.5-flash",
			"gemini-2.5-flash-lite",
			"gpt-4o",
			"gpt-4o-mini",
			"gpt-5",
			"gpt-5-mini",
		])
		.default("gpt-4o")
		.describe(
			"AI model to use for generating research questions: claude-opus-4.1, claude-sonnet-4, gemini-2.5-flash, gemini-2.5-flash-lite, gpt-4o, gpt-4o-mini, gpt-5, gpt-5-mini"
		),
});

// This is used for adding options later to each tool
export const GenerateGeneralGraphSchema = z.object({
	text: z
		.string()
		.min(1, "Text is required for analysis")
		.describe("Text that you'd like to analyze"),
	doNotSave: z
		.boolean()
		.default(true)
		.describe("Don't save the text to the InfraNodus graph"),
	addStats: z.boolean().default(true).describe("Include network statistics"),
	includeStatements: z
		.boolean()
		.default(true)
		.describe(
			"Include processed statements in response (add only if explicitly needed)"
		),
	includeGraph: z
		.boolean()
		.default(false)
		.describe(
			"Include full graph structure in response (add only if explicitly needed)"
		),
	addNodesAndEdges: z
		.boolean()
		.default(false)
		.describe(
			"Include nodes and edges in response (add only if explicitly needed, not recommended for longer texts)"
		),
	includeGraphSummary: z
		.boolean()
		.default(true)
		.describe("Include AI-generated graph summary for RAG prompt augmentation"),
	extendedGraphSummary: z
		.boolean()
		.default(true)
		.describe("Include extended graph summary"),
	aiTopics: z
		.boolean()
		.default(true)
		.describe("Generate AI names for topics (uses OpenAI)"),
	modifyAnalyzedText: z
		.enum(["none", "detectEntities", "extractEntitiesOnly"])
		.default("none")
		.describe(
			"Entity detection: none (normal), detectEntities (detect entities and keywords), extractEntitiesOnly (only entities)"
		),
});

export const GenerateOverlapGraphFromTextsSchema = z.object({
	contexts: z
		.array(
			z.object({
				text: z
					.string()
					.min(1, "Text is required for analysis")
					.describe("Text that you'd like to analyze"),
				modifyAnalyzedText: z
					.enum(["none", "detectEntities", "extractEntitiesOnly"])
					.default("none")
					.describe(
						"Entity detection: none (normal), detectEntities (detect entities and keywords), extractEntitiesOnly (only entities)"
					),
			})
		)
		.min(2, "At least two contexts are required")
		.describe(
			"Array of the texts to analyze and find overlaps for. Example: [text1, text2, ...]"
		),
	includeStatements: z
		.boolean()
		.default(false)
		.describe(
			"Include processed statements in response (add only if explicitly needed)"
		),
	includeGraph: z
		.boolean()
		.default(false)
		.describe(
			"Include full graph structure in response (add only if explicitly needed)"
		),
	addNodesAndEdges: z
		.boolean()
		.default(false)
		.describe(
			"Include nodes and edges in response (add only if explicitly needed, not recommended for longer texts)"
		),
});

export const GenerateDifferenceGraphFromTextsSchema = z.object({
	contexts: z
		.array(
			z.object({
				text: z
					.string()
					.min(1, "Text is required for analysis")
					.describe(
						"Text content - First element is the target text to analyze for missing parts, subsequent elements are reference texts to identify what's missing"
					),
				modifyAnalyzedText: z
					.enum(["none", "detectEntities", "extractEntitiesOnly"])
					.default("none")
					.describe(
						"Entity detection: none (normal), detectEntities (detect entities and keywords), extractEntitiesOnly (only entities)"
					),
			})
		)
		.min(
			2,
			"At least two contexts are required - one target text and one reference text"
		)
		.describe(
			"Array of texts where the FIRST text is analyzed for missing parts compared to the REMAINING reference texts. Example: [targetText, referenceText1, referenceText2, ...]"
		),
	includeStatements: z
		.boolean()
		.default(false)
		.describe(
			"Include processed statements in response (add only if explicitly needed)"
		),
	includeGraph: z
		.boolean()
		.default(false)
		.describe(
			"Include full graph structure in response (add only if explicitly needed)"
		),
	addNodesAndEdges: z
		.boolean()
		.default(false)
		.describe(
			"Include nodes and edges in response (add only if explicitly needed, not recommended for longer texts)"
		),
});

export const GenerateGoogleSearchResultsGraphSchema = z.object({
	queries: z
		.array(z.string())
		.min(1, "Queries are required for analysis")
		.describe(
			"Queries that you'd like to get Google search results for, can be comma-separated for multiple queries"
		),
	includeSearchResultsOnly: z
		.boolean()
		.default(false)
		.describe(
			"Only include search results in the response (do not include the knowledge graph and keywords)"
		),
	showGraphOnly: z
		.boolean()
		.default(true)
		.describe(
			"Only include the graph structure and keywords in the response (do not include the search results)"
		),
	showExtendedGraphInfo: z
		.boolean()
		.default(false)
		.describe(
			"Include extended graph information in the response (add only if explicitly needed)"
		),
});

export const GenerateGoogleSearchQueriesGraphSchema = z.object({
	queries: z
		.array(z.string())
		.min(1, "Queries are required for analysis")
		.describe(
			"Queries that you'd like to get Google related queries for, can be comma-separated for multiple queries"
		),
	includeSearchQueriesOnly: z
		.boolean()
		.default(false)
		.describe(
			"Only include search queries in the response (do not include the knowledge graph and keywords)"
		),
	keywordsSource: z
		.enum(["related", "adwords"])
		.default("related")
		.describe(
			"Source of keywords to use for the graph: related (Google suggestions) or adwords (Google Ads suggestions - broader range)"
		),
	showGraphOnly: z
		.boolean()
		.default(true)
		.describe(
			"Only include the graph structure and keywords in the response (do not include the search queries)"
		),
	showExtendedGraphInfo: z
		.boolean()
		.default(false)
		.describe(
			"Include extended graph information in the response (add only if explicitly needed)"
		),
});
