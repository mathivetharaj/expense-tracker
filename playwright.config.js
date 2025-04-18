import { defineConfig } from 'playwright/test';

export default defineConfig({
    testDir: './tests/ui',
    use: {
        baseURL: 'http://localhost:3000',
        headless: true,
    },
    webServer: {
        command: 'node server.js',
        port: 3000,
        reuseExistingServer: !process.env.CI,
    },
});
