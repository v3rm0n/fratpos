import org.gradle.api.tasks.testing.logging.TestLogEvent.FAILED
import org.gradle.api.tasks.testing.logging.TestLogEvent.PASSED
import org.gradle.api.tasks.testing.logging.TestLogEvent.SKIPPED
import org.gradle.api.tasks.testing.logging.TestLogEvent.STANDARD_ERROR
import org.gradle.api.tasks.testing.logging.TestLogEvent.STANDARD_OUT
import org.gradle.api.tasks.testing.logging.TestLogEvent.STARTED
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.plugin.SpringBootPlugin
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    java
    jacoco
    kotlin("jvm") version "1.9.0"
    kotlin("plugin.spring") version "1.9.0"
    kotlin("plugin.jpa") version "1.9.0"
    id("org.hibernate.orm") version "6.2.6.Final"
    id("org.springframework.boot") version "3.1.2"
    id("io.spring.dependency-management") version "1.1.3"
    id("org.jlleitschuh.gradle.ktlint") version "11.5.1"
    id("org.graalvm.buildtools.native") version "0.9.24"
}


java {
    sourceCompatibility = JavaVersion.VERSION_17
}

configurations.all {
    resolutionStrategy.eachDependency {
        if (requested.group.startsWith("org.graalvm")) {
            this.useVersion("22.3.0")
        }
    }
}

repositories {
    mavenCentral()
}

hibernate {
    enhancement {
        enableAssociationManagement.set(true)
    }
}

graalvmNative {
    binaries {
        named("main") {
            debug = true
            verbose = true
        }
    }
    toolchainDetection.set(false)
}

tasks {

    withType<KotlinCompile> {
        kotlinOptions {
            freeCompilerArgs += "-Xjsr305=strict"
            jvmTarget = "17"
        }
    }

    test {
        finalizedBy(jacocoTestReport)
        useJUnitPlatform()
        testLogging {
            events = setOf(STARTED, PASSED, FAILED, SKIPPED, STANDARD_OUT, STANDARD_ERROR)
        }
    }

    jacocoTestReport {
        dependsOn(test) // tests are required to run before generating the report
        reports {
            xml.required.set(false)
            csv.required.set(false)
            html.outputLocation.set(layout.buildDirectory.dir("jacocoHtml"))
        }
    }
}

ktlint {
    disabledRules.set(setOf("no-wildcard-imports"))
}

dependencyManagement {
    imports {
        mavenBom(SpringBootPlugin.BOM_COORDINATES)
    }
}

dependencies {

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    runtimeOnly("com.mysql:mysql-connector-j")
    implementation("org.flywaydb:flyway-mysql")

    implementation("io.hypersistence:hypersistence-utils-hibernate-62:3.5.0")

    implementation("de.neuland-bfi:spring-pug4j:3.0.0")

    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-hibernate6")

    testImplementation("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:mysql")
}