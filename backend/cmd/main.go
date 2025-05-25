package main

import (
    "github.com/gin-gonic/gin"
    "github.com/MJUrian-Learner/AlgoPark/backend/routes"
)

func main() {
    router := gin.Default()
    routes.SetupRoutes(router)
    router.Run(":8080")
}
