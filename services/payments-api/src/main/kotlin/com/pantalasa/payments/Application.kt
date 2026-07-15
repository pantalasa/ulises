package com.pantalasa.payments

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class PaymentsApplication

@RestController
class PaymentsController {
    @GetMapping("/")
    fun index() = mapOf("service" to "payments-api", "status" to "ok")

    @GetMapping("/health")
    fun health() = mapOf("status" to "healthy")
}

fun main(args: Array<String>) {
    runApplication<PaymentsApplication>(*args)
}
