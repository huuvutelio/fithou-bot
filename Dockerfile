FROM node:16-alpine
WORKDIR /app

COPY package*.json ./
# Clean the npm cache before installing dependencies
RUN npm cache clean --force

RUN npm install -f
COPY . .
CMD ["npm", "run", "start-ts"]