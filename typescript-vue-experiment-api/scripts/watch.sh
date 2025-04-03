find src -name "*.css" > .files_to_watch
find ./src -name "*.vue" -o -name "*.json" -o -name "*.ts" -o -name "*.js" >> .files_to_watch
cat .files_to_watch | entr -c pnpm run build
rm .files_to_watch
