# 초기화
pm2 delete "panda-market-api" 2>/dev/null || true

#앱실행
# pm2 start dist/main.js --name "panda-market-api"
pm2 start ecosystem.config.js --env production

# 현재상태 저장
pm2 save

echo "PM2 실행 및 저장 완료! 'pm2 startup' 명령은 직접 터미널에서 실행해주세요!"
#-------
#앱 자동 실행
#pm2 startup 

#pm2 reload 0
#pm2 stop 0
#pm2 restart 0