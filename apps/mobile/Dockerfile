FROM thyrlian/android-sdk:latest

WORKDIR /app

COPY apps/mobile/Kotlin-JP .

RUN chmod +x gradlew

CMD ./gradlew assembleDebug && cp app/build/outputs/apk/debug/app-debug.apk /shared/client.apk
