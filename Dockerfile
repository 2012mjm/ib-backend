FROM node:6.11.2

RUN npm install -g grunt-cli db-migrate-mysql sails


RUN mkdir /chat-server
WORKDIR /chat-server
COPY package.json /chat-server/package.json
RUN npm install

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

COPY . /chat-server


ENTRYPOINT [ "/bin/bash", "startup.bash" ]


