import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ToolHandlerContext } from "../types/index.js";

/**
 * Helper class for reporting progress during tool execution
 */
export class ProgressReporter {
	private server?: Server;
	private progressToken?: string | number;
	private total: number;

	constructor(context: ToolHandlerContext, total: number = 100) {
		this.server = context.server;
		this.progressToken = context.progressToken;
		this.total = total;
	}

	/**
	 * Report progress to the client
	 * @param progress Current progress value (0-100 by default)
	 * @param message Optional message to display
	 */
	async report(progress: number, message?: string): Promise<void> {
		// If no server or progress token, skip notification
		if (!this.server || this.progressToken === undefined) {
			return;
		}

		try {
			// Send progress notification using MCP protocol
			await this.server.notification({
				method: "notifications/progress",
				params: {
					progressToken: this.progressToken,
					progress,
					total: this.total,
					...(message ? { message } : {}),
				},
			});
		} catch (error) {
			// Silently fail - progress notifications are optional
			// Only log if there's an actual error (not just unsupported)
			if (error instanceof Error && !error.message.includes("not supported")) {
				console.error("Progress notification error:", error.message);
			}
		}
	}

	/**
	 * Check if progress reporting is available
	 */
	isAvailable(): boolean {
		return !!(this.server && this.progressToken);
	}
}
