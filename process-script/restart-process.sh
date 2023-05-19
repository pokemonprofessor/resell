rm -r ../dist
yarn build
pm2 restart ../dist/app.js