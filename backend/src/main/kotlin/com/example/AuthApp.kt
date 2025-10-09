package com.example

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class AuthApp

@RestController
class TestController {
    // 测试接口：访问域名+/api/test 会返回成功信息
    @GetMapping("/api/test")
    fun test() = mapOf("status" to "success", "message" to "Backend is running!")
}

fun main(args: Array<String>) {
    runApplication<AuthApp>(*args)
}
    