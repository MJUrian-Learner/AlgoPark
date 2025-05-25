package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/MJUrian-Learner/AlgoPark/backend/controllers"
)

func SetupRoutes(router *gin.Engine) {
    api := router.Group("/api")
    {
        api.GET("/items", controllers.GetItems)
        api.POST("/items", controllers.CreateItem)
        // Add more routes as needed
    }
}
