#!/bin/bash
set -e

# Install dependencies
npm install --legacy-peer-deps

# Install Prisma globally
npm install -g prisma

# Generate Prisma client
npx prisma generate

# Build the application
npm run build
