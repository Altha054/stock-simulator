import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerAutogen from "swagger-autogen";
import { version } from "../../package.json";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const outputFile = path.join(__dirname, "..", "swagger-output.json");
const endpointsFiles = [path.join(__dirname, "..", "routes.ts")];

function swaggerDocs(app: Express, port: number) {
	const doc = {
		info: {
			title: "Stock Trading Simulator API",
			description: "A REST API for the Stock Trading Simulator",
			version,
		},
		host: "0.0.0.0:" + port,
		securityDefinitions: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		servers: [
			{ url: process.env.STOTRA_SERVER_URL || `http://0.0.0.0:${port}` },
		],
	};

	swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
		.then(() => {
			if (fs.existsSync(outputFile)) {
				const swaggerDocument = require(outputFile);
				app.use(
					"/api/docs",
					swaggerUi.serve,
					swaggerUi.setup(swaggerDocument, {
						swaggerOptions: { persistAuthorization: true },
					}),
				);
				console.log(`✅ Swagger docs available at http://0.0.0.0:${port}/api/docs`);
			} else {
				console.error("❌ swagger-output.json not found. Please generate it first.");
			}
		})
		.catch((err) => {
			console.error("❌ Error generating Swagger documentation:", err);
		});
}

export { swaggerDocs };
