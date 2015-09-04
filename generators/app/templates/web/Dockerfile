FROM node:latest
EXPOSE 80 443
ADD dist /dist/
WORKDIR /dist
RUN npm install --production --allow-root
RUN npm install -g bower
RUN bower install --production --allow-root
CMD npm start
