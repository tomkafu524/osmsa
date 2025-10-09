FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app

# 复制所有文件
COPY . .

# 构建JAR包
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon

# 运行阶段
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
    