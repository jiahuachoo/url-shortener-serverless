@echo off

if [%1]==[] goto usage

curl --header "Content-Type: application/json" --request POST --data "{""url"":""%1""}" https://ck26kd3m95.execute-api.ap-southeast-2.amazonaws.com/dev/shorten

goto end

:usage
@echo Usage: %0 ^<the url to shorten^>
:end
exit /B 1