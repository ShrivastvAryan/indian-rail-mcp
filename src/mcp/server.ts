import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerRailTools, type ToolOptions } from "./tools.ts";

export const SERVER_NAME = "indian-rail";

// Read from the manifest rather than a literal: this file sits two levels below
// the package root in both src/ and dist/, so the path holds either way. A
// hardcoded version silently drifts from the published one on every release.
const require = createRequire(import.meta.url);
export const SERVER_VERSION: string = require("../../package.json").version;

/**
 * Build an MCP server exposing the Indian Railways tools.
 *
 * `allowPnr` gates the one tool that returns passenger personal data; the
 * transport decides it, normally from an API key on the request.
 */
export function createRailMcpServer(opts: ToolOptions): McpServer {
	const server = new McpServer(
		{ name: SERVER_NAME, version: SERVER_VERSION },
		{
			capabilities: { tools: {} },
			instructions:
				"Indian Railways data from official sources (NTES and IRCTC). " +
				"Station arguments accept either a code (NDLS) or a full name (NEW DELHI). " +
				"Dates are DD-MM-YYYY. Seat availability comes from the reservation chart " +
				"and is only meaningful once chartPrepared is true."
		}
	);

	registerRailTools(server, opts);
	return server;
}
