import org.springframework.boot.gradle.tasks.bundling.BootJar
import org.gradle.api.tasks.testing.logging.TestLogEvent.FAILED
import org.gradle.api.tasks.testing.logging.TestLogEvent.PASSED
import org.gradle.api.tasks.testing.logging.TestLogEvent.SKIPPED
import org.gradle.api.tasks.testing.logging.TestLogEvent.STANDARD_ERROR
import org.gradle.api.tasks.testing.logging.TestLogEvent.STANDARD_OUT
import org.gradle.api.tasks.testing.logging.TestLogEvent.STARTED
import org.springframework.boot.gradle.plugin.SpringBootPlugin

plugins {
    java
    jacoco
    id("org.springframework.boot") version "3.0.6"
    id("com.diffplug.spotless") version "6.18.0"
    id("io.spring.dependency-management") version "1.1.0"
}

java.sourceCompatibility = JavaVersion.VERSION_17
java.targetCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

tasks {
    named<BootJar>("bootJar") {
        launchScript()
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

spotless {
    java {
        removeUnusedImports()
        googleJavaFormat()
    }
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

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    runtimeOnly("com.mysql:mysql-connector-j")
    implementation("org.flywaydb:flyway-mysql")

    implementation("de.neuland-bfi:spring-pug4j:3.0.0")

    implementation("com.fasterxml.jackson.core:jackson-databind")

    implementation("org.webjars:bootstrap:3.3.7-1")
    implementation("org.webjars:angularjs:1.7.2")
    implementation("org.webjars:jquery:1.12.4")
    implementation("org.webjars.npm:angular-strap:2.3.12")

    testCompileOnly("org.projectlombok:lombok")

    testImplementation("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}