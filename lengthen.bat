@echo off

if [%1]==[] goto usage

curl --header "Content-Type: application/json" --request POST --data "{""url"":""%1""}" https://ck26kd3m95.execute-api.ap-southeast-2.amazonaws.com/dev/lengthen
goto end

:usage
@echo Usage: %0 ^<the short url to lengthen^>
:end
exit /B 1