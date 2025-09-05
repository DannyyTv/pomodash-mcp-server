# Use official Node.js runtime as base image
## ---------- Builder stage ----------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Ensure dev dependencies are installed for the build
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies for build (TypeScript)
# Explicitly include dev deps to avoid environment-specific omissions
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

## ---------- Runtime stage ----------
FROM node:22-alpine AS runtime

# Set working directory
WORKDIR /app

# Copy only package files first and install production deps
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S mcp -u 1001

# Change to non-root user
USER mcp

# Expose port (though MCP uses stdio)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Run the MCP server
CMD ["node", "dist/index.js"]