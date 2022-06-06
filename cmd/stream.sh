#!/usr/bin/env bash
#

set -euo pipefail
PROG_NAME=$(basename ${0})
PROG_DIR=$(dirname $(readlink -f ${0}))
TOP_DIR=${PROG_DIR}/..

. ${TOP_DIR}/.env

stream_to_twitch() {
    ffmpeg \
      -loglevel error \
      -re \
      -i  ${STREAM_INPUT} \
      -b:v 5M \
      -b:a 128k \
      -ar 44100 \
      -acodec aac \
      -vcodec libx264 \
      -preset medium  \
      -crf 28 \
      -threads 4 \
      -f flv rtmp://${TWITCH_SERVER}/app/${TWITCH_KEY}

}

stream_to_twitch
