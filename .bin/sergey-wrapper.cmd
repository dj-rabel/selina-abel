mkdir .\var\build\sergey
mkdir .\tpl\imports
call .\node_modules\.bin\sergey --root=./tpl/ --imports=./imports --output=../var/build/sergey --exclude=imports
del .\web\*.html
move /Y .\var\build\sergey\*.html .\web\
rmdir .\var\build\sergey
