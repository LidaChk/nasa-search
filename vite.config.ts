import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { execSync } from 'child_process';

function getCurrentBranch() {
  try {
    // Get the current branch name using git command
    const branchName = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
    return branchName;
  } catch (error) {
    console.error('Error retrieving Git branch name:', error);
    return 'default'; // Fallback branch name
  }
}

export default defineConfig(({ command }: ConfigEnv): UserConfig => {
  const base: string =
    command === 'serve'
      ? '/'
      : `/react-rsschool-2025-deploy/${getCurrentBranch()}/`;

  return {
    base,
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          assetFileNames: (assetInfo: { name: string }): string => {
            if (/\.(png|jpe?g|gif|svg|ico|webp)$/i.test(assetInfo.name)) {
              return `assets/images/[name][extname]`;
            }
            return `assets/[name][extname]`;
          },
        },
      },
    },
    assetsInclude: ['/\.svg$/'],
  } as UserConfig;
});
