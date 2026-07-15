package com.pantalasa.payments

import kotlin.test.Test
import kotlin.test.assertEquals

class ApplicationTest {
    @Test
    fun reportsServiceName() {
        assertEquals("payments-api", PaymentsController().index()["service"])
    }
}
