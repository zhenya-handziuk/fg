#!/bin/bash

CONF_DIR=.

# Create a random password of length specified by $1
function randpwd()
{
  LENGTH=25
  if [ ! -z "$1" ] && [ $1 -gt 1 ]; then
    LENGTH=$1
  fi
  NUMBYTES=$(echo $LENGTH | awk '{print int($1*1.16)+1}')

  openssl rand -base64 $NUMBYTES | tr -d "=+/" | cut -c1-$LENGTH
}

if [ ! -f "${CONF_DIR}"/.env ]; then
  {
    echo "ENV=${ENV:-local}"
    echo "HOST=${HOST:-http://localhost}"
    echo "PORT=${PORT:-3200}"
    echo "NAME=${NAME:-api}"
    echo "DEVELOPERS=${DEVELOPERS:-}"
    echo "HTTP_ALLOW_ORIGIN=${DEVELOPERS:-}"
    echo "POSTGRES_HOST=${POSTGRES_HOST:-localhost}"
    echo "POSTGRES_PORT=${POSTGRES_PORT:-5432}"
    echo "POSTGRES_USER=${POSTGRES_USER:-}"
    echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-}"
    echo "POSTGRES_DB=${POSTGRES_DB:-}"
    echo "POSTGRES_SCHEMA=${POSTGRES_SCHEMA:-public}"
  } >> "${CONF_DIR}"/.env
fi
