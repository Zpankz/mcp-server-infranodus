# InfraNodus MCP Server

A Model Context Protocol (MCP) server that integrates InfraNodus knowledge graph and text network analysis capabilities into LLM workflows and AI assistants like Claude Desktop.

## Overview

InfraNodus MCP Server enables LLM workflows and AI assistants to analyze text using advanced network science algorithms, generate knowledge graphs, detect content gaps, and identify key topics and concepts. It transforms unstructured text into structured insights using graph theory and network analysis.

![InfraNodus MCP Server](https://infranodus.com/images/front/infranodus-overview.jpg)

## Features

### You Can Use It To

- Connect your existing InfraNodus knowledge graphs to your LLM workflows and AI chats
- Identify the main topical clusters in discourse without missing the important nuances (works better than standard LLM workflows)
- Identify the content gaps in any discourse (helpful for content creation and research)
- Generate new knowledge graphs from any text and use them to augment your LLM responses

### Available Tools

1. **generate_knowledge_graph**

   - Convert any text into a visual knowledge graph
   - Extract topics, concepts, and their relationships
   - Identify structural patterns and clusters
   - Apply AI-powered topic naming
   - Perform entity detection for cleaner graphs

2. **analyze_existing_graph_by_name**

   - Retrieve and analyze existing graphs from your InfraNodus account
   - Access previously saved analyses
   - Export graph data with full statistics

3. **generate_content_gaps**

   - Detect missing connections in discourse
   - Identify underexplored topics
   - Generate research questions
   - Suggest content development opportunities

4. **generate_topical_clusters**

   - Generate topics and clusters of keywords from text using knowledge graph analysis
   - Make sure to beyond genetic insights and detect smaller topics
   - Use the topical clusters to establish topical authority for SEO

5. **generate_research_questions**

   - Generate research questions that bridge content gaps
   - Use them as prompts in your LLM models and AI workflows
   - Use any AI model (included in InfraNodus API)
   - Content gaps are identified based on topical clustering

6. **generate_research_questions**

   - Generate research questions based on an existing InfraNodus graph
   - Use them as prompts in your LLM models
   - Use any AI model (included in InfraNodus API)
   - Content gaps are identified based on topical clustering

7. **generate_responses_from_graph**

   - Generate responses based on an existing InfraNodus graph
   - Integrate them into your LLM workflows and AI assistants
   - Use any AI model (included in InfraNodus API)
   - Use any prompt

8. **generate_text_overview**

   - Generate a topical overview of a text and provide insights for LLMs to generate better responses
   - Use it to get a high-level understanding of a text
   - Use it to augment prompts in your LLM workflows and AI assistants

9. **create_knowledge_graph**

   - Create a knowledge graph in InfraNodus from text and provide a link to it
   - Use it to create a knowledge graph in InfraNodus from text

10. **generate_overlap_graph**

- Create knowledge graphs from two or more texts and find the overlap (similarities) between them
- Use it to find similar topics and keywords across different texts

11. **generate_difference_graph**

- Compare knowledge graphs from two or more texts and find what's not present in the first graph that's present in the others
- Use it to find how one text can be enriched with the others

12. **generate_google_search_graph**

- Generate a graph with keywords and topics for Google search results for a certain query
- Use it to understand the current informational supply (what people find)

13. **generate_search_queries_graph**

- Generate a graph from the search queries suggested by Google for a certain query
- Use it to understand the current informational demand (what people are looking for)

14. **generate_search_results_vs_queries_graph**

- Generate a graph of keyword combinations and topics people tend to search for that do not readily appear in the search results for the same queries
- Use it to understand what people search for but don't yet find

15. **search**

- Search through existing InfraNodus graphs
- Also use it to search through the public graphs of a specific user
- Compatible with ChatGPT Deep Research mode via Developer Mode > Connectors

16. **fetch**

- Fetch a specific search result for a graph
- Can be used in ChatGPT Deep Research mode via Developer Mode > Connectors

_More capabilites coming soon!_

### Key Capabilities

- **Topic Modeling**: Automatic clustering and categorization of concepts
- **Content Gap Detection**: Find missing links between concept clusters
- **Entity Recognition**: Clean extraction of names, places, and organizations
- **AI Enhancement**: Optional AI-powered topic naming and analysis
- **Structural Analysis**: Identify influential nodes and community structures
- **Network Structure Statistics**: Modularity, centrality, betweenness, and other graph metrics

## Installation

### Prerequisites

- Node.js 18+ installed
- InfraNodus API key (get yours at [https://infranodus.com/api-access](https://infranodus.com/api-access))

### Setup Steps

1. **Clone and build the server:**

   ```bash
   git clone https://github.com/yourusername/mcp-server-infranodus.git
   cd mcp-server-infranodus
   npm install
   npm run build
   ```

2. **Set up your API key:**

   Create a `.env` file in the project root:

   ```
   INFRANODUS_API_KEY=your-api-key-here
   ```

3. **Inspect the MCP:**

   ```bash
   npm run inspect
   ```

### Claude Desktop Configuration (macOS)

1. Open your Claude Desktop configuration file:

   ```bash
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. Add the InfraNodus server configuration:

   ```json
   {
   	"mcpServers": {
   		"infranodus": {
   			"command": "node",
   			"args": ["/absolute/path/to/mcp-server-infranodus/dist/index.js"],
   			"env": {
   				"INFRANODUS_API_KEY": "your-api-key-here"
   			}
   		}
   	}
   }
   ```

3. Restart Claude Desktop to load the new server.

### Claude Desktop Configuration (Windows)

1. Open your Claude Desktop configuration file:

   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Add the InfraNodus server configuration:

   ```json
   {
   	"mcpServers": {
   		"infranodus": {
   			"command": "node",
   			"args": ["C:\\path\\to\\mcp-server-infranodus\\dist\\index.js"],
   			"env": {
   				"INFRANODUS_API_KEY": "your-api-key-here"
   			}
   		}
   	}
   }
   ```

3. Restart Claude Desktop.

### Other MCP-Compatible Applications

For other applications supporting MCP, use the following command to start the server:

```bash
INFRANODUS_API_KEY=your-api-key node /path/to/mcp-server-infranodus/dist/index.js
```

The server communicates via stdio, so configure your application to run this command and communicate through standard input/output.

## Usage Examples

Once installed, you can ask Claude to:

- "Use InfraNodus to analyze this text and show me the main topics"
- "Generate a knowledge graph from this document"
- "Find content gaps in this article"
- "Retrieve my existing graph called 'Research Notes' from InfraNodus"
- "What are the structural gaps in this text?"
- "Identify the most influential concepts in this content"

## Development

### Running in Development Mode

```bash
npm run dev
```

### Using the MCP Inspector

Test the server with the MCP Inspector:

```bash
npm run inspect
```

### Building from Source

```bash
npm run build
```

### Watching for Changes

```bash
npm run watch
```

## API Documentation

### generate_knowledge_graph

Analyzes text and generates a knowledge graph.

**Parameters:**

- `text` (string, required): The text to analyze
- `includeStatements` (boolean): Include original statements in response
- `modifyAnalyzedText` (string): Text modification options ("none", "entities", "lemmatize")

### analyze_existing_graph_by_name

Retrieves and analyzes an existing graph from your InfraNodus account.

**Parameters:**

- `graphName` (string, required): Name of the existing graph
- `includeStatements` (boolean): Include statements in response
- `includeGraphSummary` (boolean): Include graph summary

### generate_content_gaps

Identifies content gaps and missing connections in text.

**Parameters:**

- `text` (string, required): The text to analyze for gaps

## Troubleshooting

### Server doesn't appear in Claude

1. Verify the configuration file path is correct
2. Check that the API key is valid
3. Ensure Node.js is in your system PATH
4. Restart Claude Desktop completely

### API Key Issues

- Get your API key at: [https://infranodus.com/api-access](https://infranodus.com/api-access)
- Ensure the key is correctly set in the configuration
- Check that the key has not expired

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Resources

- [InfraNodus Website](https://infranodus.com)
- [InfraNodus API Documentation](https://infranodus.com/api-access)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Graph Theory Concepts](https://noduslabs.com/research/)

## License

MIT

## Support

For issues related to:

- This MCP server: Open an issue in this repository
- InfraNodus API: Contact support@infranodus.com
- MCP Protocol: Visit the [MCP community](https://modelcontextprotocol.io)
