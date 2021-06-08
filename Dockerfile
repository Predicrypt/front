# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:12.18.2 as build-stage
WORKDIR /app
ARG GITHUB_TOKEN
COPY .npmrc .npmrc 
COPY package*.json /app/
RUN npm install
COPY ./ /app/
EXPOSE 80
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
#Copy ci-dashboard-dist
COPY --from=build-stage /app/dist/predicrypt /usr/share/nginx/html
#Copy default nginx configuration
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf