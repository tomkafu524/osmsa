FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app

# 复制Gradle配置文件
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src src

# 授予执行权限并构建
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon

# 运行阶段
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 启动应用
ENTRYPOINT ["java", "-jar", "app.jar"]
    