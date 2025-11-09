// types/env.d.ts
declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string;
		NODE_ENV: string;
	}
}
