#!/bin/bash
cp config/{local-sample,local}.js
grunt db:migrate:up
sails lift
