#!/bin/bash

clinic doctor --autocannon [ -m POST /login -b '{"email": "andrew.keig@gmail.com", "password": ""}' ] -- node load/server.js