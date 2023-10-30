FROM node:20.9.0
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
ENV DB_URI="mongodb+srv://ma:GLFSprUBQUY3UFTb@cluster0.mpypgcl.mongodb.net/social-app"
ENV PORT=8080
ENV TOKEN="f3495a8c5fdb59de4af1807e45aa23d12f465d1cd69d46e6589ae338f6c54909670ecba4f5aee540d04e4b3890e8537653582fdde13d5d6152e5c634e7232069"
EXPOSE 8080
CMD [ "npm","start" ]