import type { StorybookConfig } from "@storybook/nextjs";

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config: StorybookConfig = {
	stories: [
		"../src/**/*.mdx",
		"../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@storybook/addon-interactions",
	],
	framework: {
		name: "@storybook/nextjs",
		options: {},
	},
	docs: {
		autodocs: "tag",
	},
	webpackFinal: async (config, { configType }) => {
		// @ts-ignore
		config.resolve.plugins = [new TsconfigPathsPlugin()];
		return config;
	}
};
export default config;
