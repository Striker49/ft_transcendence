FROM node:22.9.0

# Set the working directory
WORKDIR /frontend

# Copy your source code into the container
COPY core .

# Install serve globally
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 8080

# Serve a specific file (e.g., index.html)
CMD ["serve", "-s", ".", "-l", "8080"]
