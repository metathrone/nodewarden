import { bindings, defineConfig, exports, triggers } from "cf/config";

export default defineConfig({
	worker: {
		name: "nodewarden",
		compatibilityDate: "2024-01-01",
		entrypoint: "src/index.ts",
		assets: {
			htmlHandling: "none",
			notFoundHandling: "single-page-application",
			runWorkerFirst: true,
		},
		domains: [
			"warden.inory.eu.org",
		],
		triggers: [
			triggers.scheduled({
				schedule: "*/5 * * * *",
			}),
		],
		env: {
			DB: bindings.d1({
				name: "nodewarden-db",
			}),
			ATTACHMENTS: bindings.r2({
				name: "nodewarden-attachments",
			}),
			NOTIFICATIONS_HUB: bindings.durableObject({
				worker: "nodewarden",
				exportName: "NotificationsHub",
			}),
			BACKUP_TRANSFER_RUNNER: bindings.durableObject({
				worker: "nodewarden",
				exportName: "BackupTransferRunner",
			}),
			ASSETS: bindings.assets(),
		},
		exports: {
			NotificationsHub: exports.durableObject({
				storage: "sqlite",
			}),
			BackupTransferRunner: exports.durableObject({
				storage: "sqlite",
			}),
		},
	},
});
