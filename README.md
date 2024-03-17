# Sandbox frontend

More details to come here

## Deployment

```
export sha=$(cat .git/refs/heads/main)
npm install
npm run build
cd ..
git clone git@github.com:livemusiclocator/livemusiclocator.github.io.git
cd livemusiclocator.github.io
rm index.html
rm -rf assets
cp -r ../lml_frontend_client/dist/* .
git add .
git commit -m "Release $(sha)"
git push
```
