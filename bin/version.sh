#!/bin/sh

version_file=src/app.version.ts
> $version_file
echo "export const appVersion = \"$1\";" >> $version_file
