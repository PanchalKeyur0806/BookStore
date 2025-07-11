# get nodejs as a base image for application
FROM node

# set the working dir for the project
WORKDIR /BookStoreBackend

# copy all package.json file
COPY package*.json ./


# install all the depedency
RUN npm i

COPY . .

ENTRYPOINT [ "npm", "start" ]