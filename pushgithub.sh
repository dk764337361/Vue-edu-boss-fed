#!/usr/bin/env sh

git init

git add .   

git commit -m “教育后台管理系统” 

#//链接远程仓库地址，创建主分支()
git remote add origin https://github.com/dk764337361/Vue-edu-boss-fed.git main

git push -f https://github.com/dk764337361/Vue-edu-boss-fed.git

git push -u origin main 
