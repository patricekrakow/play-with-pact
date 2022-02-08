@echo off
curl localhost:8000/thingies/123 | jq . | (findstr "stuff" && echo Passed.) || echo Failed.