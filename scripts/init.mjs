#!/usr/bin/env node
/**
 * Interactive project initialization script
 * Configures the template for a new Starlight documentation site
 */

import { createInterface } from 'readline';
import { readFileSync, writeFileSync, rmSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt, defaultValue = '') {
  const suffix = defaultValue ? ` [${defaultValue}]` : '';
  return new Promise((resolve) => {
    rl.question(`${prompt}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function updateFile(path, replacements) {
  let content = readFileSync(path, 'utf8');
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replace(new RegExp(search, 'g'), replace);
  }
  writeFileSync(path, content);
}

async function main() {
  console.log('\n🚀 Starlight GitHub Pages Template Setup\n');
  console.log('This will configure your new documentation site.\n');

  // Gather information
  const projectName = await question('Project name', 'my-docs');
  const projectTitle = await question('Site title', 'My Documentation');
  const projectDesc = await question('Description', 'Documentation built with Astro Starlight');
  const githubUser = await question('GitHub username/org');
  const repoName = await question('Repository name', projectName);
  const isUserSite = (await question('Is this a user/org site (username.github.io)?', 'no'))
    .toLowerCase()
    .startsWith('y');

  console.log('\n📝 Configuration summary:');
  console.log(`   Project: ${projectName}`);
  console.log(`   Title: ${projectTitle}`);
  console.log(`   GitHub: ${githubUser}/${repoName}`);
  console.log(`   URL: https://${githubUser}.github.io${isUserSite ? '' : '/' + repoName}`);

  const proceed = (await question('\nProceed with setup?', 'yes')).toLowerCase().startsWith('y');

  if (!proceed) {
    console.log('Setup cancelled.');
    rl.close();
    process.exit(0);
  }

  console.log('\n⚙️  Configuring project...\n');

  // Update package.json
  const pkgPath = join(ROOT, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.name = projectName;
  pkg.description = projectDesc;
  delete pkg.scripts.init; // Remove init script after use
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('   ✓ Updated package.json');

  // Update astro.config.mjs
  updateFile(join(ROOT, 'astro.config.mjs'), {
    "const GITHUB_USER = 'your-username'": `const GITHUB_USER = '${githubUser}'`,
    "const REPO_NAME = 'your-repo-name'": `const REPO_NAME = '${repoName}'`,
    'const IS_USER_SITE = false': `const IS_USER_SITE = ${isUserSite}`,
    "title: 'My Documentation'": `title: '${projectTitle}'`,
    "description: 'Documentation built with Astro Starlight'": `description: '${projectDesc}'`,
    '// TODO:.*': '',
  });
  console.log('   ✓ Updated astro.config.mjs');

  // Update README
  const readmePath = join(ROOT, 'README.md');
  if (existsSync(readmePath)) {
    updateFile(readmePath, {
      '# Starlight GitHub Pages Template': `# ${projectTitle}`,
      'your-username': githubUser,
      'your-repo-name': repoName,
    });
    console.log('   ✓ Updated README.md');
  }

  // Update placeholder content
  const indexPath = join(ROOT, 'src/content/docs/index.mdx');
  if (existsSync(indexPath)) {
    updateFile(indexPath, {
      'your-username': githubUser,
      'your-repo-name': repoName,
    });
    console.log('   ✓ Updated placeholder content');
  }

  // Remove this init script
  const initScriptPath = join(ROOT, 'scripts/init.mjs');
  if (existsSync(initScriptPath)) {
    rmSync(initScriptPath);
    const scriptsDir = join(ROOT, 'scripts');
    try {
      rmSync(scriptsDir, { recursive: true });
    } catch {
      // Directory might have other files
    }
    console.log('   ✓ Removed init script');
  }

  // Initialize git if not already
  const gitDir = join(ROOT, '.git');
  if (!existsSync(gitDir)) {
    try {
      execSync('git init', { cwd: ROOT, stdio: 'pipe' });
      console.log('   ✓ Initialized git repository');
    } catch {
      console.log('   ⚠ Could not initialize git (git not available)');
    }
  }

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Run `make dev` or `npm run dev` to start the dev server');
  console.log('  2. Edit content in src/content/docs/');
  console.log('  3. Commit and push to GitHub');
  console.log('  4. Enable GitHub Pages: Settings → Pages → Source: GitHub Actions');
  console.log(
    `\nYour site will be available at: https://${githubUser}.github.io${isUserSite ? '' : '/' + repoName}\n`
  );

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
