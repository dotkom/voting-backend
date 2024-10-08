# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the Prisma schema to the working directory
COPY ./prisma/schema.prisma ./prisma/

# Generate Prisma client
RUN yarn prisma generate

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN yarn run build

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["yarn", "start"]