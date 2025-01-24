#!/usr/bin/env bash

domains=(
  "gigs.lml-development.live"
  "lbmf.lml-development.live"
  "melbourne.lml-development.live"
  "sydney.lml-development.live"
  "brisbane.lml-development.live"
  "perth.lml-development.live"
  "adelaide.lml-development.live"
  "castlemaine.lml-development.live"
  "goldfields.lml-development.live"
)

for domain in "${domains[@]}"; do
  if [[ -z $(cat /etc/hosts | grep -e $domain) ]]; then
    echo "$domain missing from hosts file, adding now"
    echo "127.0.0.1 $domain" | sudo tee -a /etc/hosts
  fi
done

caddy run

