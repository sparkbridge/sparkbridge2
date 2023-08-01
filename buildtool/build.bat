cd ../../

md tmp

md "tmp/sparkbridge2"

xcopy sparkbridge2 "tmp/sparkbridge2" /s /e /exclude:%cd%\sparkbridge2\buildtool\pack.config

cd ./sparkbridge2/buildtool

7za.exe a ../../tmp/sparkbridge2.zip ../../tmp/sparkbridge2/*

cd ../../tmp

REN sparkbridge2.zip sparkbridge2.llplugin

pause