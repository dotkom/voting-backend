#!/bin/sh

docker build -f Dockerfile --platform linux/amd64 -t voting/prod/backend:latest .
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 891459268445.dkr.ecr.eu-north-1.amazonaws.com

docker tag voting/prod/backend:latest 891459268445.dkr.ecr.eu-north-1.amazonaws.com/voting/prod/backend:latest &&
  docker push 891459268445.dkr.ecr.eu-north-1.amazonaws.com/voting/prod/backend:latest
