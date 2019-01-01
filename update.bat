@echo off
SET count=1
 FOR /f "tokens=*" %%f IN ('dir sass/b') DO (
 sass sass/%%~nf.scss public/%%~nf.css
 set /a count+=1 )
