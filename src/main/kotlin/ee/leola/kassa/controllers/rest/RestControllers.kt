package ee.leola.kassa.controllers.rest

import ee.leola.kassa.models.*
import ee.leola.kassa.repository.*
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/feedback")
class Feedbacks(feedbackRepository: FeedbackRepository) : RestBaseController<Feedback, Long>(feedbackRepository)

@RestController
@RequestMapping("/paytype")
class Paytypes(paytypeRepository: PaytypeRepository) : RestBaseController<Paytype, Long>(paytypeRepository)

@RestController
@RequestMapping("/product")
class Products(productRepository: ProductRepository) : RestBaseController<Product, Long>(productRepository)

@RestController
@RequestMapping("/status")
class Statuses(statusRepository: StatusRepository) : RestBaseController<Status, Long>(statusRepository)

@RestController
@RequestMapping("/user")
class Users(userRepository: UserRepository) : RestBaseController<User, Long>(userRepository)