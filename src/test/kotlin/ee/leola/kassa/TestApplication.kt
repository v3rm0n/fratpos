package ee.leola.kassa

import org.springframework.boot.fromApplication
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.context.annotation.Bean
import org.testcontainers.containers.BindMode
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.containers.Network
import org.testcontainers.utility.DockerImageName

fun main(args: Array<String>) {
    fromApplication<Application>()
        .with(ContainersConfiguration::class.java)
        .run(*args)
}

private const val mySqlRootPassword = "supersecret"

@TestConfiguration(proxyBeanMethods = false)
internal class ContainersConfiguration {

    @Bean
    fun dockerNetwork(): Network {
        return Network.newNetwork()
    }

    @Bean
    @ServiceConnection
    fun mySqlContainer(network: Network): MySQLContainer<*> {
        return MySQLContainer("mysql:8.0")
            .withNetwork(network)
            .withNetworkAliases("db")
            .withCommand("mysqld", "--sql_mode=")
            .withEnv("MYSQL_DATABASE", "fratpos")
            .withFileSystemBind(".mysql-data", "/var/lib/mysql", BindMode.READ_WRITE)
    }

    @Bean
    fun phpMyAdminContainer(mySQLContainer: MySQLContainer<*>, network: Network): GenericContainer<*> {
        return GenericContainer(DockerImageName.parse("phpmyadmin/phpmyadmin"))
            .dependsOn(mySQLContainer)
            .withNetwork(network)
            .withExposedPorts(80)
            .withEnv("PMA_HOST", "db")
    }
}