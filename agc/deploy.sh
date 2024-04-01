#!/bin/bash

# yarn build

ssh tales@128.140.9.241 'rm -rf /home/tales/build'

scp -r build tales@128.140.9.241:/home/tales

ssh tales@128.140.9.241 'docker-compose  -f /home/tales/front/docker-compose.yml down' 
ssh tales@128.140.9.241 'docker-compose  -f /home/tales/front/docker-compose.yml up -d'
