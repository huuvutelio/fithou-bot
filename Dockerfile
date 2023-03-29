FROM zenika/alpine-chrome:with-node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /usr/src/app
COPY --chown=chrome package*.json ./

RUN npm install -f
COPY --chown=chrome . ./

RUN [ "echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p" ]
ENTRYPOINT ["tini", "--"]
CMD ["npm", "run", "start-ts"]
