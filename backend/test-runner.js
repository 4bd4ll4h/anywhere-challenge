#!/usr/bin/env node

/**
 * Test Runner Script for Anyware Backend
 * 
 * This script provides easy commands to run different types of tests
 * Usage: node test-runner.js [command]
 * 
 * Commands:
 *   all        - Run all tests
 *   auth       - Run authentication tests only
 *   quiz       - Run quiz tests only
 *   announcement - Run announcement tests only
 *   middleware - Run middleware tests only
 *   coverage   - Run tests with coverage report
 *   watch      - Run tests in watch mode
 */

const { spawn } = require('child_process');
const path = require('path');

const commands = {
  all: ['npm', ['test']],
  auth: ['npm', ['test', '--', '--testNamePattern=Auth']],
  quiz: ['npm', ['test', '--', '--testNamePattern=Quiz']],
  announcement: ['npm', ['test', '--', '--testNamePattern=Announcement']],
  middleware: ['npm', ['test', '--', '--testNamePattern=Middleware']],
  coverage: ['npm', ['run', 'test:coverage']],
  watch: ['npm', ['run', 'test:watch']]
};

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

function showHelp() {
  console.log(`
🧪 Anyware Backend Test Runner

Usage: node test-runner.js [command]

Commands:
  all          Run all tests
  auth         Run authentication tests only
  quiz         Run quiz controller tests only
  announcement Run announcement controller tests only
  middleware   Run middleware tests only
  coverage     Run tests with coverage report
  watch        Run tests in watch mode
  help         Show this help message

Examples:
  node test-runner.js all
  node test-runner.js auth
  node test-runner.js coverage
`);
}

async function main() {
  const command = process.argv[2] || 'help';

  if (command === 'help' || !commands[command]) {
    showHelp();
    return;
  }

  console.log(`🚀 Running ${command} tests...\n`);

  try {
    const [cmd, args] = commands[command];
    await runCommand(cmd, args);
    console.log(`\n✅ ${command} tests completed successfully!`);
  } catch (error) {
    console.error(`\n❌ ${command} tests failed:`, error.message);
    process.exit(1);
  }
}

main();