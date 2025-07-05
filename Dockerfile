# Node v20 as the base image
FROM node:20.10

# Create a new user to our new container and avoid the root user
ENV HOME=/usr/src

WORKDIR $HOME/tri-jurisdiction

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3400

CMD ["npm", "start"]
