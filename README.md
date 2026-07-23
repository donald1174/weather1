# 날씨 대시보드 → 텔레그램 자동 전송

매일 바그다드 현지시간 오전 6시(UTC 03:00)에, 날씨 대시보드 페이지를
스크린샷으로 찍어서 지정한 텔레그램 채팅방에 자동으로 올려주는 GitHub Actions
워크플로우입니다. 별도 서버 없이 GitHub 저장소 하나로 동작합니다.

## 1. 텔레그램 봇 만들기

1. 텔레그램 앱에서 **BotFather** 검색 (파란 체크가 붙은 공식 계정)
2. `/start` → `/newbot` 입력
3. 봇 이름과 아이디(예: `MyWeatherBot`, 반드시 `bot`으로 끝나야 함)를 순서대로 입력
4. 완료되면 아래처럼 **토큰**을 줍니다. 이걸 복사해두세요.
   ```
   123456789:ABCdefGhIJKlmNoPQRstuVwxYZ
   ```

## 2. 채팅방 ID(chat_id) 확인하기

**개인 채팅으로 받고 싶다면:**
1. 방금 만든 봇을 텔레그램에서 검색해서 `/start` 메시지를 하나 보냅니다
2. 브라우저에서 아래 주소를 열어봅니다 (TOKEN 자리에 1단계 토큰을 넣으세요)
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
3. 응답 JSON에서 `"chat":{"id":123456789, ...}` 부분의 숫자가 chat_id입니다

**그룹 채팅방으로 받고 싶다면:**
1. 봇을 해당 그룹에 초대합니다
2. 그룹에 아무 메시지나 하나 보냅니다 (봇이 메시지를 받아야 getUpdates에 나타남)
3. 위와 동일하게 `getUpdates` 주소를 열어 확인 — 그룹은 chat_id가 **음수**로 나옵니다 (예: `-1001234567890`)

## 3. GitHub 저장소에 Secrets 등록

1. 대시보드가 있는 저장소(`weather1`)의 **Settings → Secrets and variables → Actions** 이동
2. **New repository secret**을 두 번 눌러 아래 두 개를 등록
   - `TELEGRAM_BOT_TOKEN` = 1단계에서 받은 토큰
   - `TELEGRAM_CHAT_ID` = 2단계에서 확인한 chat_id

## 4. 워크플로우 파일 올리기

이 폴더 안의 두 파일을 저장소에 **그대로 같은 경로**로 올립니다.

```
.github/workflows/daily-weather-screenshot.yml
scripts/screenshot.js
```

GitHub 웹 UI에서 "Add file → Create new file"로 경로까지 포함해서
`.github/workflows/daily-weather-screenshot.yml` 라고 입력하면 폴더가 자동으로 생성됩니다.

`scripts/screenshot.js` 안의 `TARGET_URL`이 실제 배포 주소
(`https://donald1174.github.io/weather1/`)와 일치하는지 한 번 확인해주세요.

## 5. 테스트 실행

1. 저장소 상단 **Actions** 탭 이동
2. 왼쪽에서 **Daily Weather Screenshot to Telegram** 워크플로우 선택
3. 오른쪽 **Run workflow** 버튼으로 수동 실행 (스케줄 기다릴 필요 없이 바로 테스트 가능)
4. 1~2분 후 텔레그램 채팅방에 스크린샷이 도착하는지 확인

정상 동작하면, 이후로는 매일 바그다드 시간 오전 6시에 자동으로 실행됩니다.

## 참고

- GitHub Actions 무료 요금제는 public 저장소면 무제한, private 저장소는
  매달 2,000분까지 무료입니다. 이 작업은 1회당 1~2분 정도라 충분합니다.
- `cron: '0 3 * * *'`는 UTC 기준입니다. 이라크는 서머타임을 쓰지 않아
  UTC+3이 1년 내내 유지되지만, 시간을 바꾸고 싶다면 이 값만 수정하면 됩니다
  (예: UTC 04:00에 보내고 싶으면 `0 4 * * *`).
- GitHub Actions의 스케줄 실행은 정확히 그 분에 실행되는 걸 보장하지 않고
  몇 분 정도 지연될 수 있습니다 (GitHub 전체적으로 흔한 특성입니다).
