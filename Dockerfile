# Dockerfile

FROM node:20.19.0

WORKDIR /home/node/app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --build-from-source

# Копируем остальной код
COPY . .
RUN npx prisma generate
# Указываем команду для запуска
CMD ["npm", "run", "start"]