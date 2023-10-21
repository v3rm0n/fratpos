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
    id("org.hibernate.orm") version "6.2.6.Final"
    id("org.springframework.boot") version "3.2.0-RC1"
    id("com.diffplug.spotless") version "6.20.0"
    id("io.spring.dependency-management") version "1.1.3"
    id("org.graalvm.buildtools.native") version "0.9.28"

}

repositories {
    mavenCentral()
    maven("https://repo.spring.io/snapshot")
    maven("https://repo.spring.io/milestone")
}

configurations.all {
    resolutionStrategy {
        //Pug4j uses older GraalVM version
        force("org.graalvm.sdk:graal-sdk:23.1.0")
        force("org.graalvm.compiler:compiler:23.1.0")
        force("org.graalvm.js:js:23.0.2")
        force("org.graalvm.js:js-scriptengine:23.0.2")
        force("org.graalvm.tools:profiler:23.0.2")
        force("org.graalvm.tools:chromeinspector:23.0.2")
    }
}


graalvmNative {
    binaries {
        named("main") {
            buildArgs.add("--enable-preview")
        }
    }
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

    implementation("io.hypersistence:hypersistence-utils-hibernate-62:3.6.0")


    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    runtimeOnly("com.mysql:mysql-connector-j")
    implementation("org.flywaydb:flyway-mysql")

    implementation("de.neuland-bfi:spring-pug4j:3.1.0") {
        exclude(group = "org.graalvm.sdk")
        exclude(group = "org.graalvm.compiler")
    }

    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

    testCompileOnly("org.projectlombok:lombok")

    testImplementation("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}