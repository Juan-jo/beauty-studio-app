#!/bin/bash

echo "🚀 Building Angular..."

ng build --configuration production  --base-href /beauty-studio/

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "🧹 Cleaning old deployment..."
sudo rm -rf /var/www/html/beauty-studio

echo "📦 Moving new build..."
sudo mv dist/beauty-studio-pwa /var/www/html/beauty-studio
sudo cp -r /var/www/html/beauty-studio/browser/* /var/www/html/beauty-studio/


echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data /var/www/html/beauty-studio
sudo chmod -R 755 /var/www/html/beauty-studio

echo "✅ Deploy complete: http://localhost/beauty-studio/"
