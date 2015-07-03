#!/bin/bash
echo "What do you want your project to be called?"

read project_name

mkdir $project_name
cd $project_name

git init
git pull git@github.com:mobify/astro-scaffold.git --depth 1
git submodule update --init
