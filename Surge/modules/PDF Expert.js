#!name= PDF Expert
#!desc=Unlock Documents-PdfExpert-Scaner Pro
[MITM]
hostname = %APPEND% license.pdfexpert.com
[Script]
Documents-PdfExpert = type=http-response,pattern=^https:\/\/license\.pdfexpert\.com\/api\/.+\/subscription\/(refresh$|check$),requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/lvtinh1051989/Scripting/master/pdfexpert.js,script-update-interval=-1
